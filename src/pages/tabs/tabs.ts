import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TheirGiftsPage } from '../theirgifts/theirgifts';
import { MyGiftsPage } from '../mygifts/mygifts';
import { ActivityPage } from '../activity/activity';
import { LoginPage } from '../login/login';
import { RolePage } from '../role/role';

import { UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  makeRoot = TheirGiftsPage;
  unwrapRoot = MyGiftsPage;
  activityRoot = ActivityPage;

  selectedTab: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.selectedTab = navParams.get('tab') || 0;
  }

  ionViewWillEnter () {
    var user = this.userProvider.getUser();
    user.then(data => {
      if (data == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.userProvider.getSeenRoles().then(hasSeen => {
          if (!hasSeen) {
            this.navCtrl.setRoot(RolePage);
          }/* else if (this.selectedTab != null) {
            this.navCtrl.getActiveChildNav().select(this.selectedTab);
          }*/
        });
      }
    });
  }
}
