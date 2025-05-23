import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import Chart from "chart.js";
import { ChangeDataService } from "src/app/core/services/changeData.service";
import { NotificationService } from "src/app/core/services/Notification.service";
import { UserService } from "src/app/core/services/user.service";
import { textglobal } from "src/app/core/text-global";
import Swal from "sweetalert2";

@Component({
  selector: "app-landingpage",
  templateUrl: "landingpage.component.html"
})
export class LandingpageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  dataProfile;
  dataUser;

  constructor(
    private userService : UserService, private notificationService : NotificationService,
    private changeDataService : ChangeDataService, private router: Router) {}

  ngOnInit() {

    this.dataProfile = JSON.parse(localStorage.getItem("profile"))
    this.getUserData();

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");

    var canvas: any = document.getElementById("chartBig");
    var ctx = canvas.getContext("2d");
    var gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    gradientFill.addColorStop(0, "rgba(228, 76, 196, 0.0)");
    gradientFill.addColorStop(1, "rgba(228, 76, 196, 0.14)");
    var chartBig = new Chart(ctx, {
      type: "line",
      responsive: true,
      data: {
        labels: [
          "JUN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        ],
        datasets: [
          {
            label: "Data",
            fill: true,
            backgroundColor: gradientFill,
            borderColor: "#e44cc4",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#e44cc4",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#be55ed",
            //pointHoverBorderColor:'rgba(35,46,55,1)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [80, 160, 200, 160, 250, 280, 220, 190, 200, 250, 290, 320]
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },

        tooltips: {
          backgroundColor: "#fff",
          titleFontColor: "#ccc",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest"
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(0,0,0,0.0)",
                zeroLineColor: "transparent"
              },
              ticks: {
                display: false,
                suggestedMin: 0,
                suggestedMax: 350,
                padding: 20,
                fontColor: "#9a9a9a"
              }
            }
          ],

          xAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(0,0,0,0)",
                zeroLineColor: "transparent"
              },
              ticks: {
                padding: 20,
                fontColor: "#9a9a9a"
              }
            }
          ]
        }
      }
    });
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


  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }
}
