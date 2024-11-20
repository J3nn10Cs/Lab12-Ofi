import { Component, OnInit } from '@angular/core';
import {ToastController, LoadingController,NavController} from '@ionic/angular'
import { User } from '../models/user.model';
import {AngularFireAuth}  from '@angular/fire/compat/auth'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user = {} as User

  constructor(
    //sinbolo que carga
    private toastCtrl : ToastController,

    //muestra la carga
    private loadingCtrl : LoadingController,

    //facotr de auth
    private afAuth : AngularFireAuth,

    //Control para la navegacion
    private navCtrl : NavController
  ) { 

  }

  ngOnInit() {
  }

  async register(user : User) {
    if(this.formValidation()){
      let loader = await this.loadingCtrl.create({
        message : 'Espere un momento...'
      })

      await loader.present()

      try {
        //evaluar
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {
          console.log(data);

          //mandamos al home
          this.navCtrl.navigateRoot('home')
        })
      } catch (error : any) {
        error.message = "Error al regsitrarse"
        let errorMessage = error.message || error.getLocalizedMessage()

        //poput
        this.showToast(errorMessage)
      }

      await loader.dismiss()
    }
  }

  formValidation(){
    if(!this.user.email && !this.user.password){
      this.showToast('Ingrese un email y contraseña');
      return false
    }

    return false
  }

  showToast(message : string){
    this.toastCtrl.create({
      message : message,
      duration: 40000
    }).then(toastData => toastData.present())
  }

}
