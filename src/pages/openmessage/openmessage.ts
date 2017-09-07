import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import { Shake } from '@ionic-native/shake';

@Component({
  selector: 'page-openmessage',
  templateUrl: 'openmessage.html',
})
export class OpenMessagePage {

  private message: string;
  private revealed: boolean;
  private watch;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private platform: Platform, private shake: Shake) {
    this.message = navParams.get('message');
    this.revealed = false;
  }

  ionViewDidEnter () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.watch = this.shake.startWatch().subscribe(() => {
          this.revealed = true;
        });
      } else {
        this.revealed = true;
      }
    });
  }

  back () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.watch.unsubscribe();
      }
    });
    this.viewCtrl.dismiss();
  }

}
