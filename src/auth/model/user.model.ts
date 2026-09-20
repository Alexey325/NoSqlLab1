import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "../../roles/model/role.model";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    passwordHash: string

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];
}