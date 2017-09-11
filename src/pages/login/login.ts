import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { TsandcsPage } from '../tsandcs/tsandcs';
import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private userProvider: UserProvider, private loadingCtrl: LoadingController) {
    
  }

  ionViewWillEnter () {
    this.userProvider.getUser().then(data => {
      if (data == null) {
        // not already logged in, fine
      } else {
        this.userProvider.initialiseData();
        this.userProvider.initialiseFCM();
        this.navCtrl.setRoot(LogoutPage);
      }
    });
  }

  login() {
    this.showLoading();
    this.userProvider.login(this.username, this.password).subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.showError("Your email address or password was incorrect. Check them and try again.");
      }
    },
    error => {
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Login unsuccessful',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  register () {
    this.navCtrl.push(TsandcsPage);
  }
}
