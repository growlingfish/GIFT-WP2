import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { TabsPage } from '../tabs/tabs';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  username: string;
  password: string;
  email: string;
  name: string;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private userProvider: UserProvider, private loadingCtrl: LoadingController) {
  }

  ionViewWillEnter () {
    var user = this.userProvider.getUser();
    user.then(data => {
      if (data == null) {
        // not already logged in, fine
      } else {
        this.navCtrl.setRoot(LogoutPage);
      }
    });
  }

  register () {
    this.showLoading();
    this.userProvider.logout();
    this.userProvider.register(this.username, this.password, this.email, this.name).subscribe(success => {
      if (success) {
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.showError("User already registered");
      }
    },
    error => {
      this.showError(error);
    });
  }

  cancel () {
    this.navCtrl.popToRoot();
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
      title: 'Registration unsuccessful',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
