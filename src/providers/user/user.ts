import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Platform, AlertController, App, LoadingController } from 'ionic-angular';

import { TabsPage } from '../../pages/tabs/tabs';

import { GlobalVarProvider } from '../global-var/global-var';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class UserProvider {

  constructor(public http: Http, private storage: Storage, private globalVar: GlobalVarProvider, private platform: Platform, private fcm: FCM, private alertCtrl: AlertController, public appCtrl: App, public loadingCtrl: LoadingController) {
  }

  public getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

  public setSeenIntro (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenIntro', val));
  }

  public getSeenRoles (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenRoles'));
  }

  public setSeenRoles (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenRoles', val));
  }

  public getSeenFreeGift (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('freeGift'));
  }

  public setSeenFreeGift (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('freeGift', val));
  }

  public getFCMToken (): Promise<string> {
    return this.storage.ready().then(() => this.storage.get('fcmToken'));
  }

  public setFCMToken (val: string) {
    return this.storage.ready().then(() => this.storage.set('fcmToken', val));
  }

  /*
  var user = this.userProvider.getUser();
        user.then(data => {
          console.log(data);
        });
  */
  public getUser (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('user'));
  }

  public setUser (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('user', val));
  }

  public getMyGifts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('myGifts'));
  }

  public setMyGifts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('myGifts', val));
  }

  public getTheirGifts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('theirGifts'));
  }

  public setTheirGifts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('theirGifts', val));
  }

  public getUnfinishedGift (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('unfinishedGift'));
  }

  public setUnfinishedGift (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('unfinishedGift', val));
  }

  public clearUnfinishedGift (): Promise<any> {
    return this.storage.ready().then(() => this.storage.remove('unfinishedGift'));
  }

  public getUnopenedGift (giftId: number): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('unopenedGift' + giftId));
  }

  public setUnopenedGift (giftId: number, val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('unopenedGift' + giftId, val));
  }

  public clearUnopenedGift (giftId: number): Promise<any> {
    return this.storage.ready().then(() => this.storage.remove('unopenedGift' + giftId));
  }

  public getContacts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('contacts'));
  }

  public setContacts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('contacts', val));
  }

  public getObjects (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('objects'));
  }

  public setObjects (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('objects', val));
  }

  public getLocations (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('locations'));
  }

  public setLocations (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('locations', val));
  }

  public login (username: string, password: string) {
    if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getAuthURL(username, password))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user).then(data => {
                this.initialiseData();
                this.initialiseFCM();
                observer.next(true);
                observer.complete();
              });
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  public initialiseFCM () {
    //https://github.com/fechanique/cordova-plugin-fcm
    //https://console.firebase.google.com/project/gift-eu-1491403324909/notification
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.getToken().then(token => {
          console.log("New token " + token);
          this.setFCMToken(token);
        }, error => {
          console.log("FCM getToken failed ...");
          console.log(error);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log("Refreshed token " + token);
          this.setFCMToken(token);
        }, error => {
          console.log("FCM getToken failed ...");
        });
          
        this.fcm.subscribeToTopic('giftGlobal');
        console.log("Attempted to subscribe to giftGlobal");

        this.fcm.subscribeToTopic('giftDeliveries');
        console.log("Attempted to subscribe to giftDeliveries");

        this.fcm.subscribeToTopic('giftStatus');
        console.log("Attempted to subscribe to giftStatus");
        
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) { //Notification was received in notification tray (app is in background)
            
          } else { //Notification was received when app is in foreground
          
          }
          switch (data.topic) {
            case 'giftGlobal':
              let alert = this.alertCtrl.create({
                title: data.title,
                subTitle: data.body,
                buttons: ['OK']
              });
              alert.present();
              break;
            case 'giftDeliveries':
              this.getUser().then(user => {
                if (user == null) {
                  // not logged in; no deliveries for me
                } else {
                  if (user.ID == data.recipientID) {
                    let alert = this.alertCtrl.create({
                      title: "You've received a gift!",
                      message: 'Would you like to see your gifts now?',
                      buttons: [
                        {
                          text: 'Yes',
                          handler: () => {
                            let navTransition = alert.dismiss();
                            navTransition.then(() => {
                              let loading = this.loadingCtrl.create({
                                content: 'Checking for new gifts ...',
                                duration: 10000
                              });
                              loading.present().then(()=>{
                                this.updateMyGifts().subscribe(done => {
                                  this.appCtrl.getRootNav().setRoot(TabsPage, {
                                    tab: 1
                                  });
                                  loading.dismissAll();
                                });
                              });
                            });
                            return false;
                          }
                        },
                        {
                          text: 'No, thanks',
                          role: 'cancel'
                        }
                      ]
                    });
                    alert.present();
                  }
                }
              });
              break;
            case 'giftStatus':
              this.getUser().then(user => {
                if (user == null) {
                  // not logged in; no status updates for me
                } else {
                  if (user.ID == data.senderID) {
                    let alert = this.alertCtrl.create({
                      title: data.title,
                      message: data.body,
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                }
              });
              break;
            default:
              console.log(data);
              break;
          }
        });
      }
    });
  }

  public initialiseData () {
    this.updateTheirGifts().subscribe(complete => {
      if (complete) {
        console.log("Succeeded getting sent gifts");
      } else {
        console.log("Failed getting sent gifts");
      }
    },
    error => {
      console.log("Failed getting sent gifts");
    });

    this.updateMyGifts().subscribe(complete => {
      if (complete) {
        console.log("Succeeded getting received gifts");
      } else {
        console.log("Failed getting received gifts");
      }
    },
    error => {
      console.log("Failed getting received gifts");
    });

    this.updateContacts().subscribe(complete => {
      if (complete) {
        console.log("Succeeded getting contacts");
      } else {
        console.log("Failed getting contacts");
      }
    },
    error => {
      console.log("Failed getting contacts");
    });

    this.updateObjects().subscribe(complete => {
      if (complete) {
        console.log("Succeeded getting objects");
      } else {
        console.log("Failed getting objects");
      }
    },
    error => {
      console.log("Failed getting objects");
    });

    this.updateLocations().subscribe(complete => {
      if (complete) {
        console.log("Succeeded getting locations");
      } else {
        console.log("Failed getting locations");
      }
    },
    error => {
      console.log("Failed getting locations");
    });
  }
 
  public logout (): Promise<null> {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.unsubscribeFromTopic('giftGlobal');
        this.fcm.unsubscribeFromTopic('giftDeliveries');
        this.fcm.unsubscribeFromTopic('giftStatus');
      }
    });

    return this.storage.ready().then(() => this.storage.clear());
  }

  public register (username: string, password: string, email: string, name: string): Observable<any> {
    if (email === null || password === null || name === null || username === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getRegisterURL(username, password, email, name))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user).then(data => {
                observer.next(true);
                observer.complete();
              });
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  updateTheirGifts (): Observable<any> {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        this.http.get(this.globalVar.getSentGiftsURL(data.ID))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setTheirGifts(data.gifts);
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  updateMyGifts (): Observable<any> {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        this.http.get(this.globalVar.getReceivedGiftsURL(data.ID))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setMyGifts(data.gifts);
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  updateContacts (): Observable<any> {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        this.http.get(this.globalVar.getContactsURL(data.ID))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setContacts(data.contacts);
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  updateObjects (): Observable<any> {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        this.http.get(this.globalVar.getObjectsURL(data.ID))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setObjects(data.objects);
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  updateLocations (): Observable<any> {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        this.http.get(this.globalVar.getLocationsURL())
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setLocations(data.locations);
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  invite (email: string, name: string): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.http.get(this.globalVar.getInviteURL(data.ID, email, name))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              observer.next(data.user);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  finaliseObject (object: any) {
    return Observable.create(observer => {
      var user = this.getUser();
      user.then(data => {
        let body = new URLSearchParams();
        body.append('object', JSON.stringify(object));
        body.append('owner', data.ID);
        this.http.post(this.globalVar.getFinaliseObjectURL(), body)
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              observer.next(data.object);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    });
  }

  sendGift () {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getUnfinishedGift().then(gift => {
          let body = new URLSearchParams();
          body.append('gift', JSON.stringify(gift));
          body.append('sender', data.ID);
          this.http.post(this.globalVar.getFinaliseGiftURL(), body)
            .map(response => response.json())
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(false);
                observer.complete();
              }
            },
            function (error) {
              observer.next(false);
              observer.complete();
            });
        });
      });
    });
  }

  unwrappedGift (giftId) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getUnopenedGift(giftId).then(gift => {
          this.http.get(this.globalVar.getUnwrappedURL(giftId, data.ID))
            .map(response => response.json())
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(false);
                observer.complete();
              }
            },
            function (error) {
              observer.next(false);
              observer.complete();
            });
        });
      });
    });
  }

  receivedGift (giftId) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getUnopenedGift(giftId).then(gift => {
          this.http.get(this.globalVar.getReceivedURL(giftId, data.ID))
            .map(response => response.json())
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(false);
                observer.complete();
              } 
            },
            function (error) {
              observer.next(false);
              observer.complete();
            });
        });
      });
    });
  }

  sendResponse (giftId, response, sender, owner) {
    return Observable.create(observer => {
      let body = new URLSearchParams();
      body.append('response', response);
      body.append('sender', sender);
      body.append('owner', owner);
      this.http.post(this.globalVar.getResponseURL(giftId), body)
        .map(response => response.json())
        .subscribe(data => {
          if (typeof data.success !== 'undefined' && data.success) {
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        function (error) {
          observer.next(false);
          observer.complete();
        });
    });
  }

}
