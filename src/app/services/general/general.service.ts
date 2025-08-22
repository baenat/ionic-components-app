import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  showLoading?: boolean;
  loadingMessage?: string;
  showError?: boolean;
  timeout?: number;
  retries?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private baseUrl: string = '';

  constructor(
    private _httpClient: HttpClient,
    private _toasController: ToastController,
    private _loadingController: LoadingController,
  ) { }

  /**
   * Método GET genérico
   */
  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.makeRequest<T>('GET', endpoint, null, options);
  }

  /**
   * Método POST genérico
   */
  post<T>(endpoint: string, data: any, options?: RequestOptions): Observable<T> {
    return this.makeRequest<T>('POST', endpoint, data, options);
  }

  /**
   * Método PUT genérico
   */
  put<T>(endpoint: string, data: any, options?: RequestOptions): Observable<T> {
    return this.makeRequest<T>('PUT', endpoint, data, options);
  }

  /**
   * Método PATCH genérico
   */
  patch<T>(endpoint: string, data: any, options?: RequestOptions): Observable<T> {
    return this.makeRequest<T>('PATCH', endpoint, data, options);
  }

  /**
   * Método DELETE genérico
   */
  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.makeRequest<T>('DELETE', endpoint, null, options);
  }

  /**
   * Método principal que maneja todas las peticiones
   */
  private makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Observable<any> {

    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    let request: Observable<any>;

    // Crear la petición según el método HTTP
    switch (method.toUpperCase()) {
      case 'GET':
        request = this._httpClient.get<T>(url, httpOptions).pipe();
        break;
      case 'POST':
        request = this._httpClient.post<T>(url, data, httpOptions);
        break;
      case 'PUT':
        request = this._httpClient.put<T>(url, data, httpOptions);
        break;
      case 'PATCH':
        request = this._httpClient.patch<T>(url, data, httpOptions);
        break;
      case 'DELETE':
        request = this._httpClient.delete<T>(url, httpOptions);
        break;
      default:
        return throwError('Método HTTP no soportado');
    }

    return request.pipe(
      catchError(error => this.handleError(error, options?.showError))
    );
  }

  /**
 * Construir URL completa
 */
  private buildUrl(endpoint: string): string {
    endpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${endpoint}`;
  }

  /**
 * Construir opciones HTTP
 */
  private buildHttpOptions(options?: RequestOptions): any {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (options?.headers) {
      if (options.headers instanceof HttpHeaders) {
        headers = options.headers;
      } else {
        Object.keys(options.headers).forEach(key => {
          headers = headers.set(key, options.headers![key] as string);
        });
      }
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const httpOptions: any = { headers };

    return httpOptions;
  }

  /**
 * Mostrar loading si es necesario
 */
  private async showLoading(showLoading?: boolean, message?: string): Promise<HTMLIonLoadingElement | null> {
    if (showLoading) {
      const loading = await this._loadingController.create({
        message: message || 'Cargando...',
        spinner: 'crescent'
      });
      await loading.present();
      return loading;
    }
    return null;
  }

  /**
   * Manejar errores HTTP
   */
  private handleError(error: HttpErrorResponse, showError: boolean = true): Observable<never> {
    console.error('Error HTTP:', error);

    if (showError) {
      this.showErrorMessage(this.getErrorMessage(error));
    }

    return throwError(error);
  }

  /**
   * Obtener mensaje de error legible
   */
  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 0:
        return 'Sin conexión a internet';
      case 400:
        return 'Petición incorrecta';
      case 401:
        return 'No autorizado';
      case 403:
        return 'Acceso denegado';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error interno del servidor';
      case 502:
        return 'Servidor no disponible';
      case 503:
        return 'Servicio no disponible';
      default:
        return error.message || 'Error desconocido';
    }
  }

  /**
   * Mostrar mensaje de error
   */
  private async showErrorMessage(message: string): Promise<void> {
    const toast = await this._toasController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}
