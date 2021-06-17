import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.css'],
})
export class UserListPageComponent implements OnInit {
  userList = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userList = this.userService.userList;
  }
}
