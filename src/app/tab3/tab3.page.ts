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
  IonNote,
  IonButton,
  IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkDone, warning } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, 
    IonButton,
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
    IonIcon,
  ],
})
export class Tab3Page {
  pedidos: any[] = [];
  constructor(
    private pedidoService: PedidoService,
    private alertController: AlertController
  ) {
     addIcons({
          warning,
          alertCircle,
          checkmarkDone,
        });
  }

  ngOnInit() {
    this.loadPedidos();

    setInterval(() => {
      this.loadPedidos();
    }, 10000);
  }

  loadPedidos() {
    this.pedidoService.getAllCozinha().subscribe({
      next: (res) => {
        const ordemStatus = ['Pedido', 'Preparando', 'Pronto'];
        const dadosAgrupados = res.reduce((acc: any, item: any) => {
          const statusExistente = acc.find(
            (grupo: any) => grupo.status === item.status
          );

          if (statusExistente) {
            statusExistente.pedidos.push(item);
          } else {
            acc.push({
              status: item.status,
              pedidos: [item],
            });
          }

          return acc;
        }, []);

        this.pedidos = dadosAgrupados.sort((a: any, b: any) => {
          const indexA = ordemStatus.indexOf(a.status);
          const indexB = ordemStatus.indexOf(b.status);

          // Se o status não estiver na lista, coloca no final
          return (
            (indexA === -1 ? ordemStatus.length : indexA) -
            (indexB === -1 ? ordemStatus.length : indexB)
          );
        });
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

  iniciarPreparo(pedidoId: number) {
    this.pedidoService.update(pedidoId, { status: 'Preparando' }).subscribe({
      next: (response) => {
        this.loadPedidos();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  finalizarPreparo(pedido: any) {
    this.pedidoService.update(pedido.id, { status: 'Pronto' }).subscribe({
      next: (response) => {
        this.loadPedidos();
        this.enviarNotificacao('Pedido Pronto!', `${pedido.cardapio.nome} está pronto para ser entregue na mesa ${pedido.mesa}.`);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  enviarNotificacao(titulo: string, mensagem: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(titulo, {
          body: mensagem,
          icon: 'assets/icon.png',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(titulo, {
              body: mensagem,
              icon: 'assets/icon.png',
            });
          }
        });
      }
    }
  }

  tempoPassado(date: any) {
    const now: any = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    //const seconds = diffInSeconds % 60; // Segundos

    return `${hours}h ${minutes}m`;// ${seconds}s`;
  }

  atualizaTempo(datetime: string) {
    const timeDate = new Date(datetime);
    return this.tempoPassado(timeDate);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.loadPedidos();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }
}
