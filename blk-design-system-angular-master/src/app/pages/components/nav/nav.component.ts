import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
  Inject
} from "@angular/core";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { AuthService } from "src/app/core/services/auth.service";
import { ChangeDataService } from "src/app/core/services/changeData.service";
import { NotificationService } from "src/app/core/services/Notification.service";
import { UserService } from "src/app/core/services/user.service";
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { emojisglobal, textglobal } from "src/app/core/text-global";

@Component({
  selector: "nav-component",
  templateUrl: "nav.component.html"
})
export class NavComponent implements OnInit, OnDestroy {

  isCollapsed = true;
  longin: Boolean = false;
  objet = new Object;
  public email: string = "";
  public password: string = ""; 
  public loginDisable: boolean = false;

  constructor(
    private changeDataService: ChangeDataService,
    private notificationService : NotificationService,
    private autService: AuthService, private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) document
  ) {}

  scrollToDownload(element: any) {
  }
  ngOnInit() {
    this.longin = sessionStorage.getItem("btn-login") == "true" ? true : false;
    this.changeDataService.getLoginEvenEmitter.subscribe((response) => {
      this.longin = response;
    })
  }
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
        this.router.navigate(['/landing'])
        this.notificationService.alert("", textglobal.log_user_success, 'success');
        this.loginDisable = false;
        this.changeDataService.getLoginEvenEmitter.emit(true)
        sessionStorage.setItem("btn-login","true")
        
      },
      error => {
        this.notificationService.alert(emojisglobal.error, textglobal.log_user_error, 'error');
        this.loginDisable = false;
      }
    )
  }

  onLongOut(){
    sessionStorage.clear()
    localStorage.clear()
    this.router.navigate(['/home'])
    this.changeDataService.getLoginEvenEmitter.emit(false)
    sessionStorage.setItem("btn-login","false")
  }

  onHelpRouter(){
    this.router.navigate(['/help'])
  }
  onHomeRouter(){
    this.router.navigate(['/home'])
  }
  onRegisterRouter(){
    console.log("---------> registe")
    this.router.navigate(['/register'])
  }

  onCommentsRoute(){
    this.router.navigate(['/comments'])
  }

  validationSesionNav(){
    const token = sessionStorage.getItem("token")
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
}
