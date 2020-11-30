import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IResponse, IResponseStatus } from '../../interfaces';
import { SnackBarService } from '../snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /** The API's base URL including protocol, port etc */
  public readonly baseUrl = env.api.baseUrl;

  /** Default request options */
  private readonly defaultOptions: any = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  /** Allowed request methods */
  private readonly allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  /** Constructor */
  public constructor(public http: HttpClient, private snackBarService: SnackBarService) {}

  /**
   * Request wrapper
   * @param {string} method HTTP method (eq. GET, POST, PUT, PATCH or DELETE)
   * @param {string} endpoint Endpoint to trigger
   * @param {object} [options] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async request(method: string, endpoint: string, options?: object): Promise<IResponse> {
    try {
      if (!this.allowedMethods.includes(method)) {
        throw new Error(`Method "${method}" is not allowed`);
      }

      const response = await this.http
        .request<IResponse>(method, `${this.baseUrl}${endpoint}`, options)
        .toPromise();

      if (response.status !== IResponseStatus.success) {
        const message = response.message ? `: ${response.message}` : '';
        if (response.message) {
          this.snackBarService.openSnackbarError(response.message);
        }
        throw new Error(`${response.status}${message}`);
      }
      return response;
    } catch (error) {
      const message =
        error instanceof HttpErrorResponse
          ? `${error.statusText} (${error.status})`
          : error.message;
      this.snackBarService.openSnackbarError(`Request failed (${message})`);
      throw new Error(`Request failed (${message})`);
    }
  }

  /**
   * Generates a GET request for a given endpoint
   * @param {string} endpoint Endpoint to trigger
   * @param {any} [params] Optional request paramters
   * @param {any} [reqOpts] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async get(endpoint: string, params?: any, reqOpts?: any): Promise<IResponse> {
    const options = {
      ...this.defaultOptions,
      ...reqOpts,
      params: params ? new HttpParams() : null,
    };

    if (params) {
      Object.entries(params).forEach(
        ([key, value]) => (options.params = options.params.set(key, value))
      );
    }
    return this.request('GET', endpoint, options);
  }

  /**
   * Generates a POST request for a given endpoint
   * @param {string} endpoint Endpoint to trigger
   * @param {any} body Request body
   * @param {any} [reqOpts] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async post(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('POST', endpoint, { ...reqOpts, body });
  }

  /**
   * Generates a PUT request for a given endpoint
   * @param {string} endpoint Endpoint to trigger
   * @param {any} body Request body
   * @param {any} [reqOpts] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async put(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('PUT', endpoint, { ...reqOpts, body });
  }

  /**
   * Generates a DELETE request for a given endpoint
   * @param {string} endpoint Endpoint to trigger
   * @param {any} [reqOpts] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async delete(endpoint: string, reqOpts?: any): Promise<IResponse> {
    return this.request('DELETE', endpoint, reqOpts);
  }

  /**
   * Generates a PATCH request for a given endpoint
   * @param {string} endpoint Endpoint to trigger
   * @param {any} body Request body
   * @param {any} [reqOpts] Optional request options
   * @returns {Promise<IResponse>}
   * */
  public async patch(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('PATCH', endpoint, { ...reqOpts, body });
  }
}
