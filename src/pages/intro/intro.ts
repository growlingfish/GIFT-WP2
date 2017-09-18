import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild(Slides) slides: Slides;
  currentIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
    this.currentIndex = 0;
  }

  ionViewWillEnter() {
    this.userProvider.getSeenIntro().then(hasSeen => {
      if(hasSeen){
        console.log("Trying to get to intro page ... blocked");
        this.skipIntro();
      }
    });
  }

  skipIntro () {
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLeave () {
    this.userProvider.setSeenIntro(true);
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
  }

}
