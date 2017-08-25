import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
  }

  ionViewCanEnter(): boolean{
    if(this.userProvider.getSeenIntro()){
      console.log("Trying to get to intro page ... blocked");
      return false;
    } else {
      return true;
    }
  }

  skipIntro () {
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLeave () {
    this.userProvider.setSeenIntro(true);
  }

}
