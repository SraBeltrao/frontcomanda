import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth/`;

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  login(login: string, senha: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiUrl, {
      login,
      senha,
    },{ withCredentials: true });
  }

  private async init() {
    await this.storage.create();
  }

  async storeToken(token: string): Promise<void> {
    await this.storage.set("access_token", token);
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get("access_token");
  }

  async removeToken(): Promise<void> {
    await this.storage.remove("access_token");
  }
}
