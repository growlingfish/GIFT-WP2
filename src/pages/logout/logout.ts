import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IntroPage } from '../intro/intro';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  logout () {
    this.userProvider.logout();
    this.navCtrl.setRoot(IntroPage);
  }

  cancel () {
    console.log("To do");
    // if has things to pop back to then do that, otherwise go to whatever a home page is
  }
}
