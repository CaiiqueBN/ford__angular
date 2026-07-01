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
  veiculoSelecionado: any = null;
  dadosTabela: any = null;
  vinSelecionado: string = '';

  // Mapeamento estático dos VINs
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

  // Ação 1: Quando escolhe pelo <select>
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

  // Ação 2: Quando digita direto no <input> da Tabela
  onBuscarVinManual(vinDigitado: string) {
    this.vinSelecionado = vinDigitado;

    // Procura de qual ID é esse VIN no nosso mapeamento
    const idEncontrado = Object.keys(this.vinMap).find(key => this.vinMap[Number(key)] === vinDigitado);

    if (idEncontrado) {
      // Se achou a qual carro pertence, atualiza a imagem e os cards
      this.veiculoSelecionado = this.veiculos.find(v => v.id === Number(idEncontrado));
    } else {
      // Se digitou um VIN que não tá mapeado nos 4 carros principais, limpa a imagem/cards
      this.veiculoSelecionado = null;
    }

    // Busca os dados da tabela (independente de ter achado o carro ou não)
    this.buscarDadosDoVin(vinDigitado);
  }

  // Ação Central: Faz a requisição na API
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
}