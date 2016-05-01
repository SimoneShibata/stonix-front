import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {MdButton} from "@angular2-material/button/button";
import {MdInput} from "@angular2-material/input/input";
import {MdCard} from "@angular2-material/card/card";
import {User} from "../model.user/model.user";

@Component({
  selector: 'login',
  templateUrl: './app/component.login/component.login.html',
  styleUrls: ['./app/styles/component.login/component.login.css'],
  directives: [MdButton, MdInput, MdCard]
})
export class LoginComponent {
  private router:Router;
  private user:User = new User();

  constructor(router:Router) {
    this.router = router;
  }

  login() {
    // FIXME dummy login
    if (this.user.email != 'adm' || this.user.password != 'adm')
      console.error('user/password invalid!');
    this.router.navigate(['App']);
  }
}
