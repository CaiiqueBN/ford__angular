import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private url = "http://localhost:3001";

  // Retorna o objeto contendo o array de veículos
  getVeiculos(): Observable<{ vehicles: Veiculo[] }> {
    return this.http.get<{ vehicles: Veiculo[] }>(`${this.url}/vehicles`);
  }

  // Faz o POST para buscar os detalhes do VIN
  getVinInfos(vin: string): Observable<any> {
    return this.http.post<any>(`${this.url}/vehicleData`, { vin });
  }
}