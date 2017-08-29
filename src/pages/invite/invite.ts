import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { NewGiftPage } from '../newgift/newgift';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage {

  email: string;
  name: string;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private userProvider: UserProvider, private loadingCtrl: LoadingController) {
  }

  invite () {
    this.showLoading();
    this.userProvider.invite(this.email, this.name).subscribe(recipient => {
      if (recipient !== false) {
        this.userProvider.updateContacts();
        this.userProvider.getUnfinishedGift().then(gift => {
          gift.recipient = recipient;
          this.userProvider.setUnfinishedGift(gift).then(data => {
            this.navCtrl.popTo(NewGiftPage);
          });
        });
      } else {
        this.showError();
        this.navCtrl.pop();
      }
    },
    error => {
      this.showError();
      this.navCtrl.pop();
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Invitation unsuccessful',
      subTitle: "Please try again",
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  cancel () {
    this.navCtrl.pop();
  }

}
