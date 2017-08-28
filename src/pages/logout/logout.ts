import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IntroPage } from '../intro/intro';
import { TabsPage } from '../tabs/tabs';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  ionViewWillEnter () {
    var user = this.userProvider.getUser();
    user.then(data => {
      if (data == null) {
        this.cancel();
      } else {
        // Logged in, fine
      }
    });
  }

  logout () {
    this.userProvider.logout().then(data => {
      this.navCtrl.setRoot(IntroPage);
    });
  }

  cancel () {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }
}
