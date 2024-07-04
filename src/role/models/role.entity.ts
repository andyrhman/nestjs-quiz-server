// user.entity.ts
import { Permission } from 'src/permission/models/permission.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    // Role (Many) to Permissions (Many) relationship
    // That means Many Roles has Many Permissions
    // Use cascade to delete the roles column
    @ManyToMany(() => Permission, { cascade: true })
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
    })
    permissions: Permission[];
}