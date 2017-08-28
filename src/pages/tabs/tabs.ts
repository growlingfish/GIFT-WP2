import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(private platform: Platform, private fcm: FCM) {
    platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        fcm.getToken().then(token => {
          console.log(token);
        });
      }
    });
  }
}
