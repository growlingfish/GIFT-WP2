import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { GlobalVarProvider } from '../global-var/global-var';

@Injectable()
export class UserProvider {

  constructor(public http: Http, private storage: Storage, private globalVar: GlobalVarProvider) {
  }

  public getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

  public setSeenIntro (val: boolean) {
    this.storage.set('seenIntro', val);
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

  public setUser (val: any) {
    this.storage.set('user', val);
  }

  public login (username: string, password: string) {
    if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getAuthURL(username, password))
          .map(response => response.json())
          .subscribe(data => {
            var authed = false;
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user);
              authed = true;
            }
            observer.next(authed);
            observer.complete();
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  public logout () {
    this.storage.clear();
  }

  public register (username: string, password: string, email: string, name: string) {
    if (email === null || password === null || name === null || username === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getRegisterURL(username, password, email, name))
          .map(response => response.json())
          .subscribe(data => {
            var authed = false;
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user);
              authed = true;
            }
            observer.next(authed);
            observer.complete();
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

}
