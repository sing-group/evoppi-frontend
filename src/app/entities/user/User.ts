/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Role} from '../data/role.enum';

export class User {
  private _authenticated: boolean;
  private _role: Role;
  private _name: string;
  private _email: string;
  private _authHeader: string;
  private _password?: string;

  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this._role = user._role;
      this._name = user._name;
      this._email = user._email;
      this._authenticated = user._authenticated;
      this._authHeader = user._authHeader;
    } else {
      this._authenticated = false;
      this._role = Role.GUEST;
    }
  }

  get authHeader(): string {
    return this._authHeader;
  }

  set authHeader(value: string) {
    this._authHeader = value;
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }

  get role(): Role {
    return this._role;
  }

  set role(value: Role) {
    this._role = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  public save() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  public clear() {
    localStorage.removeItem('user');
  }
}
