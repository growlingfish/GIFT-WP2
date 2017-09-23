import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, LoadingController, Loading } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ReviewObjectPage } from '../reviewobject/reviewobject';
import { ReviewMessagePage } from '../reviewmessage/reviewmessage';
import { OpenObjectPage } from '../openobject/openobject';
import { OpenMessagePage } from '../openmessage/openmessage';
import { RespondPage } from '../respond/respond';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-openmygift',
  templateUrl: 'openmygift.html',
})
export class OpenMyGiftPage {

  gift: any;
  loading: Loading;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private alertCtrl: AlertController, private userProvider: UserProvider, public loadingCtrl: LoadingController) {
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

      if (this.gift.status.received == false) {
        this.loading = this.loadingCtrl.create({
          content: 'Letting ' + this.gift.post_author_data.nickname + ' know that you have received this gift ...',
          duration: 10000
        });
        this.loading.present();
        this.userProvider.receivedGift(this.gift.ID).subscribe(complete => {
          if (complete) {
            this.gift.status.received = true;
            this.userProvider.updateMyGifts().subscribe(done => {
              this.userProvider.setUnopenedGift(this.gift.ID, this.gift);
              this.loading.dismissAll();
            });
          } else {
            this.loading.dismissAll();
            this.showError();
          }
        },
        error => {        
          this.loading.dismissAll();
          this.showError();
        });
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

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Gift update unsuccessful',
      subTitle: 'The message to ' + this.gift.post_author_data.nickname + ' will be delayed',
      buttons: ['OK']
    });
    alert.present();
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
      object: this.gift.wraps[part].unwrap_object,
      part: part
    }, {
      enableBackdropDismiss: false
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
      this.userProvider.setUnopenedGift(this.gift.ID, this.gift).then(data => {
        if (this.allComplete()) {
          if (this.gift.ID == 10000000) { // free gift is 10000000
            this.navCtrl.pop();
          } else {
            this.loading = this.loadingCtrl.create({
              content: 'Letting ' + this.gift.post_author_data.nickname + ' know that you have unwrapped this gift ...',
              duration: 10000
            });
            this.loading.present();
            this.userProvider.unwrappedGift(this.gift.ID).subscribe(complete => {
              if (complete) {
                this.userProvider.clearUnopenedGift(this.gift.ID).then(cleared => {
                  this.userProvider.updateMyGifts().subscribe(done => {
                    this.loading.dismissAll();
                    this.respond();
                  });
                });
              } else {
                this.loading.dismissAll();
                this.showError();
              }
            },
            error => {        
              this.loading.dismissAll();
              this.showError();
            });
          } 
        }
      });
    });
    
    modal.present();
  }

  respond() {
    this.gift.status.responded = true;
    this.navCtrl.push(RespondPage, {
      giftID: this.gift.ID,
      owner: this.gift.post_author
    });
  }

  allComplete (): boolean {
    for (let i = 0; i < this.gift.wraps.length; i++) {
      if (!(!!this.gift.wraps[i].unwrap_object && this.gift.wraps[i].unwrap_object.found == true)) {
        return false;
      }
    }
    for (let i = 0; i < this.gift.payloads.length; i++) {
      if (!(this.gift.payloads[i].post_content.length > 0 && this.gift.payloads[i].seen == true)) {
        return false;
      }
    }
    return true;
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
      if (!this.objectComplete(part)) {
        if (this.canOpenObject(part)) {
          this.openObject(part);
        } else {
          this.objectInfo(part);
        }
      } else if (!this.payloadComplete(part)) {
        if (this.canOpenMessage(part)) {
          this.openMessage(part);
        } else {
          this.messageInfo(part);
        }
      }
    }
  }

  objectInfo (part) {
    if (!this.canOpenObject (part)) {
      let alert = this.alertCtrl.create({
        title: "Not yet ...",
        subTitle: "You need to finish opening the previous part first",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  messageInfo (part) {
    if (!this.canOpenMessage (part)) {
      let alert = this.alertCtrl.create({
        title: "Not yet ...",
        subTitle: "You need to find the object before you can open this message",
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
