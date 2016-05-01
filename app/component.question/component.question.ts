import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {MdCard} from "@angular2-material/card/card";

@Component({
  selector: 'question',
  templateUrl: './app/component.question/component.question.html',
  styleUrls: [],
  directives: [MdCard]
})
export class QuestionComponent {

  constructor() {
  }
}
