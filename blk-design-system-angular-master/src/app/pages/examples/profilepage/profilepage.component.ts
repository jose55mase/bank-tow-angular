import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/core/services/user.service";
import * as moment from 'moment';
import { Router } from "@angular/router";
import { textglobal } from "src/app/core/text-global";
import { NotificationService } from "src/app/core/services/Notification.service";
import Swal from "sweetalert2";
import { TransactionService } from "src/app/core/services/transaction.service";
import { ChangeDataService } from "src/app/core/services/changeData.service";

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html"
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  
  public dataUser;

  constructor(
    private changeDataService : ChangeDataService,
    private notificationService : NotificationService,
    private transactionService: TransactionService,
    private userService: UserService, private formBuilder: FormBuilder, private router:Router) {
    this.checkoutForm = this.formBuilder.group({
   
      amount: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(1),
        Validators.maxLength(30)   
           
      ])),

      bank: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)      
      ])),

      type: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)      
      ])),
    });

    this.profileForm = this.formBuilder.group({
   
       
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])),

      fistName: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      lastName: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      city: new FormControl('',Validators.compose([
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
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])), 

      aboutme: new FormControl('',Validators.compose([        
        Validators.minLength(4),
        Validators.maxLength(30)      
      ])),
      
      amount: new FormControl('',Validators.compose([
        Validators.required,
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

  
  isCollapsed = true;
  checkoutForm;
  profileForm;
  data;
  transaction;
  currency = new Intl.NumberFormat('USD',{
    style: 'currency',
    minimumFractionDigits: 2,
    currency: "USD"
  })
  loadtransaction = false;
  objet = new Object;


  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getUserData()
    
    
    const token = JSON.parse(sessionStorage.getItem("token")) 
    if(token == null || token == undefined){
      this.router.navigate(['/home'])
    }
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }



  /**
   * @Validar valida el usuario 
   * @User 
   * @Return user
   */
  public getUserData() {
    this.dataUser =  JSON.parse(localStorage.getItem("profile"))
    this.userService.getUser(this.dataUser.email).subscribe(
      response => {
        this.dataUser = response;
        this.getTransaction(this.dataUser);
        this.data = this.dataUser;
        this.editUser(this.dataUser)
      },
      error => {
        if(error.status == 401){
          Swal.fire({
            title: "Fin de sesion",
            text: "La sesion a finalizado vueva a iniciar sesion",
            icon: "warning"
          });
          sessionStorage.clear;
          this.changeDataService.getLoginEvenEmitter.emit(false);
          sessionStorage.setItem("btn-login","false")
          this.router.navigate(['/home'])
        }
        if(error.status == 500){
          this.notificationService.alert("", textglobal.error, 'error');
        }
      }
    )
  }


  onSendTransaction(){
    this.loadtransaction = true;
    let profile = JSON.parse(localStorage.getItem("profile"))

    if(this.checkoutForm.value.amount > profile.moneyclean){
      this.notificationService.alert("", textglobal.create_transaction_warning, 'warning');
      this.loadtransaction = false;
      return
    }    

    const amount = profile.moneyclean - this.checkoutForm.value.amount;
    profile.moneyclean = amount;
    this.dataUser.moneyclean = amount;
    
   var idesData = Date.now()
    this.objet = {
      number : idesData,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      description : this.checkoutForm.value.desription,
      amount: this.checkoutForm.value.amount,
      banck: this.checkoutForm.value.bank,
      type: this.checkoutForm.value.type,
      status: "",
      userId: profile.id
    };

    Swal.fire({
      title: `Monto a enviar: $ ${this.checkoutForm.value.amount}`,
      showCancelButton: true,
      confirmButtonText: "Enviar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.data.moneyclean = this.dataUser.moneyclean
        this.transactionService.save(this.objet).subscribe(
          succes => {
            this.userService.update(this.dataUser).subscribe(
              response => {
                localStorage.setItem("profile", JSON.stringify(profile)) 
                let data = localStorage.getItem("transaction")
        
                if(data===null){      
                  localStorage.setItem("transaction", JSON.stringify([this.objet]))
                }else{
                  let array = JSON.parse(data)
                  array.push(this.objet) 
                  console.log(array)
                  localStorage.setItem("transaction", JSON.stringify(array))
                }
                this.notificationService.alert("", textglobal.create_transaction_success, 'success');
                
        
                Swal.fire({
                  title: "Transacción completada con éxito",
                  text: "La transacción esta en proceso de aprobación.",
                  icon: "success"
                });
                this.loadtransaction = false;
              },
              error => {
                this.notificationService.alert("", textglobal.error, 'error');
                this.loadtransaction = false;
              }
            )
          },
          error => {
            this.notificationService.alert("", textglobal.error, 'error');
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
    });
  }


  getTransaction(profile){
    this.transactionService.getByuser(profile.id).subscribe(
      response => {
        this.transaction = response;
      },
      error => {
        if(error.status == 401){
          Swal.fire({
            title: "Fin de sesion",
            text: "La sesion a finalizado vueva a iniciar sesion",
            icon: "warning"
          });
          this.router.navigate(['/home'])
        }
        if(error.status == 500){
          this.notificationService.alert("", textglobal.error, 'error');
        }
        console.log("error", error)}
    )
  }

  onSaveInformation(){
    
    const objet = {
      "id": this.data.id,
      "username": "usuario",
      "email": this.profileForm.value.email,
      "fistName": this.profileForm.value.fistName,
      "lastName": this.profileForm.value.lastName,      
      "city": this.profileForm.value.city,
      "country": this.profileForm.value.country,
      "postal": this.profileForm.value.postal,
      "aboutme": this.profileForm.value.aboutme,
      "moneyclean": this.profileForm.value.amount,
      "status": false,
      "foto": this.data.foto,
      "documentFrom": this.data.documentFrom,
      "documentBack": this.data.documentBack,
      "rols": this.data.rols,
      "documentsAprov": this.data.documentsAprov
    }


    this.userService.update(objet).subscribe(
      response => {
        Swal.fire({
          title: "Éxito",
          text: "Usuario actulizado con exito",
          icon: "success"
        });
      },
      error => {
        console.log("Error en la consulta", error)
        if(error.status == 401){
          Swal.fire({
            title: "Fin de sesion",
            text: "La sesion a finalizado vueva a iniciar sesion",
            icon: "warning"
          });
          this.changeDataService.getLoginEvenEmitter.emit(false);
          this.router.navigate(['/home'])
        }
        if(error.status == 500){
          this.notificationService.alert("", textglobal.error, 'error');
        }
      }
    )
  }

  editUser(item){
    this.profileForm.controls['email'].setValue(item.email)
    this.profileForm.controls['fistName'].setValue(item.fistName)
    this.profileForm.controls['lastName'].setValue(item.lastName)
    this.profileForm.controls['city'].setValue(item.city)
    this.profileForm.controls['country'].setValue(item.country)
    this.profileForm.controls['postal'].setValue(item.postal)
    this.profileForm.controls['aboutme'].setValue(item.aboutme)
    this.profileForm.controls['amount'].setValue(item.moneyclean)
    this.profileForm.controls['password'].setValue(item.moneyclean)
  }
}
