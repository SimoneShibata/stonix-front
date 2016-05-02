import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {MdButton} from "@angular2-material/button/button";
import {MdInput} from "@angular2-material/input/input";
import {MdCard} from "@angular2-material/card/card";
import {Question} from "../model.question/model.question";

@Component({
  selector: 'question',
  templateUrl: './app/component.question/component.question.html',
  styleUrls: ['./app/styles/component.question/component.question.css'],
  directives: [MdButton, MdInput, MdCard]
})
export class QuestionComponent {
  private question:Question = new Question();

  constructor(private router:Router) {
  }

}
