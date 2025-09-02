import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(array: any[], text: string = '', column: string = 'title'): unknown {

    if (!text) return array;
    if (!array) return array;

    text = text.toLowerCase();
    array = array.filter(item => item[column].toLowerCase().includes(text));
    console.log(array)
    return array;
  }

}
