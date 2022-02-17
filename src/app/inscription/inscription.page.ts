import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage  {


email; address;password:string;
name:string;
cin:string
phone:string

@ViewChild('id_f') file_id:any;

  constructor(private afs :AngularFirestore,
    private afauth:AngularFireAuth,
    private storage:AngularFireStorage,
    private route:Router,
    private loadingCtrl : LoadingController,
    private toastr :ToastController) { }


  async register(){
 
  if(this.name && this.email && this.phone && this.password && this.cin &&  this.address  ){
    const loading = await this.loadingCtrl.create({
      message:'proccessing..',
      spinner:'crescent',
      showBackdrop:true
    });
    loading.present(); 
    const files=this.file_id.nativeElement.files[0];
    const filepath= `${Date.now()}_${files.name}`;
     this.storage.upload(filepath,files); 
    
    
    this.afauth.createUserWithEmailAndPassword(this.email,this.password).then((data)=>{
      data.user.sendEmailVerification();
      this.afs.collection('user').doc(data.user.uid).set({
        'userId':data.user.uid,
        'userName':this.name,
        'userEmail':this.email, 
        'userPhone':this.phone,
        'userCin':this.cin,
        'userAdress':this.address,
        'userImage':filepath, 
        'createdAt':Date.now()
      })
      .then(()=>{
        loading.dismiss()
        this.toast('Registration Success! please check your email ','success')
        this.route.navigate(['/home']);
      })
      .catch(err =>{
        loading.dismiss()
        this.toast(err.message,'danger');
      })
    })
    .catch(err=>{
      loading.dismiss()
      this.toast(err.message,'danger');})
  }else{
    
    this.toast('please fill the form', 'warning');
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
  

 
 


}
