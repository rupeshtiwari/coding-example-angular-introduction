import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  users$: Observable<any>;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.users$ = this.httpClient.get('http://localhost:3000/users');
  }
}
