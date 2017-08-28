import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { NewGiftPage } from '../newgift/newgift';
import { MyGiftsPage } from '../mygifts/mygifts';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {

  }

  makeGift () {
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.push(NewGiftPage);
  }

  unwrapGift () {
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.push(MyGiftsPage);
  }

  ionViewWillEnter () {
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
