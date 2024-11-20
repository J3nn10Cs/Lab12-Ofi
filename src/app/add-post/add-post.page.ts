import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import {ToastController, LoadingController,NavController} from '@ionic/angular'
import {AngularFireAuth}  from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  post = {} as Post

  constructor(
    //sinbolo que carga
    private toastCtrl : ToastController,

    //muestra la carga
    private loadingCtrl : LoadingController,

    //facotr de auth
    private afAuth : AngularFireAuth,

    //Control para la navegacion
    private navCtrl : NavController,

    private firsestore : AngularFirestore
  ) { }

  ngOnInit() {
  }

  async createPost(post : Post){
    if(this.formValidation()){
      let loader = await this.loadingCtrl.create({
        message : "Espere un momento por favor"
      })

      await loader.present()

      try {
        await this.firsestore.collection("posts").add(post)
      } catch (error : any) {
        error.message = "Mensaje de error en post"
        let errorMessage = error.message || error.getLocalizedMessage()

        this.showToast(errorMessage)
      }

      await loader.dismiss()

      this.navCtrl.navigateRoot("home")
    }
  }

  formValidation(){
    if(!this.post.title){
      this.showToast('Ingrese un titulo');
      return false
    }
    if(!this.post.details){
      this.showToast('Ingrese una descripcion');
      return false
    }

    return true
  }

  showToast(message : string){
    this.toastCtrl.create({
      message : message,
      duration: 5000
    }).then(toastData => toastData.present())
  }

}
