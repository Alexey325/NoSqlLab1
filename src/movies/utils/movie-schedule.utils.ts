import { Movie } from '../model/movie.model';

export function getDayBounds(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return {startOfDay, endOfDay};
}

export function hasTimeConflict(newShowDate: Date, newDuration: number, movies: Movie[]): boolean {
    const newStart = newShowDate.getTime();
    const newEnd = newStart + newDuration * 60 * 1000;

    return movies.some((movie) => {
        const existingStart = movie.showDate.getTime();
        const existingEnd =
            existingStart + movie.duration * 60 * 1000;

        return (
            newStart < existingEnd &&
            newEnd > existingStart
        );
    });
}