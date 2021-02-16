import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service";
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { Router } from '@angular/router';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  accaunt_created = true; // If accaunt is successfully created

  referencia;

  folder = "Usuarios";
  esImagen = true; // To check if is an image

  imgSrc: string;
  selectedImage: any;
  isSubmitted: boolean;
  required: boolean;

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  string: any = /^[a-zA-Z]*$/; //ok 
  decimal: any = /[0-9]/; // ok

  formTemplate = new FormGroup({
    nombre: new FormControl('',[Validators.required, Validators.pattern(this.string)]),
    apellido: new FormControl('', [Validators.required, Validators.pattern(this.string)]),
    edad: new FormControl('',[Validators.required, Validators.pattern(this.decimal), Validators.max(100), Validators.min(1)]),
    sexo: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    imageUrl: new FormControl('',Validators.required),
    especialidad: new FormControl(''),
    tipo: new FormControl('')
    
  })

  t = false;
  e = false;
  disponible: boolean;

  disponibilidad = Array();

  spinner:boolean;


  constructor(private storage: AngularFireStorage, private firebaseService: FirebaseService, public userService: UserService, private router: Router) { 
    
  }

  ngOnInit() {
    console.clear();
    this.resetForm();
  }

  recaptcha: any[];
  res = false;

  resolved(captchaResponse: any[]) {
    this.recaptcha = captchaResponse;
    this.res = true;
  }

  noCaptcha(){
    this.res = true;
  }

  showPreview(event:any) {
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);

      /* Checking if a file is an image */
      if((event.target.files[0].size <= 38780 && event.target.files[0].type == "image/jpeg") || (event.target.files[0].size <= 38780 && event.target.files[0].type == "image/gif") || (event.target.files[0].size <= 38780 && event.target.files[0].type == "image/jpg")) {
        this.selectedImage = event.target.files[0];
        this.esImagen = true;
      } else {
        this.esImagen = false;
      }
    } else {
      this.imgSrc = './assets/imagenes/user.png';
      this.selectedImage = null;
    }
  }

  registrar(nombre, apellido, edad, sexo, email, clave, especialidad, tipo, fecha_ingreso, foto) {

    this.spinner = true;
  
    this.firebaseService.createDBUsuarios(apellido, clave, edad, email, especialidad, fecha_ingreso, foto, nombre, sexo, tipo, this.disponibilidad).then(() => {

      this.resetForm();

      this.spinner = false;

      
      
      this.router.navigate(['/emailnv']);
      this.referencia.unsubscribe();

      this.router.navigate(['/emailnv']);

    }).catch(e => {
      console.log(e);
    });
    
  }


  onSubmit(formValue) {

    this.accaunt_created = true; // Reseting value to check it again later

    this.spinner = true;

    this.isSubmitted = true;

    if(this.userService.getTipo() === 'Admin') {
      
      

      if(formValue.especialidad === '' && formValue.tipo === '') {
        /* Not passed */
        this.t = true;
        this.e = true;
        this.required = true;
      } else {
        if(formValue.especialidad === '') {
          /* Not passed especialidad */
          this.e = true;
          this.t = false;
          this.required = true;
        }
        if(formValue.tipo === '') {
          /* Not passed tipo */
          this.t = true;
          this.e = false;
          this.required = true;
        }
        if(formValue.tipo !== '' && formValue.especialidad !== '') {
          /* All passed */
          this.e = false;
          this.t = false;
          this.required = false;
        }
      }

    } else {
      if(formValue.tipo === '') {
        /* Not passed tipo */
        this.t = true;
        this.e = false;
        this.required = true;
      }
      if(formValue.tipo !== '') {
        /* Tipo passed */
        this.t = false;
        this.required = false;
      }
    }

    if(this.formTemplate.valid && this.required === false) {
      
      /* Trying to create accaunt */
      this.firebaseService.createUser(formValue.email, formValue.password).then(val => {
            this.spinner = true;

            this.accaunt_created = true;

            if(this.accaunt_created) {
              // If accaunt is successfuly created, so we send email confirmation to activate accaunt
                val.user.sendEmailVerification();
              /* Begin to write a user in database*/
              /* Checking if it is Admin who registers users or not */
              if(this.userService.isAdmin() === true) {
                /* If is true, so I write all data such Especialidad and Tipo */
                
                /* First of all I prepare the storage for image uploading */
                var filePath = `${this.folder}/${formValue.email}_${this.selectedImage.name.split('.').slice(0,-1).join('.')+".jpg"}`;
                const fileRef = this.storage.ref(filePath);
                
                
                /* Now I upload the image to storage */
                this.referencia = this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
                  finalize(()=>{
                    fileRef.getDownloadURL().subscribe((url)=>{
                      formValue['imageUrl']=url; // Retrieving url
                
                  
                      this.registrar(formValue.nombre, formValue.apellido, formValue.edad, formValue.sexo, formValue.email, formValue.password, formValue.especialidad, formValue.tipo, "NA", url); // Después de guardar imagenes y referencias registro usuarios
                
                      this.resetForm();
    
                      this.spinner = false;
                    })
                  })
                ).subscribe();
                
              } // Is Admin
    
              /* Is User who registers him/her/ self */
    
              if(this.userService.isAdmin() === false) {
                /* If is false, so I write all data but NO Especialidad and NO Tipo */
                
                /* First of all I prepare the storage for image uploading */
                var filePath = `${this.folder}/${formValue.email}_${this.selectedImage.name.split('.').slice(0,-1).join('.')+".jpg"}`;
                const fileRef = this.storage.ref(filePath);
                
                
                /* Now I upload the image to storage */
                this.referencia = this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
                  finalize(()=>{
                    fileRef.getDownloadURL().subscribe((url)=>{
                      formValue['imageUrl']=url; // Retrieving url
                
                    
                      if(formValue.tipo == 'Especialista'){
                        var disponible =[];
                        this.registrar(formValue.nombre, formValue.apellido, formValue.edad, formValue.sexo, formValue.email, formValue.password, disponible, "Especialista", "NA", url);
                      }
                      if(formValue.tipo == 'Usuario'){
                        this.registrar(formValue.nombre, formValue.apellido, formValue.edad, formValue.sexo, formValue.email, formValue.password, "NA", "Usuario", "NA", url); // Después de guardar imagenes y referencias registro usuarios
                      }
                
                      this.resetForm();
    
                      
                    })
                  })
                ).subscribe();
                
              } // Is User
    
            } else{
              this.accaunt_created = false;
              this.spinner = false;
            }
            console.clear();
          }).catch(e => {
            console.log(e);
            this.accaunt_created = false;
          });
    }
    this.spinner = false;
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      nombre:'',
      imageUrl:'',
      apellido:'',
      edad: '',
      sexo: '',
      email: '',
      password: '',
      especialidad: '',
      tipo: ''
    });
    this.imgSrc = "./assets/imagenes/user.png";
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  

}
