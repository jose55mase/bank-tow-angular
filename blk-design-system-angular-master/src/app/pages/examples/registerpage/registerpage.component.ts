import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { NotificationService } from "src/app/core/services/Notification.service";
import { UserService } from "src/app/core/services/user.service";
import { textglobal } from "src/app/core/text-global";
import { FormGroup} from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import Swal from "sweetalert2";

@Component({
  selector: "app-registerpage",
  templateUrl: "registerpage.component.html",
  styleUrls: ['./registerPage.component.css']
})
export class RegisterpageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  checkoutForm;
  public loading = false;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Colombia, CountryISO.Mexico, CountryISO.Argentina,CountryISO.Chile];
	phoneForm = new FormGroup({
		
	});


	changePreferredCountries() {
		this.preferredCountries = [CountryISO.Colombia, CountryISO.Mexico, CountryISO.Argentina,CountryISO.Chile];
	}
 
  constructor( private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService : NotificationService,
    private router:Router,
  ) {

    this.checkoutForm = this.formBuilder.group({
      
      email: new FormControl('',Validators.compose([
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])),

      fistName: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      country: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      postal: new FormControl('',Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])),
      passwordConfir: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])),


    });
  }
  ngOnInit() {
    const inputElement = document.getElementById('#phone')
  }
  

  

  create(){

    if(this.checkoutForm.value.email.length == 0 ){
      this.notificationService.alert("", "El campo  Email es necesario o incorrecto", 'warning');
      return
    }

    if(this.checkoutForm.value.password.length == 0){
      this.notificationService.alert("", "El campo Contraseña es necesario", 'warning');
      return
    }

    if(this.checkoutForm.value.postal == null){
      this.notificationService.alert("", "El campo Telefono es requerido", 'warning');
      return
    }

    if(this.checkoutForm.value.country.length == 0){
      console.log("Data ---> ", this.checkoutForm.value.country)
      this.notificationService.alert("", "El campo Pais es requerido", 'warning');
      return
    }

    if(this.checkoutForm.value.fistName.length == 0){
      console.log("Data ---> ", this.checkoutForm.value.fistName)
      this.notificationService.alert("", "El campo Nombre es requerido", 'warning');
      return
    }

    

    if(this.checkoutForm.value.password != this.checkoutForm.value.passwordConfir){
      this.notificationService.alert("", "Las credenciales no coinciden", 'warning');
      return
    }else{
      let rols = [
        {
          "id": 1,
          "name": "ROLE_USER"
        }
      ]
      const objet = {
        "password": this.checkoutForm.value.password,
        "username": "testing",
        "email": this.checkoutForm.value.email,
        "fistName": this.checkoutForm.value.fistName,
        "lastName": this.checkoutForm.value.lastName,      
        "city": this.checkoutForm.value.city,
        "country": this.checkoutForm.value.country,
        "postal": this.checkoutForm.value.postal.internationalNumber,
        "aboutme": this.checkoutForm.value.aboutme,
        "moneyclean": this.checkoutForm.value.amount,
        "status": true,
        "foto": "",
        "documentFrom": "",
        "documentBack": "",
        "administratorManager": this.checkoutForm.value.administratorManager,
        "rols": rols
      }
      this.loading = true;
      this.userService.savaUser(objet).subscribe(
        response => {
          this.loading = false;
          if(response.responseCode === 200){
            Swal.fire({
              title: "Éxito",
              text: "Usuario Creado con exito",
              icon: "success"
            });
            //this.router.navigate(['/home'])
          }else{
            Swal.fire({
              title: "Alerta",
              text: "Usuario con este correo ya esta registrado",
              icon: "warning"
            });
          }
        },
        error => {
          this.loading = false;
          console.log("Error en la consulta", error)
          if(error.status == 401){
            Swal.fire({
              title: "Fin de sesion",
              text: "La sesion a finalizado vueva a iniciar sesion",
              icon: "warning"
            });
            this.router.navigate(['/login'])
          }
          if(error.status == 500){
            this.notificationService.alert("", textglobal.error, 'error');
          }
        }
      )
    }  
  }

  ngOnDestroy() {
    
  }
}
