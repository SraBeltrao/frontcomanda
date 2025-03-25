import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonContent,
  ModalController,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonItem, IonList, IonLabel, IonListHeader, IonChip } from '@ionic/angular/standalone';
import { CardapioService } from 'src/app/services/cardapio.service';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss'],
  standalone: true,
  imports: [IonChip, IonListHeader, IonLabel, IonList, 
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
  ],
})
export class CardapioComponent implements OnInit {
  cardapio: any[] = [];
  constructor(
    private cardapioService: CardapioService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadCardapio();
  }

  loadCardapio() {
    this.cardapioService.getAll().subscribe({
      next: (res) => {
     
        const dadosAgrupados = res.reduce((acc:any, item:any) => {
          const categoriaExistente = acc.find((grupo:any) => grupo.categoria === item.categoria);
        
          if (categoriaExistente) {
            categoriaExistente.itens.push(item);
          } else {
            acc.push({
              categoria: item.categoria,
              itens: [item]
            });
          }
        
          return acc;
        }, []);

        this.cardapio = dadosAgrupados;
      },
      error: (err) => {
        this.showError(`Não foi possível conectar. ${err.statusText}.`);
      },
    });
  }

  async showError(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  cancel() {
    this.modalController.dismiss();
  }

  adicionarItem(item:any){
    this.modalController.dismiss(item, 'confirm');
  }
}
