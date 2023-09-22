import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, formatString: string = 'dd/MM/yyyy'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, formatString);
  }
}