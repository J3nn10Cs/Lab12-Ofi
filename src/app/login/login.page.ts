import { Component, OnInit } from '@angular/core';
import {ToastController, LoadingController,NavController} from '@ionic/angular'
import { User } from '../models/user.model';
import {AngularFireAuth}  from '@angular/fire/compat/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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
  ) { }

  ngOnInit() {
  }

  //recibe como parametro un usuario
  async login(user : User){
    if(this.formValidation()){
      let loader = await this.loadingCtrl.create({
        message : "Espere un momento por favor"
      })

      await loader.present();

      try {
        await this.afAuth.createUserWithEmailAndPassword(user.email,user.password).then(data => {
          console.log(data);

          this.navCtrl.navigateRoot("home")
        })
      } catch (error : any) {
        error.message = "Usuario no registrado"
        let errorMessage = error.message || error.getLocalizedMessage()

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

    return true
  }

  showToast(message : string){
    this.toastCtrl.create({
      message : message,
      duration: 40000
    }).then(toastData => toastData.present())
  }
}
