import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
import Stripe from 'stripe';
import { JoinPaidClassroomService } from 'src/classroom/join-paid-classroom.service';
import { Order } from './models/order.entity';
import { Cart } from 'src/classroom/models/join-classroom.entity';
import { OrderItem } from './models/order-item.entity';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private authService: AuthService,
        private userService: UserService,
        private joinPaidClassroomService: JoinPaidClassroomService,
        private dataSource: DataSource,
        private configService: ConfigService,
        @InjectStripeClient() private readonly stripeClient: Stripe,
        private eventEmiter: EventEmitter2,
    ) { }

    @UseGuards(AuthGuard)
    @Post('checkout/orders')
    async createOrder(
        @Body() body: CreateOrderDto,
        @Req() request: Request
    ) {
        const userId = await this.authService.userId(request);

        const user = await this.userService.findOne({ id: userId });

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const o = new Order();
            o.name = user.fullname;
            o.email = user.email;
            o.user_id = userId;

            const order = await queryRunner.manager.save(o);

            // * Stripe.
            const line_items = [];

            for (let c of body.classrooms) {

                const cart: Cart[] = await this.joinPaidClassroomService.find({ id: c.class_id, user_id: userId }, ['classroom', 'user']);

                const checkId = cart.some((checkClass) => checkClass.id === c.class_id);
                if (!checkId) {
                    throw new NotFoundException("Clasroom id not found");
                }

                if (cart.length === 0) {
                    throw new NotFoundException("Order not found");
                }

                if (cart[0].paid_status === "Paid") {
                    throw new BadRequestException("Invalid order, please add new order.");
                }


                const orderItem = new OrderItem();

                orderItem.order = order;

                orderItem.product_title = cart[0].classroom.name;
                orderItem.price = cart[0].classroom.price;
                orderItem.classroom_id = cart[0].classroom.id;

                cart[0].order_id = order.id;

                await queryRunner.manager.update(Cart, cart[0].id, cart[0]);

                await queryRunner.manager.save(orderItem);

                // * Stripe
                line_items.push({
                    price_data: {
                        currency: 'idr',
                        unit_amount: cart[0].classroom.price,
                        product_data: {
                            name: `${cart[0].classroom.name}`,
                            description: cart[0].classroom.small_description,
                            images: [
                                `${cart[0].classroom.picture}`
                            ]
                        }

                    },
                    quantity: 1
                });
            }
            // * Stripe
            const source = await this.stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items,
                success_url: `${this.configService.get('ORIGIN_2')}/success?source={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.configService.get('ORIGIN_2')}/error`,
            });

            order.transaction_id = source['id'];
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            return source;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            throw new BadRequestException(err.response);
        } finally {
            await queryRunner.release();
        }
    }

    @Post('checkout/orders/confirm')
    async confirm(
        @Body('source') source: string,
        @Req() request: Request
    ) {
        const user = await this.authService.userId(request);

        const order = await this.orderService.findOne({
            transaction_id: source,
            user_id: user
        }, ['user', 'order_items']);

        if (!order) {
            throw new NotFoundException("Order not found");
        }

        const carts: Cart[] = await this.joinPaidClassroomService.find({ order_id: order.id, user_id: user });

        if (carts.length === 0) {
            throw new ForbiddenException();
        }
        carts.map(async (c) => (
            await this.joinPaidClassroomService.update(c.id, { paid_status: 'Paid' })
        ));
        // for (let cart of carts) {
        //     await this.cartService.update(cart.id, { completed: true });
        // }
        await this.orderService.update(order.id, { completed: true })
        // await this.eventEmiter.emit('order.completed', order);
        return {
            message: 'success'
        }
    }

}
