import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {MdButton} from "@angular2-material/button/button";
import {MdInput} from "@angular2-material/input/input";
import {MdCard} from "@angular2-material/card/card";
import {Question} from "../model.question/model.question";
import {HttpService} from "../service.http/service.http";

@Component({
  selector: 'question-list',
  templateUrl: './app/component.question/component.question.list.html',
  styleUrls: ['./app/styles/component.question/component.question.css'],
  directives: [MdButton, MdInput, MdCard],
  providers: [HttpService]
})
export class QuestionListComponent {
  private questions:Question[];

  constructor(private router:Router, private http:HttpService) {
    this.getAll();
  }

  getAll() {
    this.http.get('questions',
      (response) => {
        this.questions = response.body;
        console.log(this.questions);
      });
  }
}