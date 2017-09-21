import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-openobject',
  templateUrl: 'openobject.html',
})
export class OpenObjectPage {

  private object: any;
  private part: number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    this.object = navParams.get('object');
    this.part = navParams.get('part');
  }

  found () {
    this.viewCtrl.dismiss({
      found: true
    });
  }
  
  dismiss () {
    this.viewCtrl.dismiss({
      found: false
    });
  }

  help () {
    console.log(this.object);
    let alert = this.alertCtrl.create({
      title: "Here's a hint",
      subTitle: "This object is in: " + this.object.location[0].post_title,
      buttons: ['OK']
    });
    alert.present();
  }

}
