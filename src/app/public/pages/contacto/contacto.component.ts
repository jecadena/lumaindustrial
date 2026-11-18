import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface Sede {
  id: string;
  nombre: string;
  tipo: string;
  badge: string;
  icon: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  horario: string;
  isMapLocation?: boolean;
  mapEmbedUrl: string;
  googleMapsUrl: string;
  mapTitle: string;
  mapDesc: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  titulo = 'Canales de Contacto & Sedes';
  subtitulo = 'Estamos a su disposición con 4 sedes estratégicas en Lima, Trujillo y Arequipa para asesoría en ingeniería, calibración metrológica y despacho inmediato de repuestos y válvulas.';
  bannerImg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=80';

  // Control de estado para mapa (escala de grises vs color)
  isHoveredLogo = false;
  isManualColor = false;
  // Por defecto está seleccionado el LOCAL COMERCIAL
  activeTabSede = 'comercial';
  formSuccess = false;

  // Formulario reactivo / modelo
  formData = {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    sede: 'comercial',
    mensaje: ''
  };

  sedes: Sede[] = [
    {
      id: 'comercial',
      nombre: 'LOCAL COMERCIAL',
      tipo: 'Atención & Entrega Inmediata',
      badge: 'SEDE COMERCIAL',
      icon: 'bi-shop',
      direccion: 'Av. Argentina 538 Stand 1786 C.C. El Progreso',
      ciudad: 'Cercado Lima',
      telefono: '+51 959 341 842',
      email: 'ediaz@lumaindustrial.pe',
      horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
      isMapLocation: true,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.8847648352613!2d-77.04875322415174!3d-12.04253308819389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8cd6760f38b%3A0xc3f48ee5fcefbbfb!2sAv.%20Argentina%20538%2C%20Lima%2015079!5e0!3m2!1ses!2spe!4v1710738920000!5m2!1ses!2spe',
      googleMapsUrl: 'https://maps.google.com/?q=Av.+Argentina+538,+Cercado+de+Lima',
      mapTitle: 'Ubicación del Local Comercial en Lima',
      mapDesc: 'Situado en el corazón comercial e industrial de la Av. Argentina con atención de stock continuo y despacho express para paradas de planta.'
    },
    {
      id: 'principal',
      nombre: 'SEDE PRINCIPAL',
      tipo: 'Casa Matriz & Almacén',
      badge: 'CASA MATRIZ',
      icon: 'bi-building',
      direccion: 'Calle Lenin N° 115 Urb. El Progreso',
      ciudad: 'Lima 06',
      telefono: '+51 924 569 203',
      email: 'mcardenas@lumaindustrial.pe',
      horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
      isMapLocation: false,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.627725916035!2d-77.04584282415383!3d-11.930985988298708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d10a2489ce4b%3A0xe541c6f443b0cead!2sCalle%20Lenin%20115%2C%20Comas%2015316!5e0!3m2!1ses!2spe!4v1710739000000!5m2!1ses!2spe',
      googleMapsUrl: 'https://maps.google.com/?q=Calle+Lenin+115,+El+Progreso,+Lima',
      mapTitle: 'Ubicación de la Sede Principal & Laboratorio',
      mapDesc: 'Casa matriz y taller de metrología especializado en calibración, ensamble de válvulas y almacén general.'
    },
    {
      id: 'norte',
      nombre: 'VENTAS NORTE',
      tipo: '',
      badge: 'SEDE NORTE',
      icon: 'bi-geo-alt',
      direccion: 'Atención y despacho a zona norte',
      ciudad: 'Trujillo',
      telefono: '+51 924 569 203',
      email: 'norte1@lumaindustrial.pe',
      horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
      isMapLocation: false,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.957790757912!2d-79.03058862420959!3d-8.105828491922718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d9ca2a5e4b1%3A0x6b772c6bfbd6443!2sTrujillo!5e0!3m2!1ses!2spe!4v1710739100000!5m2!1ses!2spe',
      googleMapsUrl: 'https://maps.google.com/?q=Trujillo,+La+Libertad,+Peru',
      mapTitle: 'Ubicación de Atención - Ventas Norte',
      mapDesc: 'Centro de coordinación técnica y despacho express para minería, agroindustria y pesquería en la zona norte del país.'
    },
    {
      id: 'sur',
      nombre: 'VENTAS SUR',
      tipo: '',
      badge: 'SEDE SUR',
      icon: 'bi-compass',
      direccion: 'Atención y despacho a zona sur',
      ciudad: 'Arequipa',
      telefono: '+51 989 769 544',
      email: 'sur1@lumaindustrial.pe',
      horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
      isMapLocation: false,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.4243685244196!2d-71.5429696240632!3d-16.403212884328574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424a487785b9b3%3A0x296e812540c49748!2sArequipa!5e0!3m2!1ses!2spe!4v1710739200000!5m2!1ses!2spe',
      googleMapsUrl: 'https://maps.google.com/?q=Arequipa,+Peru',
      mapTitle: 'Ubicación de Atención - Ventas Sur',
      mapDesc: 'Centro de atención técnica y suministro de componentes para operaciones mineras e industriales en la región sur.'
    }
  ];

  ngOnInit(): void {
    // 1. Detectar si proviene de un servicio seleccionado vía queryParams
    this.route.queryParams.subscribe(params => {
      const servicioParam = params['servicio'];
      if (servicioParam) {
        // Redacta automáticamente el texto en el textarea de contacto
        this.formData.mensaje = `Hola LUMA Industrial, deseo solicitar información técnica y cotización sobre el servicio de "${servicioParam}" para nuestra planta industrial.`;

        // Desplaza suavemente hacia el formulario
        setTimeout(() => {
          this.desplazarAFormulario();
        }, 150);
      }
    });

    // 2. Manejo de navegación por fragmento (#formulario-contacto)
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'formulario-contacto') {
        setTimeout(() => {
          this.desplazarAFormulario();
        }, 200);
      }
    });
  }

  desplazarAFormulario(): void {
    const el = document.getElementById('formulario-contacto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  get activeSede(): Sede {
    return this.sedes.find(s => s.id === this.activeTabSede) || this.sedes[0];
  }

  get isCommercialSelected(): boolean {
    return this.activeTabSede === 'comercial';
  }

  get safeMapUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.activeSede.mapEmbedUrl);
  }

  get isMapColor(): boolean {
    return this.isHoveredLogo || this.isManualColor;
  }

  setHoverLogo(state: boolean): void {
    this.isHoveredLogo = state;
  }

  setManualColor(state: boolean): void {
    this.isManualColor = state;
  }

  selectSede(id: string): void {
    this.activeTabSede = id;
    this.formData.sede = id;
  }

  onSubmit(): void {
    this.formSuccess = true;
    setTimeout(() => {
      this.formSuccess = false;
      this.formData = {
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        sede: this.activeTabSede,
        mensaje: ''
      };
    }, 4500);
  }

  cleanPhone(phone: string): string {
    return phone.replace(/\s+/g, '');
  }

  getWhatsAppLink(phone: string): string {
    const clean = phone.replace(/\D/g, '').slice(-9);
    return `https://wa.me/51${clean}?text=Hola%20LUMA%20Industrial%2C%20solicito%20informaci%C3%B3n%20comercial`;
  }
}