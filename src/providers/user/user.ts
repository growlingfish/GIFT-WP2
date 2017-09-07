import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { GlobalVarProvider } from '../global-var/global-var';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class UserProvider {

  constructor(public http: Http, private storage: Storage, private globalVar: GlobalVarProvider, private platform: Platform, private fcm: FCM) {
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

                //https://github.com/fechanique/cordova-plugin-fcm
                //https://console.firebase.google.com/project/gift-eu-1491403324909/notification
                this.platform.ready().then(() => {
                  if (this.platform.is('cordova')) {
                    this.fcm.getToken().then(token => {
                      this.setFCMToken(token).then(token => {
                        console.log("New token " + token);
                      });
                    }, error => {
                      console.log(error);
                    });

                    this.fcm.onTokenRefresh().subscribe(token => {
                      this.setFCMToken(token).then(token => {
                        console.log("Refreshed token " + token);
                      });
                    });
                  }
                });

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
 
  public logout (): Promise<null> {
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
          this.http.get(this.globalVar.getUnwrappedURL(giftId))
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
          this.http.get(this.globalVar.getReceivedURL(giftId))
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

}
