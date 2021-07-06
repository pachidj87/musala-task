class SearchObject extends Object {}

export abstract class DatatablesRequestDto {
  columns: Array<any> = [];
  order: Array<any> = [];
  search: SearchObject = {};
  length = 10;
  draw = 0;
  start = 0;
}
