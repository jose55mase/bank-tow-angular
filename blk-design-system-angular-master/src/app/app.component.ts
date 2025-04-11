
import noUiSlider from "nouislider";
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
  Inject
} from "@angular/core";
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { ChangeDataService } from "./core/services/changeData.service";
import { emojisglobal, textglobal } from "./core/text-global";
import { NotificationService } from "./core/services/Notification.service";
import { AuthService } from "./core/services/auth.service";
import { UserService } from "./core/services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
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
    public location: Location,
    @Inject(DOCUMENT) document
  ) {}
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.remove("navbar-transparent");
        element.classList.add("bg-danger");
      }
    } else {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.add("navbar-transparent");
        element.classList.remove("bg-danger");
      }
    }
  }
  ngOnInit() {
    this.longin = sessionStorage.getItem("btn-login") == "true" ? true : false;
    this.changeDataService.getLoginEvenEmitter.subscribe((response) => {
      this.longin = response;
    })
    this.onWindowScroll(event);
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    var slider = document.getElementById("sliderRegular");

    noUiSlider.create(slider, {
      start: 40,
      connect: false,
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById("sliderDouble");

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });

    
  }

  
}

