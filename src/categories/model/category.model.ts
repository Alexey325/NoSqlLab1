import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../../movies/model/movie.model';

@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Movie, (movie) => movie.category)
    movies: Movie[];
}