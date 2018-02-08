/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
