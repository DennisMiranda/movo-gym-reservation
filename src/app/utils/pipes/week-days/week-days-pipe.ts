import { Pipe, PipeTransform } from '@angular/core';
import { DAYS } from '../../constants';

@Pipe({
  name: 'weekDays',
})
export class WeekDaysPipe implements PipeTransform {
  private days = DAYS;

  /**
   * Transform an array of numbers to a DAYS string
   * @param value
   * @param args
   * @returns string (e.g., 'Monday, Tuesday, Wednesday')
   */
  transform(value: number[], ...args: unknown[]): string {
    return value
      .map((day) => {
        return this.days[day];
      })
      .join(', ');
  }
}
