import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-theirgifts',
  templateUrl: 'theirgifts.html',
})
export class TheirGiftsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

}
