import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';
import { GlobalVarProvider } from '../../providers/global-var/global-var';

declare var cordova: any;

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
  lastImage: string = null;
  loading: Loading;
  uploadedFilename: string = null;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private globalVar: GlobalVarProvider, private userProvider: UserProvider, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, private camera: Camera, private filePath: FilePath, private file: File, public toastCtrl: ToastController, private transfer: FileTransfer, public loadingCtrl: LoadingController) {}

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

  editPhoto () {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Where would you like to take the photo from?',
      //subTitle: 'Choose a photograph of the exhibit',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            });
          }
        },
        {
          text: 'Photo Gallery',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture (sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 75,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 640,
      targetHeight: 480
    };
  
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.showError('Error while selecting image');
    });
  }

  // Create a new name for the image
  private createFileName () {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir (namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.showError('Error while storing file.');
    });
  }
  
  showError (text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public uploadImage () {
    // Destination URL
    var url = this.globalVar.getObjectPhotoUploadURL();
  
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
  
    // File name only
    var filename = this.lastImage;
  
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data"/*,
      params : {
        'fileName': filename,
        'wrapId': this.wrapId,
        'userId': this.auth.currentUser.id
      }*/
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
      duration: 10000
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      let response = JSON.parse(data.response);
      console.log(response);
      if (response.success) {
        this.uploadedFilename = response.filename;
      } else {
        this.showError('Error while uploading file');
      }
    }, err => {
      this.loading.dismissAll();
      console.log(err);
      this.showError('Error while uploading file');
    });
  }
  
  // Always get the accurate path to your apps folder
  public pathForImage (img): string {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
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
      /*
      this.loading.present();
      this.workshop.finaliseObject(this.name, this.description, this.uploadedFilename).subscribe(added => {
        if (added) {
          this.workshop.gift.getWrapWithID(this.wrapId).setChallenge('object', added.id);
          this.workshop.storeGift();
          this.dismiss();
        } else {
          console.log("Object add failed");
        }
        this.loading.dismiss();
      },
      error => {
        console.log(error);
        this.loading.dismiss();
      });
      */
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
