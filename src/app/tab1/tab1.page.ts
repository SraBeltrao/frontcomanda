import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonCol,
  IonRow,
  IonChip, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { MesaService } from '../services/mesa.service';
import { LoginService } from '../services/login.service';
import { addIcons } from 'ionicons';
import { people, pin, close, browsersOutline, browsers } from 'ionicons/icons';
import { ComandaService } from '../services/comanda.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, 
    IonChip,
    IonHeader,
    IonLabel,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule,
    IonGrid,
    IonCol,
    IonRow,
  ],
})
export class Tab1Page {
  mesas: any[] = [];

  constructor(
    private alertController: AlertController,
    private mesaService: MesaService,
    private loginService: LoginService,
    private comandaService: ComandaService,
    private router: Router
  ) {
    addIcons({ people, browsersOutline, browsers, pin, close });
  }

  ngOnInit() {
    this.loadMesas();

    setInterval(() => {
      this.loadMesas();
    }, 60000);
  }

  loadMesas() {
    this.mesaService.getAll().subscribe({
      next: (res) => {
        this.mesas = res;
      },
      error: (err) => {
        if (err.status == 403) {
          this.loginService.openLogin(() => {
            this.loadMesas();
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

  async abrirComanda(mesa: any) {
    if (mesa.disponivel) {
      const alert = await this.alertController.create({
        header: 'Nova Comanda',
        message: `Você deseja criar uma nova comanda para a mesa ${mesa.numero}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.loadMesas();
            },
          },
          {
            text: 'Criar Nova Comanda',
            role: 'confirm',
            handler: () => {
              this.comandaService
                .create({ mesa_id: mesa.id, total: 0.0 })
                .subscribe({
                  next: (response) => {
                    this.comandaService.abrirComanda(response.success, ()=>{
                      this.loadMesas();
                    })
                    this.loadMesas();
                  },
                  error: (error) => {
                    if ((error.status = 403)) {
                      this.loginService.openLogin(() => {
                        this.showError(
                          'Por favor, tente criar a comanda novamente.'
                        );
                      });
                    } else {
                      this.showError('Não foi possível criar uma nova comanda');
                    }
                  },
                });
            },
          },
        ],
      });
      await alert.present();
    }else{
      this.comandaService.abrirComanda(mesa.comanda.id, ()=>{
        this.loadMesas();
      })
    }
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.loadMesas();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }
}
