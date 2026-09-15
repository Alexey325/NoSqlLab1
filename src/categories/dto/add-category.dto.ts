import {ApiProperty} from "@nestjs/swagger";

export class AddCategoryDto {

    @ApiProperty({
        description: "Название категории",
        example: "Фантастика",
    })
    name: string;
}