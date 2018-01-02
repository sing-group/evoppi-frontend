import { Injectable } from '@angular/core';
import {User} from '../classes/user';

@Injectable()
export class AuthService {
  private user: User;

  constructor() {
    this.user = new User();
  }

  logIn(username: string, password: string, role: string) {
    this.user.login = username;
    this.user.role = role;
    this.user.authHeader = 'Basic ' + btoa(username + ':' + password);
    this.user.authenticated = true;
    this.user.save();
  }

  logOut() {
    this.user.clear();
    this.user = new User();
  }

  getUser(): User {
    return this.user;
  }

  getAuthorizationHeader(): string {
    return this.user.authHeader;
  }
}
