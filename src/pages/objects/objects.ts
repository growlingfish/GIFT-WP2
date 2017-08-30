import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ViewObjectPage } from '../viewobject/viewobject';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-objects',
  templateUrl: 'objects.html',
})
export class ObjectsPage {

  private objects: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, public modalCtrl: ModalController) {
    this.userProvider.getObjects().then(data => {
      this.objects = data;
    });
  }

  filterObjects (ev: any) {
    this.userProvider.getObjects().then(data => {
      this.objects = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.objects = this.objects.filter((object) => {
          return (object.post_title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  addNew () {

  }

  addExisting (object) {

  }

  viewExisting (object) {
    this.modalCtrl.create(ViewObjectPage, {
      object: object
    }).present();
  }

}
