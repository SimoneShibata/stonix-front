import {Route} from "angular2/router";
import {LoginComponent} from "../component.login/component.login";

export class RoutesConstants {
  public static get all():Route[] {
    return [
      new Route({path: '/', name: 'Login', component: LoginComponent, useAsDefault: true}),
      new Route({path: '/app', name: 'App', component: LoginComponent})
    ];
  };
}
