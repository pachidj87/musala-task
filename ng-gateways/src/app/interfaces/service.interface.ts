import { Observable } from 'rxjs';
import { DataTablesResponse } from '../entities/datatables-response.entity';

export interface ServiceInterface {
  create<T>(element: T): Observable<T>;
  read<T>(id: string): Observable<T>;
  update<T>(id: string, element: T): Observable<T>;
  delete<T>(id: string): Observable<boolean>;
  remove<T>(id: string): Observable<boolean>;
  listAll<T>(): Observable<Array<T>>;
  datatables<T>(dataTablesParameters: any): Observable<DataTablesResponse<T>>;
  select<T>(params: any): any;
  reload(): void;
}
