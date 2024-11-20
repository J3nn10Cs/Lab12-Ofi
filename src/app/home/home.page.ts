import { Component } from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular'
import {AngularFirestore} from '@angular/fire/compat/firestore'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  posts : any

  constructor(
    private loadingCtrl : LoadingController,
    private toastCtrl : ToastController,
    private fireStore : AngularFirestore
  ) {}

  ionViewWillEnter(){
    this.getPosts()
  }

  async getPosts(){
    let loader = await this.loadingCtrl.create({
      message : "Espere un momento por favor..."
    })

    await loader.present();

    try {
      this.fireStore.collection('posts')
      .snapshotChanges()
      .subscribe((data : any[]) => {
        this.posts = data.map((e:any) => {
          return {
            id : e.payload.doc.id,
            title : e.payload.doc.data()["title"],
            details : e.payload.doc.data()["details"]
          }
        })
      })

      await loader.dismiss()
    } catch (error : any) {
      error.message = "mensaje de error del home"
      let errorMessage = error.message || error.getLocalizedMessage()

      this.showToast(errorMessage)
    }
  }

  async deletePost(id : string){
    let loader = await this.loadingCtrl.create({
      message : "Espere un mometo por favor..."
    })

    await loader.present()

    await this.fireStore.doc("posts/"+id).delete()

    await loader.dismiss()
  }

  showToast(message : string){
    this.toastCtrl.create({
      message : message,
      duration : 5000
    }).then(toastData => toastData.present())
  }
}
