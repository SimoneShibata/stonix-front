import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {LoginComponent} from "../component.login/component.login";
import {RoutesConstants} from "../constants.routes/constants.routes";

@Component({
  selector: 'app',
  templateUrl: './app/component.app/component.app.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent
  ]
})
@RouteConfig(RoutesConstants.all)
export class AppComponent {
}
