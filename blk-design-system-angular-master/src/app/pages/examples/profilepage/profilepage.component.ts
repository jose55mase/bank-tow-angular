import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html"
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  checkoutForm;
  data;
  currency = new Intl.NumberFormat('USD',{
    style: 'currency',
    minimumFractionDigits: 2,
    currency: "USD"
  })
  constructor(private userService: UserService) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getUserData()
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  public getUserData() {
    const userData =  JSON.parse(localStorage.getItem("profile"))
    this.userService.getUser(userData.email).subscribe(
      response => {
        this.data = response
        console.log("-------------> ", response)
        //this.loadData(response)
      },
      error => {
        console.log("Error --> ", error)
      }
    )
  }
}
