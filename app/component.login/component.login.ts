import {Component} from "angular2/core";
import {MdButton} from "@angular2-material/button/button";

@Component({
  selector: 'login',
  templateUrl: './app/component.login/component.login.html',
  styleUrls: ['./app/styles/component.login/component.login.css'],
  directives: [MdButton]
})
export class LoginComponent {
}
