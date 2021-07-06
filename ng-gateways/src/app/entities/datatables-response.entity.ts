export class DataTablesResponse<T> {
  data: Array<T> = [];
  draw: number = 0;
  recordsFiltered: number = 0;
  recordsTotal: number = 0;
}
