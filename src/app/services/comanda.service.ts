import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalController } from "@ionic/angular/standalone";
import { ComandaComponent } from '../components/comanda/comanda.component';
import { ReciboComponent } from '../components/recibo/recibo.component';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  presentingElement: any;
  private apiUrl = `${environment.apiUrl}/api/v1/comandas/`;

  constructor(private http: HttpClient, private modalController: ModalController) {
    this.presentingElement = document.querySelector(".ion-page")?.childNodes[0];
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  get(comandaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${comandaId}`, { withCredentials: true });
  }

  create(mesa: any): Observable<any> {
    return this.http.post(this.apiUrl, mesa,{ withCredentials: true });
  }

  delete(comandaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${comandaId}`, { withCredentials: true });
  }

  update(comandaId:number, mesa: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${comandaId}`, mesa,{ withCredentials: true });
  }

  async abrirComanda(idComanda: number, onClose = ()=>{}){
    const modal = await this.modalController.create({
          component: ComandaComponent,
          showBackdrop: true,
          canDismiss: true,
          presentingElement: this.presentingElement,
          componentProps: { idComanda }
        });
    
        await modal.present();
    
         // Executa algo quando o modal for fechado
        const { data, role } = await modal.onDidDismiss();
  
    
        //if (role === 'confirm') {
          onClose(); // callback
        //}
  }

  async abrirRecibo(idComanda: number, onClose = ()=>{}){
    const modal = await this.modalController.create({
          component: ReciboComponent,
          showBackdrop: true,
          canDismiss: true,
          presentingElement: this.presentingElement,
          componentProps: { idComanda }
        });
    
        await modal.present();
    
         // Executa algo quando o modal for fechado
        const { data, role } = await modal.onDidDismiss();
  
    
        //if (role === 'confirm') {
          onClose(); // callback
        //}
  }
}
