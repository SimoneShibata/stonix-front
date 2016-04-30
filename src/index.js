import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {StonixFront} from 'stonix-front';

@Component({
  selector: 'main'
})

@View({
  directives: [StonixFront],
  template: `
    <stonix-front></stonix-front>
  `
})

class Main {

}

bootstrap(Main);
