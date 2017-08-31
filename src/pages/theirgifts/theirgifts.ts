import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { NewGiftPage } from '../newgift/newgift';
import { ReviewGiftPage } from '../reviewgift/reviewgift';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-theirgifts',
  templateUrl: 'theirgifts.html',
})
export class TheirGiftsPage {

  private gifts: Array<any>;
  private unfinished: boolean = false;
  private unfinishedTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {}

  ionViewDidEnter () {
    this.userProvider.getTheirGifts().then(data => {
      this.gifts = data;
    });

    this.userProvider.getUnfinishedGift().then(existingGift => {
      if (existingGift != null) {
        this.unfinished = true;
        if (!!existingGift.post_title && existingGift.post_title != "Tap to name this gift") {
          this.unfinishedTitle = existingGift.post_title;
        } else {
          this.unfinishedTitle = "Continue making this gift";
        }
      }
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

  review (gift) {
    this.navCtrl.push(ReviewGiftPage, {
      gift: gift
    })
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

}
