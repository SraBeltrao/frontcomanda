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
  IonChip,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonIcon, IonItemDivider, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, timer, hourglass, alertCircle, checkmark, arrowUndo, checkmarkDone, checkmarkCircle, close, warning } from 'ionicons/icons';
import { CardapioService } from 'src/app/services/cardapio.service';
import { ComandaService } from 'src/app/services/comanda.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss'],
  standalone: true,
  imports: [IonText, IonItemDivider, 
    IonChip,
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
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonIcon
  ],
})
export class ComandaComponent implements OnInit {
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
     addIcons({checkmarkCircle,arrowUndo,alertCircle,timer,checkmark,checkmarkDone,hourglass,close,trash,warning});
  }

  ngOnInit() {
    this.loadComanda();
  }

  cancel() {
    this.modalController.dismiss();
  }

  adicionarItem() {
    this.cardapioService.abrirCardapio((data) => {
      const pedido = {
        comanda_id: this.idComanda,
        cardapio_id: data.id,
        quantidade: 1,
        observacao: '',
        status: 'Pedido',
      };
      this.pedidoService.create(pedido).subscribe({
        next: (response) => {
          this.loadComanda();
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
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

  removerItem(pedidoId:number){
    this.pedidoService.delete(pedidoId).subscribe({
      next: (response) => {
        this.loadComanda();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  cancelarItem(pedidoId:number){
    this.pedidoService.update(pedidoId, {status: 'Cancelado'}).subscribe({
      next: (response) => {
        this.loadComanda();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  entregarItem(pedidoId:number){
    this.pedidoService.update(pedidoId, {status: 'Entregue'}).subscribe({
      next: (response) => {
        this.loadComanda();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  desfazerEntregaItem(pedidoId:number){
    this.pedidoService.update(pedidoId, {status: 'Pedido'}).subscribe({
      next: (response) => {
        this.loadComanda();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

 async fecharComanda(){
    const alert = await this.alertController.create({
      header: 'Fechar Comanda',
      message: `Você deseja criar uma nova comanda ${this.idComanda} para a mesa ${this.comanda.mesa_id}? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Encerrar a Comanda',
          role: 'confirm',
          handler: () => {
            this.comandaService.update(this.idComanda, {aberta: 0}).subscribe({
              next: async (response) => {
                this.modalController.dismiss();
                const alert = await this.alertController.create({
                  header: 'Comanda Fechada Com Sucesso',
                  message: `A comanda ${this.idComanda} foi encerrada com sucesso. Você pode veirficar os detalhes da comanda na aba Comandas.`,
                  buttons: ['OK']
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

  async removerComanda(){
    this.comandaService.delete(this.idComanda).subscribe({
      next: (response) => {
        this.modalController.dismiss();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  isComandaEcenrravel():boolean{
    let retorno: boolean = true;

    this.comanda.pedidos?.forEach((pedido:any) => {
      if(!(pedido.status == "Cancelado" || pedido.status == "Entregue")){
        retorno = false;
      }
    });

    return retorno;
  }
}
