export class User {
  private _authenticated: boolean;
  private _role: string;
  private _login: string;
  private _email: string;
  private _authHeader: string;

  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this._role = user._role;
      this._login = user._login;
      this._email = user._email;
      this._authenticated = user._authenticated;
      this._authHeader = user._authHeader;
    } else {
      this._authenticated = false;
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

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get login(): string {
    return this._login;
  }

  set login(value: string) {
    this._login = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  public save() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  public clear() {
    localStorage.removeItem('user');
  }
}
