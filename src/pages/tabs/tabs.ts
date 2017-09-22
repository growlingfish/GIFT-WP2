import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { TheirGiftsPage } from '../theirgifts/theirgifts';
import { MyGiftsPage } from '../mygifts/mygifts';
import { ActivityPage } from '../activity/activity';
import { LoginPage } from '../login/login';
import { RolePage } from '../role/role';
import { OpenMyGiftPage } from '../openmygift/openmygift';

import { UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  makeRoot = TheirGiftsPage;
  unwrapRoot = MyGiftsPage;
  activityRoot = ActivityPage;

  selectedTab: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {
    this.selectedTab = navParams.get('tab') || 0;
  }

  ionViewWillEnter () {
    var user = this.userProvider.getUser();
    user.then(data => {
      if (data == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.userProvider.getSeenFreeGift().then(hasSeenGift => {
          if(hasSeenGift){
            this.userProvider.getSeenRoles().then(hasSeenRoles => {
              if (!hasSeenRoles) {
                this.navCtrl.setRoot(RolePage);
              }
            });
          } else {
            this.userProvider.setSeenFreeGift(true);
            let alert = this.alertCtrl.create({
              title: "You've received a gift!",
              message: 'Would you like to see this gift now?',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    let navTransition = alert.dismiss();
                    navTransition.then(() => {
                      this.navCtrl.push(OpenMyGiftPage, {
                        gift: this.getFreeGift()
                      });
                    });
                    return false;
                  }
                },
                {
                  text: 'No, thanks',
                  role: 'cancel',
                  handler: () => {
                    let navTransition = alert.dismiss();
                    navTransition.then(() => {
                      this.userProvider.getSeenRoles().then(hasSeenRoles => {
                        if (!hasSeenRoles) {
                          this.navCtrl.setRoot(RolePage);
                        }
                      });
                    });
                    return false;
                  }
                }
              ]
            });
            alert.present();
          }
        });
      }
    });
  }

  getFreeGift () {
    let d = new Date();
    let freeGift = {
      "ID": 10000000,
      "post_author": "73",
      "post_date": d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
      "post_title": "Free gift from Brighton Museum",
      "post_author_data": {
        "ID": "73",
        "user_email": "brightonmuseum@growlingfish.com",
        "nickname": "Brighton Museum"
      },
      "wraps": [
        {
          "ID": 10000001,
          "unwrap_object": {
            "ID": 427,
            "post_author": "45",
            "post_content": "This jug can be found in Mr Willet's Popular Pottery gallery.",
            "post_title": "Jug c1850",
            "post_image": "https://gifting.digital/app/uploads/2017/07/punch-1024x768.jpg",
            "location": false
          }
        },
        {
          "ID": 10000002,
          "unwrap_object": {
            "ID": 215,
            "post_author": "1",
            "post_content": "The head can be found in the Ancient Egypt Room.",
            "post_title": "Head of a King",
            "post_image": "https://gifting.digital/app/uploads/2017/07/P7182279-e1500721341760.jpeg",
            "location": [
              {
                ID: 846,
                post_title: "Ancient Egypt gallery"
              }
            ]
          }
        },
        {
          "ID": 10000003,
          "unwrap_object": {
            "ID": 225,
            "post_author": "1",
            "post_content": "These lips are in the 20th Century Art and Design gallery",
            "post_title": "Mae West Lips Sofa",
            "post_image": "https://gifting.digital/app/uploads/2017/07/P7182276.jpeg",
            "location": [
              {
                ID: 934,
                post_title: "20th Century Art &amp; Design Gallery"
              }
            ]
          }
        }
      ],
      "payloads": [
        {
          "ID": 10000004,
          "post_content": "We chose this jug because it makes us laugh and reminds us of someone we know with a particularly fine nose. Can you imagine drinking out of this, holding it to your mouth the thickness of the china and looking into his body from the top at your favourite drink as you tip it down into your throat."
        },
        {
          "ID": 10000005,
          "post_content": "Next is the middle section of your experience. It is The Head of The King in the Egyptian Gallery. This is so far back in time it seems almost unreal and looks plastic, like an airbrushed photo of a face in a magazine. This was a way of saying I was here and it makes us think about how we do that now. Do you have a statue of you?"
        },
        {
          "ID": 10000006,
          "post_content": "The end of your experience and our gift for you is the Mae West Lips in the Twentieth Century Art and Design Gallery. We thought by now you might want to sit down and there is a small version of the lips not in the case where you can do this - they are big enough to eat you. Sit down and gaze around a little and imagine you are at home and this is your sofa and this is your lounge and this is your large house, although it was actually Prince Regent's stables. When you are ready you can go. We hope you like your Gift! Now why not make one for someone you know or see if a Gift has been made for you to unwrap."
        }
      ],
      "giftcards": [
        {
          "ID": 10000007,
          "post_content": "We hope you enjoy it!",
          "post_title": "Here's one we made earlier for you"
        }
      ],
      "status": {
        "received": true,
        "unwrapped": true,
        "responded": true,
      }
    };
    return freeGift;
  }
}
