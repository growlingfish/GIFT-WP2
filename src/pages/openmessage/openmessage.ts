import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import { Shake } from '@ionic-native/shake';
import { VideoPlayer } from '@ionic-native/video-player';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-openmessage',
  templateUrl: 'openmessage.html',
})
export class OpenMessagePage {

  private message: string;
  private revealed: boolean;
  private watch;
  private video: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private platform: Platform, private shake: Shake, private zone: NgZone, private videoPlayer: VideoPlayer, private nativeAudio: NativeAudio) {
    this.message = navParams.get('message');
    this.revealed = false;

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.zone.run(() => {
          this.nativeAudio.preloadSimple('success', 'assets/ting.mp3');
        });
      }
    });
  }

  private videos = [
    'shake1_looped.mp4',
    'shake2_looped.mp4',
    'shake3_looped.mp4',
    'shake4_looped.mp4'
  ];

  playVideo () {
    if (!this.revealed) {
      console.log("Playing video " + this.video);
      this.videoPlayer.play(this.video).then(() => {
        console.log("Finished video");
        if (!this.revealed) {
          console.log("Looping video");
          this.playVideo();
        }
      }).catch(err => {
        console.log(err);
        this.revealed = true;
      });
    }
  }

  ionViewDidEnter () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.video = 'file:///android_asset/www/assets/' + this.videos[Math.floor(Math.random() * this.videos.length)];
          this.playVideo();
        }
        this.watch = this.shake.startWatch().subscribe(() => {
          this.zone.run(() => {
            this.videoPlayer.close();
            this.nativeAudio.play('success');
            this.revealed = true;
          });
        });
      } else {
        this.revealed = true;
      }
    });
  }

  back () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.watch.unsubscribe();
      }
    });
    this.viewCtrl.dismiss();
  }

}
