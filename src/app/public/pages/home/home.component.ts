import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface HomeSlide {
  img: string;
  rightImg?: string;
  title: string;
  sub: string;
  badge?: string;
  btnText?: string;
  btnLink?: string;
}

interface HomeProduct {
  brand: string;
  name: string;
  desc: string;
  img: string;
  link: string;
  tag?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slides: HomeSlide[] = [
    {
      img: 'assets/fondos/1-NEUMATICA-Y-ELECTRONEUMATICA.jpg',
      rightImg: 'assets/fondos/logos01.png',
      title: 'NEUMATICA Y ELECTRONEUMATICA',
      sub: 'Válvulas, electroválvulas y cilindros neumáticos de alta precisión para automatización y control de procesos industriales.',
      badge: 'Línea Neumática Oficial',
      btnText: 'Ver Catálogo',
      btnLink: '/productos/airwork'
    },
    {
      img: 'assets/fondos/2-INSTRUMENTACION-INDUSTRIAL.jpg',
      rightImg: 'assets/fondos/logos02.png',
      title: 'INSTRUMENTACIÓN INDUSTRIAL',
      sub: 'Transmisores de presión inteligente, sondas de nivel y medición de temperatura de máxima confiabilidad.',
      badge: 'Precisión & Monitoreo',
      btnText: 'Ver Catálogo',
      btnLink: '/productos/aplisens'
    },
    {
      img: 'assets/fondos/3-MEDICION-Y-CONTROL-DE-FLUIDOS.jpg',
      rightImg: 'assets/fondos/logos03.png',
      title: 'MEDICIÓN Y CONTROL DE FLUIDOS',
      sub: 'Soluciones integrales en válvulas solenoides, actuadores y posicionadores para control estanco de fluidos y vapor.',
      badge: 'Fluidos & Actuación',
      btnText: 'Ver Catálogo',
      btnLink: '/productos/tork'
    },
    {
      img: 'assets/fondos/4-AUTOMATIZACION-INDUSTRIAL.jpg',
      title: 'AUTOMATIZACIÓN INDUSTRIAL',
      sub: 'Ingeniería aplicada, integración de sistemas de control, sensores avanzados y optimización de líneas de producción continua.',
      badge: 'Soluciones Llave en Mano'
    },
    {
      img: 'assets/fondos/5-SERVICIOS-INDUSTRIALES.jpg',
      title: 'SERVICIOS INDUSTRIALES',
      sub: 'Montaje de sistemas de instrumentación, calibración especializada, mantenimiento predictivo y preventivo en plantas.',
      badge: 'Servicios en Planta'
    },
    {
      img: 'assets/fondos/6-ASESORIA-Y-SOPORTE-TECNICO.jpg',
      title: 'ASESORÍA Y SOPORTE TÉCNICO',
      sub: 'Acompañamiento técnico calificado para selección, dimensionamiento de componentes y soporte postventa integral.',
      badge: 'Soporte Especializado'
    }
  ];

  // Control responsive del carrusel (1 en móviles, 2 en tablets, 3 en escritorio)
  currentProductIndex = 0;
  itemsPerView = 3;
  private touchStartX = 0;

