import {bootstrap} from "angular2/platform/browser";
import {provide} from "angular2/core";
import {AppComponent} from "./component.app/component.app";
import {ROUTER_PROVIDERS} from "angular2/router";
import {APP_BASE_HREF} from "angular2/src/platform/browser/location/location_strategy";

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'})
]);
