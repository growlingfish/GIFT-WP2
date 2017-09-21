import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-reviewobject',
  templateUrl: 'reviewobject.html',
})
export class ReviewObjectPage {

  private object: any;
  private part: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.object = navParams.get('object');
    this.part = navParams.get('part');
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

}
