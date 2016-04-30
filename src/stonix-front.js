import {Component, View} from 'angular2/core';

@Component({
  selector: 'stonix-front'
})

@View({
  templateUrl: 'stonix-front.html'
})

export class StonixFront {

  constructor() {
    console.info('StonixFront Component Mounted Successfully');
  }

}
