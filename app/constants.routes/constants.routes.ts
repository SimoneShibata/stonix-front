import {Route} from "angular2/router";
import {LoginComponent} from "../component.login/component.login";
import {QuestionComponent} from "../component.question/component.question";
import {QuestionListComponent} from "../component.question/component.question.list";

export class RoutesConstants {
  public static get all():Route[] {
    return [
      new Route({path: '/', name: 'Login', component: LoginComponent, useAsDefault: true}),
      new Route({path: '/questions-list', name: 'QuestionList', component: QuestionListComponent}),
      new Route({path: '/questions', name: 'Question', component: QuestionComponent})
    ];
  };
}
