import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CarTableComponent } from "../../components/car-table/car-table.component";
import { DashboardService } from '../../services/dashboard.service';
import { Veiculo } from '../../models/car';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, CarTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);

  veiculos: Veiculo[] = [];
  veiculoSelecionado: any = null; // Usado any temporariamente por conta do 'volumetotal' minúsculo da API
  dadosTabela: any = null;
  vinSelecionado: string = '';

  // Mapeamento estático dos VINs que o seu backend espera receber
  private vinMap: { [key: number]: string } = {
    1: "2FRHDUYS2Y63NHD22454", // Ranger
    2: "2RFAASDY54E4HDU34874", // Mustang
    3: "2FRHDUYS2Y63NHD22455", // Territory
    4: "2RFAASDY54E4HDU34875"  // Bronco Sport
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

    // Encontra o veículo selecionado na lista do componente
    this.veiculoSelecionado = this.veiculos.find(v => v.id === veiculoId);

    if (this.veiculoSelecionado) {
      // Descobre o VIN usando o ID do veículo mapeado
      this.vinSelecionado = this.vinMap[veiculoId] || '';

      // Busca os dados da tabela passando o VIN correto
      this.dashboardService.getVinInfos(this.vinSelecionado).subscribe({
        next: (dados) => {
          this.dadosTabela = dados;
        },
        error: (err) => {
          console.error(err);
          this.dadosTabela = null;
        }
      });
    } else {
      this.dadosTabela = null;
      this.vinSelecionado = '';
    }
  }
}