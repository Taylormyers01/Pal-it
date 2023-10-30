import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => {
      // eslint-disable-next-line guard-for-in
      for(const value in it){
        const v = String(it[value]).toLocaleLowerCase()
        if(String(v).includes(searchText)){
          return true;
        }
      }
      return false;
    })

  }

}
