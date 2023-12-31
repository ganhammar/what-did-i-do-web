import { FetchBase } from '@wdid/shared';

export interface RegisterParamters {
  email: string;
  password: string;
  returnUrl: string;
}

export interface EditParamters {
  email: string;
  password: string;
}

export interface LoginParameters {
  email: string;
  userName?: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  succeeded: boolean;
  isLockedOut: boolean;
  isNotAllowed: boolean;
  requiresTwoFactor: boolean;
}

export class UserService extends FetchBase {
  baseUrl = '/api/login/user';

  async register(data: RegisterParamters) {
    return await this.post<User>(`${this.baseUrl}/register`, data);
  }

  async edit(data: EditParamters) {
    return await this.post<User>(`${this.baseUrl}/edit`, data);
  }

  async login(data: LoginParameters) {
    return await this.post<LoginResult>(`${this.baseUrl}/login`, data);
  }

  async user() {
    return await this.get<User>(`${this.baseUrl}/current`);
  }

  async logout() {
    return await this.get(`${this.baseUrl}/logout`);
  }
}
