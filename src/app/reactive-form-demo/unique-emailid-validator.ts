import { HttpClient } from '@angular/common/http';
import {
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { map } from 'rxjs/operators';

export function existingEmailIdValidator(
  httpClient: HttpClient
): AsyncValidatorFn {
  const validationErrors: ValidationErrors = {
    emailExist: true,
  };

  /**
   * ------users------
   * o1 users=>true/false
   * ------true-------
   * o2 true=>{emailExist:true}
   * ------{emailExist:true}----
   *
   * * ------users------
   * o1 users=>true/false
   * ------false-------
   * o2 false=>null
   * ------null----
   */
  // RXJS
  return (control: FormControl) => {
    const email = control.value;

    return httpClient.get(`http://localhost:3000/users?email=${email}`).pipe(
      map((users: any[]) => users.length > 0),
      map((isUserExist) => (isUserExist ? { emailExist: true } : null))
    );
  };
}
