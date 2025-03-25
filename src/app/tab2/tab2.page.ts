import { Component } from '@angular/core';
import {
  AlertController,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonList,
  IonItem,
  IonNote, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { ComandaService } from '../services/comanda.service';
import { LoginService } from '../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, 
    FormsModule,
    CommonModule,
    IonItem,
    IonList,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonNote,
  ],
})
export class Tab2Page {
  comandas: any[] = [];
  constructor(
    private alertController: AlertController,
    private comandaService: ComandaService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loadComandas();

    setInterval(this.loadComandas, 10000);
  }

  loadComandas() {
    this.comandaService.getAll().subscribe({
      next: (res) => {
        this.comandas = res;
      },
      error: (err) => {
        if (err.status == 403) {
          this.loginService.openLogin(() => {
            this.loadComandas();
          });
        } else {
          this.showError(`Não foi possível conectar. ${err.statusText}.`);
        }
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

  async abrirComanda(comanda: any) {
    if (comanda.aberta) {
      this.comandaService.abrirComanda(comanda.id, () => {
        this.loadComandas();
      });
    } else {
      this.comandaService.abrirRecibo(comanda.id, () => {
        this.loadComandas();
      });
    }
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.loadComandas();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }
}
