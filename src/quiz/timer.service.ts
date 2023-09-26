import { BadRequestException, Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class QuizTimerService {
    private timers: Record<string, NodeJS.Timeout> = {};

    startTimer(userId: string, questionId: number, timeLimit: number) {
        this.timers[`${userId}-${questionId}`] = setTimeout(() => {
            delete this.timers[`${userId}-${questionId}`];
        }, timeLimit * 60 * 1000); // Convert minutes to milliseconds.
    }

    checkTimer(userId: string, questionId: number) {
        if (!this.timers[`${userId}-${questionId}`]) {
            throw new BadRequestException('Time limit exceeded');
        }
    }
}
