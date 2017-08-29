import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { InvitePage } from '../invite/invite';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  private contacts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, public modalCtrl: ModalController) {
    this.userProvider.getContacts().then(data => {
      this.contacts = data;
    });
  }

  filterContacts (ev: any) {
    this.userProvider.getContacts().then(data => {
      this.contacts = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.contacts = this.contacts.filter((contact) => {
          return (contact.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (contact.user_email.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    });
  }

  inviteNew () {
    this.modalCtrl.create(InvitePage).present();
  }

  invite (contact: any) {
    this.userProvider.getUnfinishedGift().then(gift => {
      gift.recipient = contact;
      this.userProvider.setUnfinishedGift(gift).then(data => {
        this.navCtrl.pop();
      });
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }
}
