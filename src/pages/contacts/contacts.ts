import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  private contacts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  filterContacts (ev: any) {
    this.userProvider.getContacts().then(data => {
      this.contacts = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.contacts = this.contacts.filter((contact) => {
          return (contact.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }
}
