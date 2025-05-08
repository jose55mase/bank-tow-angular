import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { ChangeDataService } from "src/app/core/services/changeData.service";
import { NotificationService } from "src/app/core/services/Notification.service";
import { TransactionService } from "src/app/core/services/transaction.service";
import { UserService } from "src/app/core/services/user.service";
import { textglobal } from "src/app/core/text-global";
import Swal from "sweetalert2";

@Component({
  selector: "user-page",
  templateUrl: "user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserPage  implements OnInit {
  
  public dataUser;
  public showListUser  = true;
  public showUdateUser = false;
  public listUser      = [];
  public loadProces    = false;
  private userSelected;
  public createBtn     = false;
  public statusDocument;
  public moneyUser      = 0;
  public fullNameUser   = "";
  public isCollapsed    = true;
  checkoutForm;
  data;


  currency = new Intl.NumberFormat('USD',{
    style: 'currency',
    minimumFractionDigits: 2,
    currency: "USD"
  })

  constructor(private userService: UserService, private formBuilder: FormBuilder,
    private notificationService : NotificationService,
    private changeDataService: ChangeDataService,
    private transactionService: TransactionService, private router: Router,
  ){}

  ngOnInit() {
    this.loadProces = true;
    this.getUserData()
    
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
        console.log("Buscando la usuario ---> ", response)
        this.getUserList()
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

 
  getUserList(){

    if(this.dataUser.rols[0].name == "ROLE_ADMIN"){
      this.userService.getListUser().subscribe(
        respone => {
          this.loadProces = false;
          this.listUser = respone
          console.log("---------- ",this.listUser);
        },
        error => {
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
    }else{
        this.userService.getUser(this.dataUser.email).subscribe(
          respone => {
            this.loadProces = false;
            this.listUser = [respone]
          },
          error => {
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

  onMoneySelectUser(item){
    this.userSelected = item;
    this.moneyUser = item.moneyclean
    this.fullNameUser = (item.fistName +" "+ item.lastName)
    
  }

  onSaveMoney(){
   

    Swal.fire({
      title: `Monto a enviar: $ ${this.moneyUser}`,
      showCancelButton: true,
      confirmButtonText: "Enviar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSelected.moneyclean = this.moneyUser;
        this.userService.update(this.userSelected).subscribe(
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
              this.router.navigate(['/home'])
            }
            if(error.status == 500){
              this.notificationService.alert("", textglobal.error, 'error');
            }
          }
        )
      }
    });
  }

  validateDocuments(item){
    localStorage.setItem("selectedUser", JSON.stringify(item))
    if(this.dataUser.rols[0].name == "ROLE_ADMIN"){
      this.router.navigate(['/filesAdmin'])
    }else{
      this.router.navigate(['/files'])
    }
  }

  public refuseAproved(item, status:Boolean){
      
    item.manage = status;

    this.userService.update(item).subscribe(
      response => {
        Swal.fire({
          title: "Éxito",
          text: "Archivo rechazado",
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
          this.router.navigate(['/home'])
        }
        if(error.status == 500){
          this.notificationService.alert("", textglobal.error, 'error');
        }
      }
    )
  }


 

}
