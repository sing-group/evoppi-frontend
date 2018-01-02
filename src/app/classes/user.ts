export class User {
  private _authenticated: boolean;
  private _role: string;
  private _username: string;

  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this._role = user._role;
      this._username = user._username;
      this._authenticated = user._authenticated;
    } else {
      this._authenticated = false;
    }
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  public save() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  public clear() {
    localStorage.removeItem('user');
  }
}
