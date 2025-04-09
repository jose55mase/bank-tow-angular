import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";

@Component({
  selector: "login-page",
  templateUrl: "login.component.html"
})
export class LoginPage{

  constructor(private router: Router){}

  onLoginSesion(){
    this.router.navigate(['/users'])
  }
}
