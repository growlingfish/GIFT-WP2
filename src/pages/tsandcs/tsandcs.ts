import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-tsandcs',
  templateUrl: 'tsandcs.html',
})
export class TsandcsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  accept () {
    this.navCtrl.push(RegisterPage);
  }

  cancel () {
    this.navCtrl.pop();
  }

}