  products: HomeProduct[] = [
    {
      brand: 'Airwork',
      name: 'Cilindros ISO 15552 Serie MP',
      desc: 'Cilindros neumáticos de perfil limpio con ranuras para sensores y amortiguación neumática regulable.',
      img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CF_iso_15552_pneumatic_cylinders_2024-0000.webp',
      link: '/productos/airwork',
      tag: 'Neumática'
    },
    {
      brand: 'Tecnofluid',
      name: 'Bombas Oleoneumáticas Serie HP',
      desc: 'Bombas hidroneumáticas de alta presión de 100 a 550 bar con mínimo consumo para servicio severo.',
      img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/HP_series.webp',
      link: '/productos/tecnofluid',
      tag: 'Oleodinámica'
    },
    {
      brand: 'Aplisens',
      name: 'Transmisor de Presión APC-2000ALW',
      desc: 'Transmisor inteligente HART con display configurable, alta precisión (0.075%) y certificación ATEX.',
      img: 'assets/images/aplisens/PRESION.jpg.jpeg',
      link: '/productos/aplisens',
      tag: 'Presión & Nivel'
    },
    {
      brand: 'SMS Tork',
      name: 'Válvula Solenoide Serie T-GM',
      desc: 'Válvulas 2/2 vías de acción directa e indirecta para agua, vapor, aire comprimido y gas natural.',
      img: 'assets/images/smstork/VALVULAS SOLENOIDE.jpg',
      link: '/productos/tork',
      tag: 'Válvulas Solenoide'
    },
    {
      brand: 'Genebre',
      name: 'Válvula Mariposa con Actuador',
      desc: 'Válvulas mariposa en acero inoxidable 316 automatizadas con actuador neumático rotativo ISO 5211.',
      img: 'assets/images/genebre/VALVULA MARIPOSA CON ACTUADOR.jpg',
      link: '/productos/genebre',
      tag: 'Válvulas Industriales'
    },
    {
      brand: 'Rex',
      name: 'Válvula Compuerta Industrial',
      desc: 'Válvulas de compuerta en acero forjado y hierro dúctil para cierre estanco en líneas de vapor y fluidos.',
      img: 'assets/images/rex/VALVULA COMPUERTA.jpg',
      link: '/productos/rex',
      tag: 'Válvulas Industriales'
    },
    {
      brand: 'Sun',
      name: 'Válvula de Bola para Vapor',
      desc: 'Válvulas de bola y asiento inclinado de alta resistencia mecánica para control seguro de vapor y fluidos.',
      img: 'assets/images/sun01.png',
      link: '/productos/sun',
      tag: 'Válvulas de Proceso'
    },
    {
      brand: 'XCPC Pneumatic',
      name: 'Cilindro Neumático Serie SDA',
      desc: 'Actuadores de carrera corta y perfil compacto en aleación de aluminio para automatización de alta velocidad.',
      img: 'assets/images/xcpc/CILINDROS NEUMATICOS.jpg',
      link: '/productos/xcpc',
      tag: 'Cilindros Neumáticos'
    },
    {
      brand: 'Fluidac',
      name: 'Unidad de Tratamiento de Aire FRL',
      desc: 'Conjuntos modulares de filtro coalescente, regulador de diafragma y lubricador de neblina de aceite.',
      img: 'assets/images/fluidac/TRATAMIENTO DE AIRE.jpg',
      link: '/productos/fluidac',
      tag: 'Tratamiento de Aire'
    },
    {
      brand: 'Trimod Besta',
      name: 'Boya Neumática',
      desc: 'La boya neumática Trimod Besta es ideal para aplicaciones industriales que requieren seguridad y precisión.',
      img: 'assets/images/trimod/BOYA NEUMATICA.jpg',
      link: '/productos/trimod',
      tag: 'Control de Nivel'
    },
    {
      brand: 'Winters',
      name: 'Manómetro Industrial Acero Inox Serie PFQ',
      desc: 'Manómetros con glicerina y caja de acero inoxidable 304 resistentes a vibraciones severas.',
      img: 'assets/images/winters/MANOMETROS.jpg',
      link: '/productos/winters',
      tag: 'Manómetros'
    },
    {
      brand: 'DCI Dynamics',
      name: 'Termómetros Bimetálicos Industriales',
      desc: 'Termómetros bimetálicos de carátula orientable en acero inoxidable para medición confiable de temperatura.',
      img: 'assets/images/dci/TERMOMETROS.png',
      link: '/productos/dci-dynamics',
      tag: 'Termometría'
    },
    {
      brand: 'Conek',
      name: 'Conectores Neumáticos Instantáneos',
      desc: 'Racores rápidos push-in, reguladores de caudal y silenciadores para mangueras neumáticas milimétricas.',
      img: 'assets/images/conek/CONECTORES NEUMATICOS.jpg',
      link: '/productos/conek',
      tag: 'Conectores Neumáticos'
    },
    {
      brand: 'Airfit',
      name: 'Manguera de Poliuretano y Nylon',
      desc: 'Tubería flexible PU 98A y espirales retráctiles de alta resistencia a la abrasión y presión de trabajo.',
      img: 'assets/images/airfit/MANGUERA DE POLIURETANO Y NYLON.jpg',
      link: '/productos/airfit',
      tag: 'Mangueras y Tuberías'
    }
  ];

