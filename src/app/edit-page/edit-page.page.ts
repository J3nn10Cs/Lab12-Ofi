import { Component, OnInit } from '@angular/core';
import {ToastController, LoadingController} from '@ionic/angular'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router'
import { Post } from '../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {

  post = {} as Post
  id : any

  constructor(
    private actRoute : ActivatedRoute,

    private router : Router,

    //sinbolo que carga
    private toastCtrl : ToastController,

    //muestra la carga
    private loadingCtrl : LoadingController,

    private firsestore : AngularFirestore
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id")
   }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id : string){
    if(this.formValidation()){
      let loader = await this.loadingCtrl.create({
        message : "Espere un momento por favor"
      })

      await loader.present()

      this.firsestore
        .doc("posts/"+id)
        .valueChanges()
        .subscribe((data : any) => {
          const {title,details} = data as {title : string, details : string}
          this.post.title = data.title
          this.post.details = data.details

          loader.dismiss();
        })
    }
  }

  async updatePost(post : Post){
    let loader = await this.loadingCtrl.create({
      message : "Actualizando..."
    })

    await loader.present()

    this.firsestore
      .doc("posts/" + this.id)
      .update(post)
      .then(() => {
        console.log("Elemento actualizado correctamente");
        this.router.navigate(['/home'])

        loader.dismiss()
      })
      .catch((error) => {
        console.log("Error al actualizar el elemento : " + error);
        loader.dismiss()
      })
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
