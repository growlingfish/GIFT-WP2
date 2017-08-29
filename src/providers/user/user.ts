import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
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

                //https://github.com/fechanique/cordova-plugin-fcm
                //https://console.firebase.google.com/project/gift-eu-1491403324909/notification
                this.platform.ready().then(() => {
                  if (this.platform.is('cordova')) {
                    this.fcm.getToken().then(token => {
                      console.log(token);
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

  public register (username: string, password: string, email: string, name: string) {
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

  updateTheirGifts () {
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

  updateMyGifts () {
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

}
