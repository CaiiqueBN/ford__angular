import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient)

  getVeiculos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>("http://localhost:3001/vehicles")
  }

  getVinInfos() {

  }

}
