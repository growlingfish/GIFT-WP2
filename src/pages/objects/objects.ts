import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ViewObjectPage } from '../viewobject/viewobject';
import { NewObjectPage } from '../newobject/newobject';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-objects',
  templateUrl: 'objects.html',
})
export class ObjectsPage {

  private objects: Array<any>;
  private part: number;
  private selected: number = -1;
  private buttonAction: string = "Use";

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, public modalCtrl: ModalController) {
    this.part = navParams.get('part');
    let selected = navParams.get('selected');
    if (selected !== null) {
      this.selected = selected;
      this.buttonAction = "Replace";
    }
  }

  ionViewDidEnter () {
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
    this.navCtrl.push(NewObjectPage, {
      part: this.part
    });
  }

  addExisting (object) {
    this.userProvider.getUnfinishedGift().then(gift => {
      gift.wraps[this.part].unwrap_object = object;
      this.userProvider.setUnfinishedGift(gift).then(data => {
        this.navCtrl.pop();
      });
    });
  }

  viewExisting (object) {
    let modal = this.modalCtrl.create(ViewObjectPage, {
      object: object
    });
    modal.onDidDismiss(used => {
      if (used) {
        this.userProvider.getUnfinishedGift().then(gift => {
          gift.wraps[this.part].unwrap_object = object;
          this.userProvider.setUnfinishedGift(gift).then(data => {
            this.navCtrl.pop();
          });
        });
      }
    });
    modal.present();
  }

}
