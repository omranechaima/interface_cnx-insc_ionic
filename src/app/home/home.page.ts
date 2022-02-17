
 import { Component, OnInit } from '@angular/core';
 import { FormGroup } from '@angular/forms';
 import { Router } from '@angular/router';
 import { AngularFireAuth } from '@angular/fire/compat/auth'
 import { AlertController, LoadingController, ToastController } from '@ionic/angular' 
 
 import { AngularFirestore } from '@angular/fire/compat/firestore'
 import firebase from 'firebase/compat/app'
 @Component({
   selector: 'app-home',
   templateUrl: './home.page.html',
   styleUrls: ['./home.page.scss'],
 })
 export class HomePage {
   validationUserMessage={
     email:[
       {type:"required",message:"enter your email"},
       {type:"pattern",message:"incorrect"}
     ],
     password:[
       {type:"required",message:"enter your pass"},
       {type:"minlength",message:"min 5 char"}
     ]
   }
   x:string
   email:string;
   password:string;
   constructor(private fire :AngularFireAuth,private toastr:ToastController,private alertt:AlertController, private route:Router,private store:AngularFirestore,private loadingCtrl:LoadingController) { }
 
   async connexion(email,password){
     if(this.email && this.password){
       const loading = await this.loadingCtrl.create({
         message:'Authenticating..',
         spinner:'crescent',
        showBackdrop:true
         
       })
       loading.present();
       this.fire.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=>
       { 
         this.fire.signInWithEmailAndPassword(email,password).then((data)=>
         {
           if (!data.user.emailVerified)
        {
      loading.dismiss();
      this.route.navigate([''])
    }
  }).catch(error=>{loading.dismiss()
    this.toast(error.message,'danger')})
       })}
     else{
         this.toast('please enter your email & password','warning');
       }
       
   }
 
       async toast(message,status){
     const toast=await this.toastr.create({
       message:message,
       color:status,
       position:'top',
       duration:2000
     });
     toast.present();
   
 
  
     }
  inscription() {
    this.route.navigateByUrl("/inscription")
  }

}
