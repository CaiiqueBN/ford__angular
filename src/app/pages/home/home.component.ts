import { Component } from '@angular/core';
import { WelcomeComponent } from '../../components/welcome/welcome.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [WelcomeComponent, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
