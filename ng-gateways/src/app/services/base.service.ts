import { HttpClient } from '@angular/common/http';
import { catchError, tap, retryWhen, delay, take, concatMap, shareReplay } from 'rxjs/operators';
import { Observable, of, throwError, Subject } from 'rxjs';

import { DataTablesResponse } from '../entities/datatables-response.entity';
import { ServiceInterface } from '../interfaces/service.interface';
import { environment } from 'src/environments/environment';
import { DatatablesRequest } from '../entities/datatables-request.entity';
import { NotificationsService } from './notifications.service';

/**
 * BaseService
 */
export abstract class BaseService<T> implements ServiceInterface {
  /**
   * Service base API endpoint
   */
  protected baseEndPoint!: string;

  /**
   * Needed if you wich to send extra parameters in the endpoint url
   * Ex: ?param1=value1&param2=value2
   */
  public extraParams: string = '';

  /**
   * Excluded response status from retry requests
   */
  protected excludedStatus!: Array<number>;

  /**
   * Temp cache
   */
  private _$cache!: Array<Observable<any>>;

  /**
   * Reload data observer notify when to empty cache
   */
  private reload$ = new Subject<void>();

  /**
   * Enable or disable cache for service
   */
  protected cacheEnabled = true;

  /**
   * BaseService constructor
   *
   * @param http: HttpClient Client object
   * @param notificationService: NotificationService System notifications service
   */
  constructor(
    protected readonly http: HttpClient,
    protected readonly notificationService: NotificationsService
  ) {
    this.excludedStatus = environment.constants.excludedStatus;
  }

