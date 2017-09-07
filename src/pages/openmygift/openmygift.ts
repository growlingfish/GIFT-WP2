import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ReviewObjectPage } from '../reviewobject/reviewobject';
import { ReviewMessagePage } from '../reviewmessage/reviewmessage';
import { OpenObjectPage } from '../openobject/openobject';
import { OpenMessagePage } from '../openmessage/openmessage';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-openmygift',
  templateUrl: 'openmygift.html',
})
export class OpenMyGiftPage {

  gift: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private alertCtrl: AlertController, private userProvider: UserProvider) {
    this.gift = navParams.get('gift');
  }

  ionViewDidEnter () {
    this.userProvider.getUnopenedGift(this.gift.ID).then(existingGift => {
      if (existingGift == null) {
        this.userProvider.getUser().then(data => {
          this.userProvider.setUnopenedGift(this.gift.ID, this.gift);
        });
      } else {
        this.gift = existingGift;
      }
    });
  }

  ionViewCanEnter(): boolean {
    if (this.navParams.get('gift')) {
      return true;
    } else {
      return false;
    }
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  viewObject (part) {
    this.modalCtrl.create(ReviewObjectPage, {
      object: this.gift.wraps[part].unwrap_object
    }).present();
  }

  viewMessage (part) {
    this.modalCtrl.create(ReviewMessagePage, {
      message: this.gift.payloads[part].post_content
    }).present();
  }

  openObject (part) {
    let modal = this.modalCtrl.create(OpenObjectPage, {
      object: this.gift.wraps[part].unwrap_object
    });

    modal.onDidDismiss(data => {
      if (data.found) {
        this.gift.wraps[part].unwrap_object.found = true;
        this.userProvider.setUnopenedGift(this.gift.ID, this.gift);
        this.openMessage(part);
      }
    });

    modal.present();
  }

  openMessage (part) {
    let modal = this.modalCtrl.create(OpenMessagePage, {
      message: this.gift.payloads[part].post_content
    });

    modal.onDidDismiss(data => {
      this.gift.payloads[part].seen = true;
      this.userProvider.setUnopenedGift(this.gift.ID, this.gift);
    });
    
    modal.present();
  }

  partComplete (part) {
    if (part == 0) {
      return this.objectComplete(part) && this.payloadComplete(part);
    } else if (part > 0 && this.partComplete(part - 1)) {
      return this.objectComplete(part) && this.payloadComplete(part);
    } else {
      return false;
    }
  }

  objectComplete (part) {
    if (!!this.gift.wraps && !!this.gift.wraps[part].unwrap_object && !!this.gift.wraps[part].unwrap_object.ID && !!this.gift.wraps[part].unwrap_object.found) {
      return true;
    }
    return false;
  }

  canOpenObject (part) {
    if (part == 0 || this.partComplete(part - 1)) {
      return true;
    }
    return false;
  }

  payloadComplete (part) {
    if (this.objectComplete(part) && !!this.gift.payloads && !!this.gift.payloads[part].post_content && this.gift.payloads[part].post_content.length > 0 && !!this.gift.payloads[part].seen) {
      return true;
    }
    return false;
  }

  canOpenMessage (part) {
    if (this.objectComplete(part)) {
      return true;
    }
    return false;
  }

  partCompleteInfo (part) {
    if (!this.partComplete (part)) {
      let alert = this.alertCtrl.create({
        title: "This part has not been finished",
        subTitle: "You need to find the object and open the message to finish this part",
        buttons: ['OK']
      });
      alert.present(prompt);
    }
  }

  objectInfo (part) {
    if (!this.canOpenObject (part)) {
      let alert = this.alertCtrl.create({
        title: "Not yet ...",
        subTitle: "You need to finish opening the previous part first",
        buttons: ['OK']
      });
      alert.present(prompt);
    }
  }

  messageInfo (part) {
    if (!this.canOpenMessage (part)) {
      let alert = this.alertCtrl.create({
        title: "Not yet ...",
        subTitle: "You need to find the object before you can open this message",
        buttons: ['OK']
      });
      alert.present(prompt);
    }
  }

}