  logos = [
    '01airwork.jpg',
    '01tecnofluid.jpg',
    '03aplisens.jpg',
    '04tork.jpg',
    '05genebre.jpg',
    '06rex.jpg',
    '07sun.jpg',
    '08xcpc.jpg',
    '09fluidac.jpg',
    '10trimod.jpg',
    '11winters.jpg',
    '12dcdynamics.jpg',
    '13conek.jpg',
    '14airfit.jpg'
  ];

  newsletterEmail = '';
  timerBanner: any;
  timerProducts: any;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  // Límite de navegación exacto según pantalla
  get maxProductIndex(): number {
    return Math.max(0, this.products.length - this.itemsPerView);
  }

  // Desplazamiento exacto por producto: 100% en celular (1 card), 50% en tablet (2 cards), 33.333% en desktop (3 cards)
  get productTransform(): string {
    const stepPercent = 100 / this.itemsPerView;
    return `translateX(-${this.currentProductIndex * stepPercent}%)`;
  }

  // Detecta el cambio de tamaño de pantalla en vivo
  @HostListener('window:resize')
  onResize(): void {
    this.updateResponsiveView();
  }

  updateResponsiveView(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 600) {
        this.itemsPerView = 1;
      } else if (width <= 992) {
        this.itemsPerView = 2;
      } else {
        this.itemsPerView = 3;
      }

      if (this.currentProductIndex > this.maxProductIndex) {
        this.currentProductIndex = this.maxProductIndex;
      }
      this.cd.detectChanges();
    }
  }

  ngOnInit() {
    this.updateResponsiveView();

    // Banner automático (6s)
    this.timerBanner = setInterval(() => {
      this.nextSlide();
      this.cd.detectChanges();
    }, 6000);

    // Productos automático (5s): avanza producto por producto
    this.timerProducts = setInterval(() => {
      this.nextProduct();
      this.cd.detectChanges();
    }, 5000);
  }

  goToLink(link?: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (link) {
      this.router.navigateByUrl(link).then(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
  prevSlide() {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slides.length - 1;
  }

  // Navegación de productos: avanza 1 a 1 de forma limpia; al llegar al final empieza de nuevo en el 1ero
  nextProduct() {
    if (this.currentProductIndex < this.maxProductIndex) {
      this.currentProductIndex++;
    } else {
      this.currentProductIndex = 0; // Regresa suavemente al primero
    }
    this.cd.detectChanges();
  }

  prevProduct() {
    if (this.currentProductIndex > 0) {
      this.currentProductIndex--;
    } else {
      this.currentProductIndex = this.maxProductIndex;
    }
    this.cd.detectChanges();
  }

  // Soporte táctil para deslizar con el dedo en pantallas táctiles y celulares
  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const deltaX = this.touchStartX - e.changedTouches[0].clientX;
    if (deltaX > 45) {
      this.nextProduct();
    } else if (deltaX < -45) {
      this.prevProduct();
    }
  }

  suscribirse() {
    if (this.newsletterEmail) {
      alert('¡Gracias por suscribirse con ' + this.newsletterEmail + '!');
      this.newsletterEmail = '';
    }
  }

  ngOnDestroy() {
    if (this.timerBanner) clearInterval(this.timerBanner);
    if (this.timerProducts) clearInterval(this.timerProducts);
  }
}