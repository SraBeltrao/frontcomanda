import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AlertController,
  IonButton,
  IonContent,
  ModalController,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonItem,
  IonList,
  IonLabel,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trash,
  timer,
  hourglass,
  alertCircle,
  checkmark,
  arrowUndo,
  checkmarkDone,
  checkmarkCircle,
  close,
} from 'ionicons/icons';
import { CardapioService } from 'src/app/services/cardapio.service';
import { ComandaService } from 'src/app/services/comanda.service';
import { PedidoService } from 'src/app/services/pedido.service';
@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonLabel,
    IonList,
    IonToolbar,
    IonHeader,
    IonContent,
    CommonModule,
    FormsModule,
    IonContent,
    IonButtons,
    IonButton,
    IonTitle,
    IonItem,
    IonIcon
  ],
})
export class ReciboComponent implements OnInit {
  @Input('idComanda')
  idComanda: number = 0;

  comanda: any = {};
  constructor(
    private modalController: ModalController,
    private cardapioService: CardapioService,
    private comandaService: ComandaService,
    private pedidoService: PedidoService,
    private alertController: AlertController
  ) {
    addIcons({
      checkmarkCircle,
      alertCircle,
      timer,
      checkmark,
      checkmarkDone,
      arrowUndo,
      hourglass,
      close,
      trash,
    });
  }

  ngOnInit() {
    this.loadComanda();
  }

  fechar() {
    this.modalController.dismiss();
  }

  loadComanda() {
    this.comandaService.get(this.idComanda).subscribe({
      next: (response) => {
        this.comanda = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  async pagarComanda() {
    const alert = await this.alertController.create({
      header: 'Confirmar Pagamento de Comanda',
      message: `Você deseja confirmar o pagamento da comanda ${this.idComanda}, referente a mesa ${this.comanda.mesa_id}? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar Pagamento',
          role: 'confirm',
          handler: () => {
            this.comandaService.update(this.idComanda, { pago: 1 }).subscribe({
              next: async (response) => {
                this.loadComanda();
                const alert = await this.alertController.create({
                  header: 'Comanda Paga Com Sucesso',
                  message: `A comanda ${this.idComanda} teve seu pagamento confirmado.`,
                  buttons: ['OK'],
                });
                await alert.present();
              },
              error: (error) => {
                console.error(error);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
