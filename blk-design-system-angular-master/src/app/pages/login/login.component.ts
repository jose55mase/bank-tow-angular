import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { AuthService } from "src/app/core/services/auth.service";
import { ChangeDataService } from "src/app/core/services/changeData.service";
import { NotificationService } from "src/app/core/services/Notification.service";
import { UserService } from "src/app/core/services/user.service";
import { emojisglobal, textglobal } from "src/app/core/text-global";

@Component({
  selector: "login-page",
  templateUrl: "login.component.html"
})
export class LoginPage{
    constructor(private router: Router,
      private changeDataService: ChangeDataService,
      private notificationService : NotificationService,
      private autService: AuthService, private userService: UserService,
  ){}

  objet = new Object;
  public email: string = "";
  public password: string = ""; 
  public loginDisable: boolean = false;

 

  
}
