import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';

import { UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, userProvider: UserProvider) {
    platform.ready().then(() => {
      this.rootPage = userProvider.getSeenIntro() ? LoginPage : IntroPage;
      statusBar.styleDefault();
      setTimeout(function () {
        splashScreen.hide();
      }, 1000);
    });
  }
}
