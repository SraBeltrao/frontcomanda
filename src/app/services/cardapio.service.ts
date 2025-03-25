import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { CardapioComponent } from '../components/cardapio/cardapio.component';

@Injectable({
  providedIn: 'root',
})
export class CardapioService {
  presentingElement: any;
  private apiUrl = `${environment.apiUrl}/api/v1/cardapios/`;

  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) {
    this.presentingElement = document.querySelector('.ion-page')?.childNodes[0];
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  get(comandaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${comandaId}`, {
      withCredentials: true,
    });
  }

  create(mesa: any): Observable<any> {
    return this.http.post(this.apiUrl, mesa, { withCredentials: true });
  }

  async abrirCardapio(onClose = (data: any) => {}) {
    const modal = await this.modalController.create({
      component: CardapioComponent,
      showBackdrop: true,
      canDismiss: true,
      presentingElement: this.presentingElement,
    });
  
    await modal.present();
  
    // Espera o modal ser fechado e captura os dados retornados
    const { data, role } = await modal.onDidDismiss();
  
    if (data && role === 'confirm') {
      onClose(data); // Executa o callback quando o modal é fechado com sucesso
    }
  }
  
}
