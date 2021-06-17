import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { existingEmailIdValidator } from './unique-emailid-validator';

@Component({
  selector: 'app-reactive-form-demo',
  templateUrl: './reactive-form-demo.component.html',
  styleUrls: ['./reactive-form-demo.component.css'],
})
export class ReactiveFormDemoComponent implements OnInit {
  user: FormGroup;
  userNotFound: boolean;
  userId: string;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = new FormGroup({
      firstName: new FormControl('', [
        Validators.minLength(4),
        Validators.required,
      ]),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      id: new FormControl(''),
    });
    this.activatedRoute.params
      .pipe(
        map((params) => params.userId), //userId
        tap((userid) => (this.userId = userid)),
        switchMap((userId) =>
          userId
            ? this.httpClient.get(`http://localhost:3000/users/${userId}`)
            : this.emptyUser
        )
      )
      .subscribe(
        (fetchedUser) => {
          this.onUserFetchSuccess(fetchedUser);
        },

        () => {
          this.onUserFetchError();
        }
      );
  }

  private onUserFetchError() {
    this.userNotFound = true;
  }

  private onUserFetchSuccess(fetchedUser: Object) {
    console.log('Fetched User', fetchedUser);
    if (fetchedUser == null) {
      console.log('no user found in server');
      this.userNotFound = true;
    } else if (this.isNewUser(fetchedUser)) {
      console.log('this is new user');
      this.user
        .get('email')
        .setAsyncValidators([existingEmailIdValidator(this.httpClient)]);
      this.user.get('email').updateValueAndValidity();
      this.user.markAsUntouched();
    } else {
      console.log('this is new existing user');
      this.user.patchValue(fetchedUser);
    }
  }

  get emptyUser() {
    return of({
      firstName: '',
      lastName: '',
      email: '',
    });
  }

  isNewUser(user: any) {
    return !user.id; // if user has no id
  }

  get isFormInValid() {
    return !this.user.valid;
  }

  submitUser() {
    if (this.isNewUser(this.user.value)) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  deleteUser() {
    const canDelete = window.confirm(
      `Are you sure to delete ${this.user.value.firstName}`
    );

    if (canDelete) {
      this.httpClient
        .delete(`http://localhost:3000/users/${this.userId}`)
        .subscribe(() => this.navigateToAllUsers());
    } else {
      // Suppressing the submit default behavior of button 
      return false;

    }
  }

  private createUser() {
    const user = {
      ...this.user.value,
      id: Date.now().toPrecision(),
    };
    this.httpClient.post('http://localhost:3000/users', user).subscribe(() => {
      this.user.reset();
      this.navigateToAllUsers();
    });
  }

  private updateUser() {
    this.httpClient
      .put(`http://localhost:3000/users/${this.userId}`, this.user.value)
      .subscribe(() => {
        this.user.reset();
        this.navigateToAllUsers();
      });
  }

  private navigateToAllUsers() {
    this.router.navigate(['allusers']);
  }

  // DRY Principle ( Do not Repeated Yourself)

  get isFirstNameInValid() {
    '';
    return (
      this.user.touched && !(this.user.controls['firstName'].errors == null)
    );
  }

  get firstNameValidationMessage() {
    const errors = this.user.controls['firstName'].errors;

    if (errors['required']) {
      return 'First Name is required';
    }
    if (errors['minlength']) {
      const minLengthError = errors['minlength'];
      return `First Name should be minimum of ${minLengthError.requiredLength} characters`;
    }
  }

  get isEmailInValid() {
    return this.user.touched && !(this.user.controls['email'].errors == null);
  }

  get emailIdMessage() {
    const errors = this.user.controls['email'].errors;

    if (errors['email']) {
      return 'Enter valid email';
    }
    if (errors['emailExist']) {
      return `This email is already used. Try new one.`;
    }
  }

  get emailIdValidMessage() {
    const errors = this.user.controls['email'].errors;
    if (errors == null) {
      return '✅ This email is available';
    }
  }

  get canShowValidEmailMessage() {
    return !this.isEmailInValid;
  }
}
