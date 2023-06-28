import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numbers'
})
export class NumbersPipe implements PipeTransform {

  transform(number: number | string): String | number {
    number = parseInt(number as string);

    if (number <= 999) {
      return number;
    }
    else if (number >= 1000 && number <= 999999) {

      return (number / 1000).toFixed(1) + 'K';
    }
    else if (number >= 1000000 && number <= 999999999) {
      return (number / 1000000).toFixed(1) + 'M';
    }
    else if (number >= 1000000000 && number <= 999999999999) {
      return (number / 1000000000).toFixed(1) + 'B';
    }
    else
      return number;
  }
}
