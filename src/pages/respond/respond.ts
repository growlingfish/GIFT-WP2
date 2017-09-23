import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-respond',
  templateUrl: 'respond.html',
})
export class RespondPage {

  private message: string = "";
  private giftID: number;
  private owner: number;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.giftID = navParams.get('giftID');
    this.owner = navParams.get('owner');
  }

  sendMessage () {
    this.loading = this.loadingCtrl.create({
      content: 'Sending your response ... ',
      duration: 10000
    });
    this.loading.present();
    this.userProvider.getUser().then(data => {
      this.userProvider.sendResponse(this.giftID, this.message, data.ID, this.owner).subscribe(complete => {
        if (complete) {
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.showError();
        }
        this.loading.dismissAll();
      },
      error => {        
        this.loading.dismissAll();
        this.showError();
      });
    });
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Response unsuccessful',
      subTitle: 'Please try again later',
      buttons: ['OK']
    });
    alert.present();
  }

  cancel () {
    this.navCtrl.setRoot(TabsPage);
  }
}
