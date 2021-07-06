export class DataTablesResultsDto<T> {
  data!: Array<T>;
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}
