import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto {
    @ApiProperty({
        example: '08.10 21:30',
        description: 'Новые дата и время показа в формате DD.MM HH:mm',
    })
    showDate: string;

    @ApiPropertyOptional({
        example: '150',
        description: 'Новая длительность фильма в минутах (если не передано - остаётся прежней)',
    })
    duration?: number;
}
