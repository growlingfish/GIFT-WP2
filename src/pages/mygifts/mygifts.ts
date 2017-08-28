import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-mygifts',
  templateUrl: 'mygifts.html',
})
export class MyGiftsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }
}
