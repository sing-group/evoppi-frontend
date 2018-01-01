export class User {
  public authenticated: boolean;
  public role: string;
  public username: string;

  constructor() {
    this.authenticated = false;
  }
}
