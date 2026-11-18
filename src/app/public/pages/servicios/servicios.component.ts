import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface ServicioIndustrial {
  id: string;
  nombre: string;
  desc: string;
  tag: string;
  img: string;
  icon: string;
  detalles: string[];
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  private router = inject(Router);

  titulo = 'Servicios Técnicos & Automatización de Planta';
  subtitulo = 'Soluciones de ingeniería en calibración con patrones certificados, automatización de válvulas con actuadores y mantenimiento preventivo para líneas de procesos continuos.';

  bannerImg = 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1920&auto=format&fit=crop&q=80';

  servicios: ServicioIndustrial[] = [
    {
      id: 'calibracion',
      nombre: 'Calibración & Metrología Industrial',
      desc: 'Verificación y calibración in-situ y en laboratorio para transmisores de presión Aplisens, manómetros Winters y sensores de temperatura.',
      tag: 'Laboratorio & En Sitio',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-speedometer2',
      detalles: [
        'Transmisores inteligentes HART / Fieldbus',
        'Balanza de pesos muertos para manómetros',
        'Emisión de certificados de calibración trazables'
      ]
    },
    {
      id: 'automatizacion',
      nombre: 'Automatización & Ensamble de Válvulas',
      desc: 'Montaje de actuadores neumáticos Tecnofluid / Airwork sobre válvulas Genebre, Rex y Sun con posicionadores y finales de carrera.',
      tag: 'Taller Especializado',
      img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-gear-wide-connected',
      detalles: [
        'Acoplamiento norma ISO 5211 de actuadores',
        'Solenoides Namur SMS Tork y cajas de switches',
        'Pruebas de ciclado dinámico y hermeticidad'
      ]
    },
    {
      id: 'overhaul',
      nombre: 'Mantenimiento Preventivo & Overhaul',
      desc: 'Desarme, rectificación de asientos, cambio de sellos elastómeros/PTFE y pruebas hidrostáticas computarizadas según norma ANSI/FCI.',
      tag: 'Garantía de Estanqueidad',
      img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-tools',
      detalles: [
        'Banco de prueba hidrostática y neumática',
        'Recuperación de válvulas industriales severas',
        'Programas para paradas mayores de planta'
      ]
    },
    {
      id: 'comisionamiento',
      nombre: 'Comisionamiento & Puesta en Marcha',
      desc: 'Acompañamiento en planta por ingenieros especialistas en lazo de control 4-20mA, verificación de redes FRL y arranque seguro.',
      tag: 'Soporte en Planta',
      img: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-cpu',
      detalles: [
        'Verificación de lazo de instrumentación analógica',
        'Puesta en marcha de estaciones reguladoras de presión',
        'Asistencia presencial en arranques de planta'
      ]
    },
    {
      id: 'auditorias',
      nombre: 'Auditoría de Aire Comprimido & FRL',
      desc: 'Detección ultrasónica de fugas en redes de aire y optimización con unidades de filtración y regulación Airwork y Fluidac.',
      tag: 'Eficiencia Energética',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-wind',
      detalles: [
        'Inspección ultrasónica sin detener producción',
        'Diagnóstico de caídas de presión y condensados',
        'Ahorro comprobado en consumo de compresores'
      ]
    },
    {
      id: 'capacitacion',
      nombre: 'Ingeniería de Selección & Capacitación',
      desc: 'Asesoría técnica en cálculo de Kv/Cv para fluidos agresivos y vapor, junto a talleres prácticos para personal de mantenimiento.',
      tag: 'Formación Técnica',
      img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-mortarboard',
      detalles: [
        'Dimensionamiento y selección de materiales',
        'Capacitación técnica en válvulas y neumática',
        'Asesoría en recambio y modernización de marcas'
      ]
    }
  ];

  ngOnInit(): void {}

  solicitarCotizacion(): void {
    this.router.navigate(['/contacto'], {
      queryParams: { servicio: 'Servicios Industriales & Metrología' },
      fragment: 'formulario-contacto'
    });
  }

  seleccionarServicio(servicio: ServicioIndustrial): void {
    this.router.navigate(['/contacto'], {
      queryParams: { servicio: servicio.nombre },
      fragment: 'formulario-contacto'
    });
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
  }
}