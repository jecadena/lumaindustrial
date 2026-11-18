import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private router = inject(Router);
  anioActual: number = new Date().getFullYear();

  navegarYSubir(url: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.router.navigateByUrl(url).then(() => {
      // Se ejecuta exactamente cuando la nueva página ya cargó
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const container = document.querySelector('main') || document.querySelector('.main-wrapper');
      if (container) {
        container.scrollTop = 0;
      }
    });
  }

  irArriba(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}