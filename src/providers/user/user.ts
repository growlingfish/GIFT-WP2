import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {

  constructor(public http: Http, private storage: Storage) {
  }

  getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

  setSeenIntro (val: boolean) {
    this.storage.set('seenIntro', val);
  }
/*
  login (username: string, password: string) {
    if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getAuthURL(credentials.email, credentials.password))
          .map(response => response.json())
          .subscribe(data => {
            var authed = false;
            if (typeof data.success !== 'undefined' && data.success) {
              this.currentUser = new User(decodeURIComponent(data.name), credentials.email, data.id);
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
  }*/

}
