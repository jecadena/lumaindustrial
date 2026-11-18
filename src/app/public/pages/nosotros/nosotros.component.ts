import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PilarCorporativo {
  id: string;
  nombre: string;
  desc: string;
  tag: string;
  img: string;
  icon: string;
  detalles: string[];
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent implements OnInit {
  titulo = 'Sobre LUMA Industrial';
  subtitulo = 'Más de dos décadas impulsando la eficiencia operativa, seguridad de procesos y automatización de la industria con instrumentación de clase mundial y soporte de ingeniería en campo.';
  
  // ✅ Imagen de fondo corporativa verificada
  bannerImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=80';
  fotoEquipo = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80';

  pilares: PilarCorporativo[] = [
    {
      id: 'mision',
      nombre: 'Nuestra Misión',
      desc: 'Suministrar soluciones integrales de automatización, control de fluidos y metrología certificada, garantizando máxima confiabilidad a nuestros clientes.',
      tag: 'Compromiso Operativo',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-bullseye',
      detalles: [
        'Marcas líderes certificadas internacionalmente',
        'Asesoría técnica en selección de materiales',
        'Laboratorio propio de calibración y pruebas'
      ]
    },
    {
      id: 'vision',
      nombre: 'Nuestra Visión',
      desc: 'Consolidarnos como el referente técnico más confiable en la región para la provisión de válvulas de alto desempeño e instrumentación inteligente.',
      tag: 'Horizonte Estratégico',
      img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-eye',
      detalles: [
        'Presencia en los principales sectores productivos',
        'Innovación en soluciones IoT y digitalización',
        'Alianzas exclusivas con fabricantes globales'
      ]
    },
    {
      id: 'valores',
      nombre: 'Valores Corporativos',
      desc: 'Actuamos bajo una ética de rigor técnico innegociable, transparencia comercial, agilidad de respuesta y responsabilidad con la seguridad.',
      tag: 'Cultura de Excelencia',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      icon: 'bi-award',
      detalles: [
        'Rigor y trazabilidad metrológica',
        'Soporte postventa y disponibilidad de repuestos',
        'Capacitación técnica continua para clientes'
      ]
    }
  ];

  ngOnInit(): void {}

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
  }
}