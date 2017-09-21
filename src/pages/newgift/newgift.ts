import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ContactsPage } from '../contacts/contacts';
import { NewMessagePage } from '../newmessage/newmessage';
import { ObjectsPage } from '../objects/objects';
import { GiftcardPage } from '../giftcard/giftcard';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-newgift',
  templateUrl: 'newgift.html',
})
export class NewGiftPage {

  private gift: any;
  private edited: boolean;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.edited = false;

    this.gift = {
      "post_title": "A new gift"
    };
  }

  ionViewDidEnter () {
    this.userProvider.getUnfinishedGift().then(existingGift => {
      if (existingGift == null) {
        let alert = this.alertCtrl.create({
          title: "Creating a Gift",
          subTitle: "You can add the components of a Gift in any order you like, and can leave this screen or the app without losing your progress",
          buttons: [
            {
              text: 'OK'
            }
          ]
        });
        alert.present();

        this.userProvider.getUser().then(data => {
          this.gift = {
            "post_author": data.ID,
            "post_title": "A new gift",
            "post_status": "draft",
            "recipient": {},
            "wraps": [
              {
                "post_status": "draft",
                "menu_order": 0,
                "unwrap_object": {}
              },
              {
                "post_status": "draft",
                "menu_order": 1,
                "unwrap_object": {}
              },
              {
                "post_status": "draft",
                "menu_order": 2,
                "unwrap_object": {}
              }
            ],
            "payloads": [
              {
                "post_content": "",
                "post_status": "draft",
                "menu_order": 0
              },
              {
                "post_content": "",
                "post_status": "draft",
                "menu_order": 1
              },
              {
                "post_content": "",
                "post_status": "draft",
                "menu_order": 2
              }
            ],
            "giftcards": [
              {
                "post_content": "",
                "post_status": "draft"
              }
            ]
          };
          this.userProvider.setUnfinishedGift(this.gift);
        });
      } else {
        this.gift = existingGift;
      }
    });
  }

  editRecipient () {
    this.navCtrl.push(ContactsPage);
  }

  editGiftcard () {
    this.navCtrl.push(GiftcardPage);
  }

  send () {
    if (this.isComplete()) {
      this.loading = this.loadingCtrl.create({
        content: 'Sending ...',
        duration: 10000
      });
      this.loading.present();

      if (!!this.gift.recipient && !!this.gift.recipient.nickname) {
        this.gift.post_title = "A Gift For " + this.gift.recipient.nickname;
      }

      this.userProvider.sendGift().subscribe(complete => {
        if (complete) {
          this.userProvider.clearUnfinishedGift().then(cleared => {
            this.userProvider.updateTheirGifts().subscribe(done => {
              this.loading.dismissAll();
              this.navCtrl.pop();
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
    } else {
      let alert = this.alertCtrl.create({
        title: "Gift not complete",
        subTitle: "You haven't finished making the Gift yet",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Gift sending unsuccessful',
      subTitle: "Please try again",
      buttons: ['OK']
    });
    alert.present();
  }

  isComplete (): boolean {
    if (!(!!this.gift.recipient && !!this.gift.recipient.ID)) {
      return false;
    }
    for (var i = 0; i < 3; i++) {
      if (!this.partComplete(i)) {
        return false;
      }
    }
    if (!(!!this.gift.giftcards && !!this.gift.giftcards[0] && !!this.gift.giftcards[0].post_content)) {
      return false;
    }
    return true;
  }

  hasEdited (): boolean {
    return this.edited;
  }

  ionViewCanLeave(): boolean {
    if (!this.hasEdited()) {
      return true;
    } else {
       let alert = this.alertCtrl.create({
        title: "You haven't sent this gift",
        subTitle: "Do you want to save your progress for later, or discard this gift?",
        buttons: [
          {
            text: 'Save',
            handler: () => {
              this.userProvider.setUnfinishedGift(this.gift).then(data => {
                this.userProvider.updateTheirGifts().subscribe(done => {
                  this.edited = false;
                  this.navCtrl.pop();
                });
              });
            }
          },
          {
            text: 'Discard',
            handler: () => {
              this.userProvider.clearUnfinishedGift().then(data => {
                this.userProvider.updateTheirGifts().subscribe(done => {
                  this.edited = false;
                  this.navCtrl.pop();
                });
              });
            }
          }
        ]
      });
      alert.present();
      return false;
    }
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  recipientIcon (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.ID) {
      return "checkmark-circle";
    } else {
      return "add-circle";
    }
  }

  recipientIconColour (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.ID) {
      return "primary";
    } else {
      return "secondary";
    }
  }

  recipientTitle (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.nickname) {
      return "To " + this.gift.recipient.nickname;
    } else {
      return "Who is your Gift for?";
    }
  }

  recipientSubtitle (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.ID) {
      return "Tap to choose a different recipient";
    } else {
      return "Tap to add a recipient of your Gift";
    }
  }

  giftcardIcon (): string {
    if (!!this.gift.giftcards && !!this.gift.giftcards[0] && !!this.gift.giftcards[0].post_content) {
      return "checkmark-circle";
    } else {
      return "add-circle";
    }
  }

  giftcardIconColour (): string {
    if (!!this.gift.giftcards && !!this.gift.giftcards[0] && !!this.gift.giftcards[0].post_content) {
      return "primary";
    } else {
      return "secondary";
    }
  }

  giftcardTitle (): string {
    if (!!this.gift.giftcards && !!this.gift.giftcards[0] && !!this.gift.giftcards[0].post_content) {
      return "Tap to change the giftcard";
    } else {
      return "How would you introduce the Gift?";
    }
  }

  giftcardSubtitle (): string {
    if (!!this.gift.giftcards && !!this.gift.giftcards[0] && !!this.gift.giftcards[0].post_content) {
      return this.gift.giftcards[0].post_content;
    } else {
      return "Tap to write them a giftcard";
    }
  }

  scrapGift () {
    this.userProvider.clearUnfinishedGift().then(data => {
      this.userProvider.updateTheirGifts().subscribe(done => {
        this.edited = false;
        this.navCtrl.pop();
      });
    });
  }

  partComplete (part) {
    return this.objectComplete(part) && this.payloadComplete(part);
  }

  objectComplete (part) {
    if (!!this.gift.wraps && !!this.gift.wraps[part].unwrap_object && !!this.gift.wraps[part].unwrap_object.ID) {
      return true;
    }
    return false;
  }

  payloadComplete (part) {
    if (!!this.gift.payloads && !!this.gift.payloads[part].post_content && this.gift.payloads[part].post_content.length > 0) {
      return true;
    }
    return false;
  }

  partCompleteInfo (part) {
    if (!this.partComplete (part)) {
      let alert = this.alertCtrl.create({
        title: "This Part Is Not Complete",
        subTitle: "You haven't finished making this part of the Gift yet",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  editObject (part) {
    this.navCtrl.push(ObjectsPage, {
      part: part,
      selected: !!this.gift.wraps[part].unwrap_object.ID ? this.gift.wraps[part].unwrap_object.ID : null
    });
  }

  editMessage (part) {
    this.navCtrl.push(NewMessagePage, {
      part: part
    });
  }

}
