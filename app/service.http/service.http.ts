import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";

@Injectable()
export class HttpService {
  constructor(private http:Http) {
  }

  public get(url:string, callback:Function) {
    this.http
      .get(url)
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
