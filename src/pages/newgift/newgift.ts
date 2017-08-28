import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-newgift',
  templateUrl: 'newgift.html',
})
export class NewGiftPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  ionViewWillEnter () {
    this.userProvider.getUser().then(data => {
      if (data == null) {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }
}
