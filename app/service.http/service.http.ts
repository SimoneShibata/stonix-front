import {Http, Response, Headers} from "angular2/http";
import {Injectable} from "angular2/core";
import {AppConstants} from "../constants.app/constants.app";

@Injectable()
export class HttpService {
  constructor(private http:Http) {
  }

  public get(service:string, callback:Function) {
    this.http
      .get(AppConstants.ENDPOINT + service)
      .subscribe((response:Response) => {
        const result = {
          status: response.status,
          body: response.json(),
          header: response.headers
        };

        callback(result);
      });
  }

  public post(service:string, object:any, callback:Function) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json;charset=UTF-8');

    this.http
      .post(AppConstants.ENDPOINT + service, JSON.stringify(object), {headers: headers})
      .subscribe((response:Response) => {
        const result = {
          status: response.status,
          body: response.json(),
          header: response.headers
        };

        callback(result);
      });
  }

  public put(service:string, object:any, callback:Function) {
    if (!object.hasOwnProperty('id'))
      throw 'WHERE IS THE ID?';

    this.http
      .put(AppConstants.ENDPOINT + service, JSON.stringify(object))
      .subscribe((response:Response) => {
        const result = {
          status: response.status,
          body: response.json(),
          header: response.headers
        };

        callback(result);
      });
  }

  public remove(service:string, id:string, callback:Function) {
    if (!id)
      throw 'WHERE IS THE ID?';

    this.http
      .delete(AppConstants.ENDPOINT + service + '/' + id)
      .subscribe((response:Response) => {
        const result = {
          status: response.status,
          body: response.json(),
          header: response.headers
        };

        callback(result);
      });
  }
}
