import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface MarcaHeader {
  id: string;
  name: string;
  cat: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isWhiteHeader = false;
  isDropdownOpen = false;

  // Control para menú móvil
  isMobileOpen = false;
  get isMobileMenuOpen(): boolean {
    return this.isMobileOpen;
  }
  set isMobileMenuOpen(val: boolean) {
    this.isMobileOpen = val;
  }

  isMobileProductsOpen = false;

  private routerSub!: Subscription;

  // Catálogo completo de las 14 marcas oficiales en MAYÚSCULAS
  marcas: MarcaHeader[] = [
    { id: 'airwork', name: 'AIRWORK', cat: 'NEUMÁTICA Y ELECTRONEUMÁTICA', icon: 'bi-wind' },
    { id: 'tecnofluid', name: 'TECNOFLUID', cat: 'OLEODINÁMICA & ALTA PRESIÓN', icon: 'bi-gear-wide' },
    { id: 'aplisens', name: 'APLISENS', cat: 'INSTRUMENTACIÓN DE PROCESO', icon: 'bi-speedometer' },
    { id: 'tork', name: 'SMS TORK', cat: 'CONTROL DE FLUIDOS & VÁLVULAS', icon: 'bi-droplet' },
    { id: 'genebre', name: 'GENEBRE', cat: 'VÁLVULAS INDUSTRIALES', icon: 'bi-diagram-3' },
    { id: 'rex', name: 'REX', cat: 'VÁLVULAS & CONECTORES', icon: 'bi-plug' },
    { id: 'sun', name: 'SUN', cat: 'VÁLVULAS DE PROCESO & VAPOR', icon: 'bi-sun' },
    { id: 'xcpc', name: 'XCPC', cat: 'CILINDROS & ELECTRONEUMÁTICA', icon: 'bi-cpu' },
    { id: 'fluidac', name: 'FLUIDAC', cat: 'NEUMÁTICA & TRATAMIENTO FRL', icon: 'bi-water' },
    { id: 'trimod', name: 'TRIMOD BESTA', cat: 'CONTROL & SWITCHES DE NIVEL', icon: 'bi-toggles' },
    { id: 'winters', name: 'WINTERS', cat: 'MANÓMETROS Y TERMÓMETROS', icon: 'bi-stopwatch' },
    { id: 'dci-dynamics', name: 'DCI DYNAMIC', cat: 'MANÓMETROS Y TERMÓMETROS', icon: 'bi-hdd-network' },
    { id: 'conek', name: 'CONEK', cat: 'CONECTORES NEUMÁTICOS & RACORES', icon: 'bi-bezier2' },
    { id: 'airfit', name: 'AIRFIT', cat: 'MANGUERAS DE POLIURETANO & ACOPLES', icon: 'bi-slash-circle' }
  ];

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkWhiteHeader(this.router.url);
    this.onWindowScroll();

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkWhiteHeader(event.urlAfterRedirects || event.url);
        this.onWindowScroll();
        this.isDropdownOpen = false;
        this.closeMobile();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private checkWhiteHeader(url: string) {
    this.isWhiteHeader = url.includes('/productos') || 
                         url.includes('/servicios') || 
                         url.includes('/nosotros') || 
                         url.includes('/contacto');
    if (this.isWhiteHeader) {
      this.isScrolled = true;
    }
  }

  @HostListener('window:scroll', [])
  @HostListener('document:scroll', [])
  onWindowScroll() {
    if (this.isWhiteHeader) {
      this.isScrolled = true;
      this.cd.markForCheck();
      return;
    }

    const scrollOffset = window.pageYOffset || 
                         document.documentElement.scrollTop || 
                         document.body.scrollTop || 
                         0;

    this.isScrolled = scrollOffset > 30;
    this.cd.markForCheck();
  }

  toggleDropdown(open?: boolean) {
    this.isDropdownOpen = open !== undefined ? open : !this.isDropdownOpen;
  }

  toggleMobile(): void {
    this.isMobileOpen = !this.isMobileOpen;
    this.cd.markForCheck();
  }

  toggleMobileMenu(): void {
    this.toggleMobile();
  }

  // Despliega y retrae el acordeón con las 14 marcas
  toggleProducts(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isMobileProductsOpen = !this.isMobileProductsOpen;
    this.cd.detectChanges();
  }

  toggleMobileProducts(event?: Event): void {
    this.toggleProducts(event);
  }

  closeMobile(): void {
    this.isMobileOpen = false;
    this.isMobileProductsOpen = false;
    this.cd.detectChanges();
  }

  closeMobileMenu(): void {
    this.closeMobile();
  }

  trackByBrand(index: number, item: MarcaHeader): string {
    return item.id;
  }

  irArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}