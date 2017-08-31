import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-newobject',
  templateUrl: 'newobject.html',
})
export class NewObjectPage {
  //{"ID":755,"post_author":"2","post_date":"2017-07-25 15:44:31","post_date_gmt":"2017-07-25 15:44:31","post_content":"<p>fourth test</p>\n","post_title":"..","post_excerpt":"","post_status":"publish","comment_status":"closed","ping_status":"closed","post_password":"","post_name":"755","to_ping":"","pinged":"","post_modified":"2017-07-25 15:44:31","post_modified_gmt":"2017-07-25 15:44:31","post_content_filtered":"","post_parent":0,"guid":"https://gifting.digital/object/755/","menu_order":0,"post_type":"object","post_mime_type":"","comment_count":"0","filter":"raw","post_image":"https://gifting.digital/app/uploads/2017/07/1500997445762-150x150.jpg"}
  object: any = {
    "post_title": "A new object",
    "location": {}
  };
  locations: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {}

  ionViewDidEnter () {
    this.userProvider.getUser().then(data => {
      this.object = {
        "post_title": "A new object",
        "location": {}
      };
      this.userProvider.getLocations().then(locations => {
        this.locations = locations;
      });
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  editPhoto() {

  }

  photoIcon (): string {
    if (!!this.object && !!this.object.post_image) {
      return this.object.post_image;
    } else {
      return "http://via.placeholder.com/100x100";
    }
  }

  photoTitle (): string {
    if (!!this.object && !!this.object.post_image) {
      return "Tap to change the photo";
    } else {
      return "Tap to add a photo";
    }
  }

  scrapObject () {
    this.navCtrl.pop();
  }

  isComplete (): boolean {
    if (!(!!this.object.post_image && !!this.object.post_title && !!this.object.post_content)) {
      return false;
    }
    return true;
  }

  add () {
    if (this.isComplete()) {
      console.log("To do");
    } else {
      let alert = this.alertCtrl.create({
        title: "Object not complete",
        subTitle: "You haven't finished making the object yet",
        buttons: ['OK']
      });
      alert.present(prompt);
    }
  }

}
