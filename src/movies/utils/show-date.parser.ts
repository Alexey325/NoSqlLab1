import {BadRequestException} from "@nestjs/common";

export function parseShowDate(value: string): Date {
    const match = value.match(/^(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/);

    if (!match) {
        throw new BadRequestException(
            'Поле showDate должно иметь формат DD.MM HH:mm',
        );
    }

    const [, day, month, hours, minutes] = match;

    const year = new Date().getFullYear();

    return new Date(
        year,
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
    );
}