import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/model/category.model';

@Entity('movies')
export class Movie {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    showDate: Date;

    @ManyToOne(() => Category,
        (category) => category.movies,
        {nullable: false}
    )
    @JoinColumn({ name: 'categoryId' })
    category: Category;
}