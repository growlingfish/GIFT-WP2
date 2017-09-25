import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';
import { GlobalVarProvider } from '../../providers/global-var/global-var';

declare var cordova: any;

@Component({
  selector: 'page-newobject',
  templateUrl: 'newobject.html',
})
export class NewObjectPage {
  object: any = {
    "post_title": "",
    "location": {},
    "post_content": "",
    "post_image": ""
  };
  locations: Array<any>;
  lastImage: string = null;
  loading: Loading;
  part: number;
  uploadedFilename: string = null;
  selectOptions = {
    title: 'Where is the object?',
    subTitle: 'Choose the most suitable location from this list'
  };
  dropdowns = [
    false,
    false,
    false
  ];

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private globalVar: GlobalVarProvider, private userProvider: UserProvider, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, private camera: Camera, private filePath: FilePath, private file: File, public toastCtrl: ToastController, private transfer: FileTransfer, public loadingCtrl: LoadingController, private imageResizer: ImageResizer) {
    this.part = navParams.get('part');
  }

  ionViewDidEnter () {
    this.userProvider.getUser().then(data => {
      this.object = {
        "post_title": "",
        "location": {},
        "post_content": "",
        "post_image": ""
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
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), sourceType);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), sourceType);
      }
    }, (err) => {
      this.showErrorToast('Error while selecting image');
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
  private copyFileToLocalDir (namePath, currentName, newFileName, sourceType) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;

      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        let options = {
          uri: this.pathForImage(this.lastImage),
          quality: 75,
          width: 640,
          height: 480
         } as ImageResizerOptions;
         
         this.imageResizer
           .resize(options)
           .then((filePath: string) => this.lastImage = filePath)
           .catch(e => console.log(e));
      }

      this.uploadImage();
    }, error => {
      this.showErrorToast('Error while storing file.');
    });
  }
  
  showErrorToast (text) {
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
      if (response.success) {
        this.uploadedFilename = response.filename;
        this.object.post_image = response.url;
      } else {
        this.showErrorToast('Error while uploading file');
      }
    }, err => {
      this.loading.dismissAll();
      console.log(err);
      this.showErrorToast('Error while uploading file');
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
      return "Tap To Change The Photo";
    } else {
      return "Tap To Add A Photo";
    }
  }

  scrapObject () {
    this.navCtrl.pop();
  }

  isComplete (): boolean {
    if (!(
        !!this.object.post_image && this.object.post_image.length > 0 &&
        !!this.object.post_title && this.object.post_title.length > 0 &&
        !!this.object.post_content && this.object.post_content.length > 0 &&
        !!this.object.location
    )) {
      return false;
    }
    return true;
  }

  add () {
    if (this.isComplete()) {
      this.loading = this.loadingCtrl.create({
        content: 'Creating ...',
        duration: 10000
      });
      this.loading.present();
      this.userProvider.finaliseObject(this.object, this.uploadedFilename).subscribe(object => {
        if (object) {
          this.userProvider.getUnfinishedGift().then(gift => {
            gift.wraps[this.part].unwrap_object = object;
            this.userProvider.setUnfinishedGift(gift).then(data => {
              this.userProvider.updateObjects().subscribe(complete => {
                this.navCtrl.pop();
                this.navCtrl.pop();
                this.loading.dismissAll();
              });
            });
          });
        } else {
          this.loading.dismissAll();
          this.showError();
        }
      },
      error => {        
        this.loading.dismissAll();
        this.showError();
      });
    } else {
      let alert = this.alertCtrl.create({
        title: "Object not complete",
        subTitle: "You haven't finished making the object yet",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Object creation unsuccessful',
      subTitle: "Please try again",
      buttons: ['OK']
    });
    alert.present();
  }

  dropdown (card) {
    this.dropdowns[card] = !this.dropdowns[card];
  }
}
