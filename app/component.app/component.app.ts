import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {LoginComponent} from "../component.login/component.login";

@Component({
  selector: 'app',
  templateUrl: './app/component.app/component.app.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent
  ]
})
@RouteConfig([])
export class AppComponent {
}
