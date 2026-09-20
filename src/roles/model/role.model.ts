import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../auth/model/user.model";

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    value: string;

    @Column()
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}