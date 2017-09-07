import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { TsandcsPage } from '../pages/tsandcs/tsandcs';
import { RegisterPage } from '../pages/register/register';
import { RolePage } from '../pages/role/role';
import { NewGiftPage } from '../pages/newgift/newgift';
import { ReviewGiftPage } from '../pages/reviewgift/reviewgift';
import { ReviewMyGiftPage } from '../pages/reviewmygift/reviewmygift';
import { MyGiftsPage } from '../pages/mygifts/mygifts';
import { TheirGiftsPage } from '../pages/theirgifts/theirgifts';
import { ActivityPage } from '../pages/activity/activity';
import { ObjectsPage } from '../pages/objects/objects';
import { NewMessagePage } from '../pages/newmessage/newmessage';
import { ViewObjectPage } from '../pages/viewobject/viewobject';
import { NewObjectPage } from '../pages/newobject/newobject';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactsPage } from '../pages/contacts/contacts';
import { InvitePage } from '../pages/invite/invite';
import { ReviewMessagePage } from '../pages/reviewmessage/reviewmessage';
import { ReviewObjectPage } from '../pages/reviewobject/reviewobject';
import { OpenMyGiftPage } from '../pages/openmygift/openmygift';
import { OpenMessagePage } from '../pages/openmessage/openmessage';
import { OpenObjectPage } from '../pages/openobject/openobject';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { GlobalVarProvider } from '../providers/global-var/global-var';
import { FCM } from '@ionic-native/fcm';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    LoginPage,
    LogoutPage,
    TsandcsPage,
    RegisterPage,
    RolePage,
    NewGiftPage,
    ReviewGiftPage,
    ReviewMyGiftPage,
    MyGiftsPage,
    TheirGiftsPage,
    ActivityPage,
    NewMessagePage,
    ObjectsPage,
    ViewObjectPage,
    NewObjectPage,
    TabsPage,
    ContactsPage,
    InvitePage,
    ReviewMessagePage,
    ReviewObjectPage,
    OpenMyGiftPage,
    OpenMessagePage,
    OpenObjectPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    LogoutPage,
    TsandcsPage,
    RegisterPage,
    RolePage,
    NewGiftPage,
    ReviewGiftPage,
    ReviewMyGiftPage,
    MyGiftsPage,
    TheirGiftsPage,
    ActivityPage,
    NewMessagePage,
    ObjectsPage,
    ViewObjectPage,
    NewObjectPage,
    TabsPage,
    ContactsPage,
    InvitePage,
    ReviewMessagePage,
    ReviewObjectPage,
    OpenMyGiftPage,
    OpenMessagePage,
    OpenObjectPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    GlobalVarProvider,
    FCM,
    Camera,
    File,
    FileTransfer,
    FilePath
  ]
})
export class AppModule {}
