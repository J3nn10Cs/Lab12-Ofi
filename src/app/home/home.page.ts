import { Component } from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular'
import {AngularFirestore} from '@angular/fire/compat/firestore'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private loadingCtrl : LoadingController,
    private toastCtrl : ToastController,
    private fireStore : AngularFirestore
  ) {}

}
