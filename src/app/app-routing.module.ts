import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormDemoComponent } from './reactive-form-demo/reactive-form-demo.component';
import { UserListPageComponent } from './user-list-page/user-list-page.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { AllUsersComponent } from './all-users/all-users.component';

const routes: Routes = [
  {
    path: 'registration',
    component: UserRegistrationComponent,
  },
  {
    path: 'users',
    component: UserListPageComponent,
  },
  {
    path: 'allusers/:userId',
    component: ReactiveFormDemoComponent,
  },
  {
    path: 'newuser',
    component: ReactiveFormDemoComponent,
  },
  {
    path: 'allusers',
    component: AllUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
