import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { NewGiftPage } from '../newgift/newgift';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-theirgifts',
  templateUrl: 'theirgifts.html',
})
export class TheirGiftsPage {

  private gifts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.userProvider.getTheirGifts().then(data => {
      this.gifts = data;
    });
  }

  filterGifts (ev: any) {
    this.userProvider.getTheirGifts().then(data => {
      this.gifts = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.gifts = this.gifts.filter((gift) => {
          return (gift.post_title.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (gift.recipient.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    });
  }

  startNew () {
    this.navCtrl.push(NewGiftPage);
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

}
