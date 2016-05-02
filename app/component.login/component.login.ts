import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {MdButton} from "@angular2-material/button/button";
import {MdInput} from "@angular2-material/input/input";
import {MdCard} from "@angular2-material/card/card";
import {User} from "../model.user/model.user";
import {HttpService} from "../service.http/service.http";

@Component({
  selector: 'login',
  templateUrl: './app/component.login/component.login.html',
  styleUrls: ['./app/styles/component.login/component.login.css'],
  directives: [MdButton, MdInput, MdCard],
  providers: [HttpService]
})
export class LoginComponent {
  private user:User = new User();

  constructor(private router:Router, private http:HttpService) {
  }

  login() {
    // FIXME dummy login

    this.http.get('http://www.mocky.io/v2/572691d310000085266dd69b',
      (response) => {
        console.log(response);
      });

    if (this.user.email != 'adm' || this.user.password != 'adm')
      console.error('user/password invalid!');
    this.router.navigate(['Question']);
  }
}
