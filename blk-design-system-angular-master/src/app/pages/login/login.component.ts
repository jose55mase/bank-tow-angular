import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { AuthService } from "src/app/core/services/auth.service";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "login-page",
  templateUrl: "login.component.html"
})
export class LoginPage{
    constructor(private router: Router,
    private autService: AuthService, private userService: UserService,
  ){}

  objet = new Object;
  public email: string = "";
  public password: string = ""; 
  public loginDisable: boolean = false;

 

  onLoginSesion(){
    let currency = new Intl.NumberFormat('USD',{
      style: 'currency',
      minimumFractionDigits: 2,
      currency: "USD"
    })
    this.loginDisable = true;
    this.autService.login(this.email, this.password).subscribe(
      
      response => {
        const data = JSON.parse(atob(response.access_token.split('.')[1])) 
        this.objet = {
          id: data.id,
          authorities: data.authorities,
          username: "",
          email: data.email,
          fistName: data.fistName,
          lastName: data.lastName,
          city: "",
          country: "",
          postal: "",
          aboutme: "",
          moneyclean: data.moneyclean,
          money:  currency.format(data.moneyclean)
        }
        localStorage.setItem("profile", JSON.stringify(this.objet))
        sessionStorage.setItem("token", response.access_token)
        this.router.navigate(['/profile'])
        //this.notificationService.alert("", textglobal.log_user_success, 'success');
        this.loginDisable = false;  
      },
      error => {
        console.log("Error show---> ",error)
        //this.notificationService.alert(emojisglobal.error, textglobal.log_user_error, 'error');
        this.loginDisable = false;
      }
    )
  }
}
