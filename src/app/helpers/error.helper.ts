import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export class ErrorHelper {
  public static handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
