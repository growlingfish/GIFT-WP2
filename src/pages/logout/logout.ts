import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

import { IntroPage } from '../intro/intro';
import { TabsPage } from '../tabs/tabs';
import { NewGiftPage } from '../newgift/newgift';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  unfinished: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private app: App) {
    this.unfinished = false;
  }

  ionViewWillEnter () {
    this.userProvider.getUser().then(data => {
      if (data == null) {
        this.cancel();
      }
    });

    this.userProvider.getUnfinishedGift().then(existingGift => {
      if (existingGift == null) {
        this.unfinished = false;
      } else {
        this.unfinished = true;
      }
    });
  }

  logout () {
    this.userProvider.logout().then(data => {
      this.app.getRootNav().setRoot(IntroPage);
    });
  }

  review () {
    this.cancel();
    this.app.getRootNav().push(NewGiftPage);
  }

  cancel () {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }
}
