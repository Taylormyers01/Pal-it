/*
 * Function used to workaround https://github.com/microsoft/TypeScript/issues/16069
 * es2019 alternative `const filteredArr = myArr.flatMap((x) => x ? x : []);`
 */
export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

export const filterNaN = (input: number): number => (isNaN(input) ? 0 : input);

export function sortByItem(array:any[] | undefined | null,property:string): any[]{
  if(array){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return array.sort((item1,item2)=> item1[property].localeCompare(item2[property]));
  }
  else {
    return new Array(1)
  }
}
