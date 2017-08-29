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
  private started: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {
    this.gift = {
      "post_author": "1",
      "post_title": "A new gift",
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

    this.started = false;
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
            this.started = true;
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

  hasStarted (): boolean {
    return this.started;
  }

  ionViewCanLeave(): boolean {
    if (!this.hasStarted()) {
      return true;
    } else {
       let alert = this.alertCtrl.create({
        title: "Save progress?",
        subTitle: "Do you want to save your progress?",
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              console.log('To do');
            }
          },
          {
            text: 'No',
            handler: () => {
              this.started = false;
              this.navCtrl.pop();
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

}
