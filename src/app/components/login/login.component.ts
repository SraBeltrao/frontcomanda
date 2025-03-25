import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  AlertController,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonInputPasswordToggle,
  IonRow,
  ModalController,
} from "@ionic/angular/standalone";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonInputPasswordToggle,
    IonButton,
  ],
})
export class LoginComponent implements OnInit {
  email?: string;
  password?: string;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  doLogin() {
    if (this.email?.length && this.password?.length) {
      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          this.modalController.dismiss();
          this.authService.storeToken(res.access_token).then(() => {
            //this.router.navigate(["fit", "jobs"]);
          });
        },
        error: (err) => {
          this.showError(`Não foi possível conectar. ${err.error.message}.`);
        },
      });
    }
  }

  async showError(mensagem: string) {
    const alert = await this.alertController.create({
      header: "Erro",
      message: mensagem,
      buttons: ["OK"],
    });
    await alert.present();
  }

  checkFilled() {
    return this.email?.length && this.password?.length;
  }
}
