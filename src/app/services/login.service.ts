import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular/standalone";
import { LoginComponent } from "../components/login/login.component";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  presentingElement: any;
  constructor(private modalController: ModalController) {
    this.presentingElement = document.querySelector(".ion-page")?.childNodes[0];
  }

  async openLogin(onClose = ()=>{}) {
    const modal = await this.modalController.create({
      component: LoginComponent,
      showBackdrop: true,
      canDismiss: true,
      presentingElement: this.presentingElement,
      cssClass: "short-modal",
    });

    await modal.present();

     // Executa algo quando o modal for fechado
    const { data, role } = await modal.onDidDismiss();
    onClose();
  }
}
