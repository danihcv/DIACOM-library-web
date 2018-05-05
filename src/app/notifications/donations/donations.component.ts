import { Component } from '@angular/core';
import {Donation} from '../../shared/models/donation';
import {DonationsService} from './donations.service';
import {UserService} from '../../shared/user.service';
import {User} from '../../shared/models/user';

@Component({
  selector: 'notifications-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent {
  donations: Donation[] = [];
  error: boolean[] = [];
  isLoading = true;

  constructor(private donationsService: DonationsService,
              private userService: UserService) {
    this.donationsService.getAllDonations().subscribe(data => {
      this.donations = data.sort((a, b) => a.closed ? 1 : 0);
      this.isLoading = false;

      this.donations.forEach((donation) => {
        this.error.push(false);
        this.userService.getUser(donation.id_user).subscribe(user => donation['user'] = user);
      });
    }, err => {
      console.log(err);
      this.isLoading = false;
    });
  }

  onChange(idx: number, donation: Donation) {
    this.error[idx] = false;

    this.donationsService.updateDonation(donation)
      .subscribe(() => {},
          err => {
      console.log(err);
      this.error[idx] = true;
    });
  }

  getUserName(user: User) {
    if (user === undefined) {
      return;
    }

    let fullName = user.first_name;
    if (user.last_name) {
      fullName += ' ' + user.last_name;
    }
    return fullName;
  }
}