  /**
   * Create resource
   *
   * @param element: T Represent the resource entity to be created
   */
  create<T>(element: T): Observable<T> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.post<T>(this.getURL(), { ...element })
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
          this.reload();
        }),
        catchError(async (err) => {
          console.error(err);

          // @ts-ignore
          NProgress.done();


          this.handleError(err);
        })
      );

    return response as Observable<T>;
  }

  /**
   * Read reasource
   *
   * @param id: string Represent the id of the resource to be retreived
   */
  read<T>(id: string): Observable<T> {
    // If no cache
    if (!this.cacheEnabled) return this.getEntityData(id);

    // @ts-ignore
    if (!this._$cache || !this._$cache['entity_' + id]) {
      // Initialise cache
      this._$cache = this._$cache || [];

      //@ts-ignore
      this._$cache['entity_' + id] = this.getEntityData(id)
        .pipe(
          shareReplay(environment.constants.cacheSize)
        );
    }

    // @ts-ignore
    return this._$cache['entity_' + id] as Observable<T>;
  }

  /**
   * Update resource
   *
   * @param id: string Represent the id of the resource to be retreived
   * @param element: T Represent the resource entity to be updated
   */
  update<T>(id: string, element: T): Observable<T> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.put<T>(`${this.getURL()}/${id}${this.extraParams ? '/' + this.extraParams : '' }`, { ...element })
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
          this.reload();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();


          this.handleError(err);
        })
      );

    return response as Observable<T>;
  }

  /**
   * Delete reasource
   *
   * @param id: string Represent the id of the resource to be deleted (soft)
   */
  delete(id: string): Observable<boolean> {
    throw new Error("Method not implemented.");
  }

  /**
   * Read reasource
   *
   * @param id: string Represent the id of the resource to be removed (unreversible)
   */
  remove(id: string): Observable<boolean> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.delete<T>(`${this.getURL()}/${id}${this.extraParams ? '/' + this.extraParams : '' }`)
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
          this.reload();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();


          this.handleError(err);
        })
      );

    return response as unknown as Observable<boolean>;
  }

  /**
   * List all type T resources
   */
  public listAll<T>(): Observable<Array<T>> {
    throw new Error("Method not implemented.");
  }

  /**
   * Obtain the data for datatable list plugin
   *
   * @param dataTablesParameters: DatatablesRequest Represent common datatables request params
   */
  datatables<T>(dataTablesParameters: DatatablesRequest): Observable<DataTablesResponse<T>> {
    // If no cache
    if (!this.cacheEnabled) return this.getTableData(dataTablesParameters);

    const currentKey = 'datatables_start_' + dataTablesParameters.start + '_to_' + dataTablesParameters.length + '_' + this.extraParams;

    // @ts-ignore
    if (!this._$cache || !this._$cache[currentKey]) {
      // Initialise cache
      this._$cache = this._$cache || [];

      //@ts-ignore
      this._$cache[currentKey] = this.getTableData(dataTablesParameters)
        .pipe(
          shareReplay(environment.constants.cacheSize)
        );
    }

    // @ts-ignore
    return this._$cache[currentKey] as Observable<DataTablesResponse<T>>;
  }

  /**
   * Obtain the data for select elements, usualy select2 plugin
   *
   * @param params: T Represent params pased to the endpoint
   */
  select<T>(params: T | null = null): Observable<Array<T>> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.post(`${this.getURL()}/select${this.extraParams ? '/' + this.extraParams : '' }`, { ...params })
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();


          this.handleError(err);

          return { results: [] };
        })
      );

    return response as Observable<Array<T>>;
  }


  /**
   * Count reasources
   */
  count(): Observable<number> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.get(`${this.getURL()}/count${this.extraParams ? '/' + this.extraParams : '' }`)
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();


          this.handleError(err);
        })
      );

    return response as Observable<number>;
  }
  /**
   * Empty service cache
   */
  reload(): void {
    this.reload$.next();

    this._$cache = [];
  }

  /**
   * Perform the request to obtain entity data
   *
   * @param id: string Represent the id of the resource to be retreived
   */
  private getEntityData<T>(id: string): Observable<T> {
    // @ts-ignore
    NProgress.start();
    const response = this.http.get<T>(`${this.getURL()}/${id}${this.extraParams ? '/' + this.extraParams : '' }`)
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();

          this.handleError(err);
        })
      );

    return response as Observable<T>;
  }

  /**
   * Perform the request to obtain the data for datatable list plugin
   *
   * @param dataTablesParameters: DatatablesRequest Represent common datatables request params
   */
  private getTableData<T>(dataTablesParameters: DatatablesRequest): Observable<DataTablesResponse<T>> {
    // @ts-ignore
    NProgress.start();

    const response = this.http.post<DataTablesResponse<T>>(`${this.getURL()}/datatables${this.extraParams ? '/' + this.extraParams : '' }`,
      dataTablesParameters, {})
      .pipe(
        retryWhen(err => err.pipe(
          delay(environment.constants.delay),
          take(environment.constants.retries),
          concatMap((e, i) => {
            return (i < 2 && !this.excludedStatus.find(er => er === e.status)) ? of(e) : throwError(e)
          }),
        )),
        tap(() => {
          // @ts-ignore
          NProgress.done();
        }),
        catchError(async (err) => {
          console.error(err);
          // @ts-ignore
          NProgress.done();

          this.handleError(err);

          return new DataTablesResponse();
        })
      );

    return response as Observable<DataTablesResponse<T>>;
  }

  /**
   * Obtain target endpoint URL
   */
  protected getURL(): string {
    return `${environment.servicesURL}/${this.baseEndPoint}`;
  }

  protected handleError(exception: any) {
    switch (exception.error.code) {
      case 11000: // Duplicated key
        // Here goes something better as a Subject or something to highlight duplicated fields etc ...
        // Or for better implementation we cloud redefine handleError on the target service
        this.notificationService.error(exception.error?.description || exception.message);
        break;
      default:
        switch (exception.status) {
          // Here goes some custom message according to HTTP status error
          default:
            this.notificationService.error('Error occurr triying to process the request. We are working on it. Please try again later');
        }

    }

  }
}
