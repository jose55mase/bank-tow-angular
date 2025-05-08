import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/Notification.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { UserService } from 'src/app/core/services/user.service';
import { textglobal } from 'src/app/core/text-global';
import Swal from'sweetalert2';

@Component({
  selector: 'app-files_admin',
  templateUrl: './files_admin.component.html',
  styleUrls: ['./files_admin.component.css']
})
export class FilesAdminComponent implements OnInit {

  private userSelected;
  public isCollapsed = true;
  private imageSelected: File;
  public  imagePreviwPicture;
  public  imagePreviwDocumenOne;
  public  imagePreviwDocumentwo;
  public  data;
  public  image;
  public  userCurren;
  public statusDocument;
  private responseUserData : any


  constructor(private sanitizer: DomSanitizer,private userService: UserService,private transactionService: TransactionService
    , private router:Router, private notificationService : NotificationService) { }

  ngOnInit() {
    this.getUserData();
    this.image =  "397e71c3-34ef-4a40-8fa4-fc2ad59971f5_killfeed.jpg";
  }

  public selectedPicture(event){
    const file = event.target.files[0]
    this.extraerBase64(file).then((imagen: any) => {
      this.imagePreviwPicture = imagen.base;
    })
    this.imageSelected = file;
  }

  public selectedDocumentOne(event){
    const file = event.target.files[0]
    this.extraerBase64(file).then((imagen: any) => {
      this.imagePreviwDocumenOne = imagen.base;
    })
    this.imageSelected = file;
  }

  public selectedDocumentTwo(event){
    const file = event.target.files[0]
    this.extraerBase64(file).then((imagen: any) => {
      this.imagePreviwDocumentwo = imagen.base;
    })
    this.imageSelected = file;
  }

  

  public getUserData() {
    const userData =  JSON.parse(localStorage.getItem("profile"))
    this.userCurren = userData;
    const userDataSelected =  JSON.parse(localStorage.getItem("selectedUser"))
    this.userService.getUser(userDataSelected.email).subscribe(
      response => {
        this.data = response
        this.userSelected = response
        console.log("----------->" , this.data)
        this.statusDocument = JSON.parse(response.documentsAprov)  
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
          this.notificationService.alert("", "Error en el sistema", 'error');
        }
      }
    )
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })
  
  public async upluadFile(){
    await this.userService.subirFoto(this.imageSelected,this.data.id).subscribe(
      response => {
        
        this.responseUserData = response;
        setTimeout(()=>{
          console.log( )
          this.notificationService.alert("",this.responseUserData.body.mensaje, 'success');
          this.data.foto = this.responseUserData.body.cliente.foto
        }, 1000);
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
          this.notificationService.alert("", "Error en el sistema", 'error');
        }
      }
    )
  }

  upluadFileDocumentFromt(){
    this.userService.subirdocumentFromt(this.imageSelected,this.data.id).subscribe(
      response => {
        this.responseUserData = response;
        setTimeout(()=>{
          console.log( )
          this.notificationService.alert("",this.responseUserData.body.mensaje, 'success');
          this.data.documentFrom = this.responseUserData.body.cliente.documentFrom
        }, 1000);
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
          this.notificationService.alert("", "Error en el sistema", 'error');
        }
      }
    )
  }

  upluadFileDocumentback(){
    this.userService.subirdocumentBack(this.imageSelected,this.data.id).subscribe(
      response => {
        this.responseUserData = response;
        setTimeout(()=>{
          console.log( )
          this.notificationService.alert("",this.responseUserData.body.mensaje, 'success');
          this.data.documentBack = this.responseUserData.body.cliente.documentBack
        }, 1000);
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
          this.notificationService.alert("", "Error en el sistema", 'error');
        }
      }
    )
  }

  public documentAprove(namedocument: string){
    
    let json = JSON.parse(this.userSelected.documentsAprov)
    
    if (namedocument=="foto"){
      json.foto = true
    }else if(namedocument=="back"){
      json.back = true
    }else if(namedocument=="fromt"){
      json.fromt = true
    }
    this.statusDocument = json;
    this.userSelected.documentsAprov = JSON.stringify(json)

    this.userService.update(this.userSelected).subscribe(
      response => {
        console.log(response.responseCode)
        Swal.fire({
          title: "Éxito",
          text: "Archivo aprovado",
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

  public documentRefuse(namedocument: string){
    
    let json = JSON.parse(this.userSelected.documentsAprov)
    
    if (namedocument=="foto"){
      json.foto = 'refused'
    }else if(namedocument=="back"){
      json.back = 'refused'
    }else if(namedocument=="fromt"){
      json.fromt = 'refused'
    }
    this.statusDocument = json;
    this.userSelected.documentsAprov = JSON.stringify(json)

    this.userService.update(this.userSelected).subscribe(
      response => {
        console.log(response.responseCode)
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
