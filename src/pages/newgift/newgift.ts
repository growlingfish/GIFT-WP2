import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ContactsPage } from '../contacts/contacts';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-newgift',
  templateUrl: 'newgift.html',
})
export class NewGiftPage {

  private gift: any;
  private edited: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {
    this.edited = false;

    this.gift = {
      "post_title": "A new gift"
    };
  }

  ionViewDidEnter () {
    this.userProvider.getUnfinishedGift().then(existingGift => {
      if (existingGift == null) {
        this.userProvider.getUser().then(data => {
          this.gift = {
            "post_author": data.ID,
            "post_title": "Tap to name this gift",
            "post_status": "draft",
            "recipient": {
              //"ID": 2
            },
            "wraps": [
              {
                "post_status": "draft",
                "menu_order": 0,
                "unwrap_object": {
                  //"ID": 484,
                }
              },
              {
                "post_status": "draft",
                "menu_order": 1,
                "unwrap_object": {
                 //"ID": 484,
                }
              },
              {
                "post_status": "draft",
                "menu_order": 2,
                "unwrap_object": {
                  //"ID": 484,
                }
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
                "post_title": "",
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

  editTitle () {
    let prompt = this.alertCtrl.create({
      title: 'Title',
      message: "Enter a title for this gift",
      inputs: [
        {
          name: 'title',
          placeholder: 'A new gift'
        },
      ],
      buttons: [
        {
          text: 'Save',
          handler: data => {
            this.gift.post_title = data.title;
            this.userProvider.setUnfinishedGift(this.gift);
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    prompt.present();
  }

  editRecipient () {
    this.navCtrl.push(ContactsPage);
  }

  send () {
    if (this.isComplete()) {
      console.log("To do");
    } else {
      let alert = this.alertCtrl.create({
        title: "Gift not complete",
        subTitle: "You haven't finished making the gift yet",
        buttons: ['OK']
      });
      alert.present(prompt);
    }
  }

  isComplete (): boolean {
    return false;
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
                this.edited = false;
                this.navCtrl.pop();
              });
            }
          },
          {
            text: 'Discard',
            handler: () => {
              this.userProvider.clearUnfinishedGift().then(data => {
                this.edited = false;
                this.navCtrl.pop();
              });
            }
          }
        ]
      });
      alert.present(prompt);
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
      return "circle-add";
    }
  }

  recipientIconColour (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.ID) {
      return "secondary";
    } else {
      return "danger";
    }
  }

  recipientTitle (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.nickname) {
      return this.gift.recipient.nickname;
    } else {
      return "Tap to add a recipient";
    }
  }

  recipientSubtitle (): string {
    if (!!this.gift.recipient && !!this.gift.recipient.ID) {
      return "Tap to choose a different recipient";
    } else {
      return "Who will you give this to?";
    }
  }

}
