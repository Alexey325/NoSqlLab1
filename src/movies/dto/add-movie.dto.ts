import { ApiProperty } from '@nestjs/swagger';

export class AddMovieDto {
    @ApiProperty({
        example: 'Интерстеллар',
        description: 'Название фильма',
    })
    title: string;

    @ApiProperty({
        example: 'Фантастический фильм о космосе',
        description: 'Описание фильма',
    })
    description: string;

    @ApiProperty({
        example: 'Фантастика',
        description: 'Название категории фильма',
    })
    category: string;

    @ApiProperty({
        example: '08.10 20:00',
        description: 'Дата и время показа в формате DD.MM HH:mm',
    })
    showDate: string;

    @ApiProperty({
        example: '150',
        description: 'Длительность фильма в минутах',
    })
    duration: number;
}