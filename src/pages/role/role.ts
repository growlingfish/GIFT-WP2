import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {

  }

  makeGift () {
    this.navCtrl.setRoot(TabsPage, {
      tab: 0
    });
  }

  unwrapGift () {
    this.navCtrl.setRoot(TabsPage, {
      tab: 1
    });
  }

  ionViewDidEnter () {
    this.userProvider.getUser().then(data => {
      if (data == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.userProvider.getSeenRoles().then(hasSeen => {
          if (hasSeen) {
            this.navCtrl.setRoot(TabsPage);
          }
        });
      }
    });
  }

  ionViewDidLeave () {
    this.userProvider.setSeenRoles(true);
  }

}
