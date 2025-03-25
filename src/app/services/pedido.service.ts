import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  presentingElement: any;
  private apiUrl = `${environment.apiUrl}/api/v1/pedidos/`;

  constructor(private http: HttpClient) {
    this.presentingElement = document.querySelector('.ion-page')?.childNodes[0];
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  get(pedidoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${pedidoId}`, {
      withCredentials: true,
    });
  }

  getAllCozinha(): Observable<any> {
    return this.http.get(`${this.apiUrl}?cozinha=1`, { withCredentials: true });
  }


  create(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido, { withCredentials: true });
  }

  update(pedidoId: number, pedido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${pedidoId}`, pedido, {
      withCredentials: true,
    });
  }

  delete(pedidoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${pedidoId}`, {
      withCredentials: true,
    });
  }
}
