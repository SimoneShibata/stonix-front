export class User {
  private _email:String;
  private _password:String;

  get email():String {
    return this._email;
  }

  get password():String {
    return this._password;
  }
}
