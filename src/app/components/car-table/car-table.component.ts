import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-table.component.html',
  styleUrl: './car-table.component.css'
})
export class CarTableComponent {
  @Input() dados: any = null;
  @Input() vin: string = '';
  
  @Output() buscarVin = new EventEmitter<string>();

  onVinSubmit(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.trim();
    this.buscarVin.emit(valor);
  }
}