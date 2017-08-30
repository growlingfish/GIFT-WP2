import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-reviewmessage',
  templateUrl: 'reviewmessage.html',
})
export class ReviewMessagePage {

  private message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.message = navParams.get('message');
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

}
