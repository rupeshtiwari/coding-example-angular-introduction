import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { academyListFromServer } from '../models/academy-list-from-server';
import { City } from '../models/City';
import { cityListFromServer } from '../models/city-list-from-server';
import { countryListFromServer } from '../models/country-list-from-server';
import { emptyUser } from '../models/empty-user';
import { State } from '../models/State';
import { stateListFromServer } from '../models/state-list-from-server';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit {
  user: User;
  stateList: State[];
  cityList: City[];
  userList: User[];


  constructor(private userService: UserService, private router: Router) {
    this.user = emptyUser();
    this.userList = this.userService.userList;

  }

  ngOnInit(): void {
    this.stateList = this.filterStateByCountryId(null);
    this.cityList = this.filterCityByStateId(null);
  }

  isSelected(academyId: string) {
    return this.user.academyList.indexOf(academyId) > -1;
  }

  register() {
    this.user.userId = Date.now().toPrecision();

    this.userService.userList.push({ ...this.user });

    this.user = emptyUser();
    this.router.navigate(['users']);
  }

  onCountrySelection(countryId: string) {
    this.user.country = countryId;
    this.stateList = this.filterStateByCountryId(countryId);
  }

  onStateSelection(stateId: string) {
    this.user.state = stateId;
    this.cityList = this.filterCityByStateId(stateId);
  }

  onCitySelection(cityId: string) {
    this.user.city = cityId;
  }

  onAcademySelection(academyId: string) {
    this.user.academyList.push(academyId);
  }

  private filterStateByCountryId(countryId: string) {
    /**
     * get all of the states belongs to countryId
     */
    if (countryId) {
      return stateListFromServer.filter(
        (state) => state.countryId === countryId
      );
    } else {
      return [...stateListFromServer];
    }
  }

  private filterCityByStateId(stateId: string) {
    if (stateId) {
      return cityListFromServer.filter((city) => city.stateId === stateId);
    } else {
      return [...cityListFromServer];
    }
  }

  get invalidForm() {
    return false;
  }

  get academyListFromServer() {
    return academyListFromServer;
  }

  get countryListFromServer() {
    return countryListFromServer;
  }
}
