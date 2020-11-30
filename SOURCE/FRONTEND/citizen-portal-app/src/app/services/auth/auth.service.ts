import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Constructor */
  constructor(private apiService: ApiService) {}

  /**
   * Logins the user
   * @param {string} usernameOrEmail Username or email of the user
   * @param {string} password Password of the user
   * @returns {Promise<IResponse>}
   * */
  async login(usernameOrEmail: string, password: string) {
    return await this.apiService.post('user/login', {
      usernameOrEmail,
      password,
    });
  }

  /**
   * Registers a user
   * @param {string} email Email of the user
   * @param {string} username Username of the user
   * @param {string} password Password of the user
   * @returns {Promise<IResponse>}
   * */
  async register(email: string, username: string, password: string) {
    return await this.apiService.post('user/register', {
      email,
      username,
      password,
    });
  }

  /**
   * Logouts a user
   * @returns {Promise<IResponse>}
   * */
  async logout() {
    return await this.apiService.get('user/logout');
  }
}
