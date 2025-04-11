import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { ChangeDataService } from "src/app/core/services/changeData.service";
import { NotificationService } from "src/app/core/services/Notification.service";
import { TransactionService } from "src/app/core/services/transaction.service";
import { UserService } from "src/app/core/services/user.service";
import { textglobal } from "src/app/core/text-global";
import Swal from "sweetalert2";

@Component({
  selector: "transaction-page",
  templateUrl: "transaction.component.html",
  styleUrls: ["./transaction.component.scss"]
})
export class TransactionPage {
  isCollapsed = true;
  data = [];
  public dataUser;
  currency = new Intl.NumberFormat('USD',{
    style: 'currency',
    minimumFractionDigits: 2,
    currency: "USD"
  })

  constructor(private transactionService: TransactionService, private router:Router,
    private notificationService : NotificationService,
    private changeDataService: ChangeDataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUserData();
    
  }

  /**
   * @Validar valida el usuario 
   * @User 
   * @Return user
   */
  public getUserData() {
    let profile =  JSON.parse(localStorage.getItem("profile"))
    this.userService.getUser(profile.email).subscribe(
      response => {
        this.dataUser = response;
        this.getTransacciont();
        
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


  getTransacciont(){
    let profile = JSON.parse(localStorage.getItem("profile"));
    if(this.dataUser.rols[0].name == "ROLE_ADMIN"){
      this.transactionService.getall().subscribe(
        response => {
          this.data = response;
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
    }else{
      this.transactionService.getByuser(profile.id).subscribe(
        response => {
          this.data = response;
          console.log("transacciones ---> ", response)
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
  }


  public aproved(item: any) {
    item.status = 'true'
    this.transactionService.save(item).subscribe(
      response => {
        Swal.fire({
          title: "Completado",
          text: "Transacción aprobada",
          icon: "success"
        });
      },
      error=> {
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

  public refused(item: any) {
    item.status = 'false'
    this.transactionService.save(item).subscribe(
      response => {
        Swal.fire({
          title: "Completado",
          text: "Transacción rechazada",
          icon: "success"
        });
      },
      error=> {
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
}
