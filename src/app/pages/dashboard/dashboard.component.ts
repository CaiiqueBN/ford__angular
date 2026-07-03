import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { CarTableComponent } from "../../components/car-table/car-table.component";
import { DashboardService } from '../../services/dashboard.service';
import { Veiculo } from '../../models/car';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, CarTableComponent, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);
  router = inject(Router);

  veiculos: Veiculo[] = [];
  veiculoSelecionado: any = null;
  dadosTabela: any = null;
  vinSelecionado: string = '';

  private vinMap: { [key: number]: string } = {
    1: "2FRHDUYS2Y63NHD22454",
    2: "2RFAASDY54E4HDU34874",
    3: "2FRHDUYS2Y63NHD22455",
    4: "2RFAASDY54E4HDU34875"
  };

  ngOnInit() {
    this.dashboardService.getVeiculos().subscribe({
      next: (resposta) => {
        this.veiculos = resposta.vehicles;
      },
      error: (err) => console.error('Erro ao buscar veículos', err)
    });
  }

  onVeiculoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const veiculoId = Number(selectElement.value);

    this.veiculoSelecionado = this.veiculos.find(v => v.id === veiculoId);
    
    if (this.veiculoSelecionado) {
      this.vinSelecionado = this.vinMap[veiculoId] || '';
      this.buscarDadosDoVin(this.vinSelecionado);
    } else {
      this.vinSelecionado = '';
      this.dadosTabela = null;
    }
  }

  onBuscarVinManual(vinDigitado: string) {
    this.vinSelecionado = vinDigitado;
    const idEncontrado = Object.keys(this.vinMap).find(key => this.vinMap[Number(key)] === vinDigitado);

    if (idEncontrado) {
      this.veiculoSelecionado = this.veiculos.find(v => v.id === Number(idEncontrado));
    } else {
      this.veiculoSelecionado = null;
    }

    this.buscarDadosDoVin(vinDigitado);
  }

  private buscarDadosDoVin(vin: string) {
    if (vin) {
      this.dashboardService.getVinInfos(vin).subscribe({
        next: (dados) => {
          this.dadosTabela = dados;
        },
        error: (err) => {
          console.error('VIN inválido ou não encontrado na API', err);
          this.dadosTabela = null;
        }
      });
    } else {
      this.dadosTabela = null;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate([""]);
  }
}