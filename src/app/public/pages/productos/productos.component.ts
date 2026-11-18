import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

export interface ProductoItem {
  nombre: string;
  desc: string;
  img: string;
  categoria?: string;
  codigo?: string;
  specs?: string;
  url?: string;
}

export interface PasoCustom {
  step: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  img: string;
}

export interface CampoAplicacion {
  id: string;
  nombre: string;
  subtitulo: string;
  icono: string;
  iconoFallback: string;
  descripcion: string;
}

export interface MarcaConfig {
  badgeTag: string;
  certificaciones: { text: string; icon: string }[];
  placeholderBusqueda: string;
  garantiaTitulo: string;
  garantiaDesc: string;
  garantiaTags: string[];
  heroEspecialTag: string;
  heroEspecialTitulo: string;
  heroEspecialDesc: string;
  metodologiaTitulo: string;
  metodologiaDesc: string;
  aplicacionesTitulo: string;
  aplicacionesDesc: string;
  modalCotizacionTitulo: string;
  modalCotizacionSub: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  marcaActual = 'airwork';
  titulo = '';
  subtitulo = '';
  bannerImg = '';
  productos: ProductoItem[] = [];

  // Pestañas, filtros y búsqueda en tiempo real
  categoriaActiva = 'Todas';
  busqueda = '';
  productosFiltrados: ProductoItem[] = [];
  // Alias retrocompatible
  productosAirworkFiltrados: ProductoItem[] = [];

  pasoActivoIndex = 0;
  modalCotizacionAbierto = false;
  modalFichaAbierto = false;
  productoSeleccionado: ProductoItem | null = null;
  cotizacionEnviada = false;

  formularioCotizacion = {
    empresa: '',
    contacto: '',
    email: '',
    telefono: '',
    comentarios: ''
  };

  // Categorías oficiales para AirWork (Neumática)
  readonly CATEGORIAS_AIRWORK: string[] = [
    'Todas',
    'Cilindros y Pinzas',
    'Válvulas y Electroválvulas',
    'Tratamiento de Aire',
    'Racores y Tubería',
    'Productos Especiales'
  ];

  // Categorías oficiales para Tecnofluid (Oleodinámica de A&T Fluid Solutions)
  readonly CATEGORIAS_TECNOFLUID: string[] = [
    'Todas',
    'Bombas Oleoneumáticas',
    'Unidades de Control y Bloqueo',
    'Cilindros de Cierre',
    'Cilindros Compactos',
    'Productos Especiales'
  ];

  // 7 Pasos oficiales para realizar un producto CUSTOM en Airwork
  readonly PASOS_CUSTOM_AIRWORK: PasoCustom[] = [
  {
    "step": 1,
    "titulo": "Escuchar la necesidad",
    "subtitulo": "Adaptación de las especificaciones y requisitos funcionales del cliente",
    "descripcion": "Recepción exhaustiva de las necesidades técnicas de la máquina o proceso: espacio volumétrico disponible, presiones de servicio, fluidos en contacto, velocidades de ciclado y ambiente operativo (polvo, lavado, temperatura o áreas ATEX).",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-ascolto-bisogno-600x400.webp"
  },
  {
    "step": 2,
    "titulo": "Desarrollo propuesta técnica",
    "subtitulo": "Compartir el expediente técnico preliminar y enviar el modelo 3D correspondiente al cliente",
    "descripcion": "Nuestro equipo de ingeniería de A&T Fluid Solutions modela la solución en CAD 3D de alta precisión, selecciona los materiales óptimos (acero inoxidable AISI 304/316, aluminio anodizado o sellos especiales FKM/PTFE) y remite el modelo tridimensional para su inserción en el ensamblaje virtual del cliente.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-proposta-tecnica-600x400.webp"
  },
  {
    "step": 3,
    "titulo": "Validación del diseño",
    "subtitulo": "Aprobación de tipo y autorización del cliente",
    "descripcion": "Revisión conjunta entre los ingenieros de proyecto del cliente y nuestro departamento de I+D para homologar las tolerancias dimensionales, fijaciones mecánicas y requerimientos de estanqueidad antes de iniciar la fabricación física.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-convalida-progetto-600x433.webp"
  },
  {
    "step": 4,
    "titulo": "Presupuestos",
    "subtitulo": "Análisis técnico comercial y definición de precio objetivo de la serie y del prototipo",
    "descripcion": "Estudio detallado de viabilidad económica, costos de mecanizado CNC a medida, análisis de economías de escala para la serie definitiva y formulación de una oferta transparente con plazos de entrega comprometidos.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-preventivazione-600x401.webp"
  },
  {
    "step": 5,
    "titulo": "Creación de prototipos",
    "subtitulo": "Realización de prototipos (en acuerdo con el cliente)",
    "descripcion": "Mecanizado directo del prototipo en nuestros centros de control numérico de última generación en Italia, con control metrológico de cotas y ensamblaje manual por técnicos expertos.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-creazione-dei-prototipi-600x450.webp"
  },
  {
    "step": 6,
    "titulo": "Pruebas de resistencia de prototipos",
    "subtitulo": "Definición compartida del protocolo de resistencia y realización de pruebas",
    "descripcion": "Sometimiento del prototipo a rigurosos ensayos en banco de pruebas: ciclado continuo de alta frecuencia a millones de maniobras, pruebas de presión destructiva, estanqueidad con helio y ensayos térmicos extremos.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-test-ednurance-600x450.webp"
  },
  {
    "step": 7,
    "titulo": "Producción de pre series",
    "subtitulo": "Análisis de las economías de escala y realización del lote piloto",
    "descripcion": "Fabricación del lote piloto de pre-serie para validación final en la máquina real en condiciones de producción continua, garantizando la fiabilidad total antes del suministro en serie.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-produzione-pre-serie-600x800.webp"
  }
];

  // 7 Pasos oficiales para desarrollo oleodinámico CUSTOM en Tecnofluid
  readonly PASOS_CUSTOM_TECNOFLUID: PasoCustom[] = [
  {
    step: 1,
    titulo: 'Escuchar la necesidad oleodinámica',
    subtitulo: 'Análisis de presiones hidráulicas de trabajo (hasta 700 bar), caudales y ciclos de carga',
    descripcion: 'Recepción exhaustiva de las especificaciones mecánicas e hidráulicas: fuerzas de empuje/tracción requeridas, tipo de fluido hidráulico (mineral, ecológico o sintético), espacio volumétrico disponible, presiones pico de trabajo y ambientes agresivos.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-ascolto-bisogno-600x400.webp'
  },
  {
    step: 2,
    titulo: 'Desarrollo de la propuesta técnica 3D',
    subtitulo: 'Modelado CAD tridimensional y simulación de esfuerzos hidráulicos por A&T Fluid Solutions',
    descripcion: 'Nuestros ingenieros de diseño en Italia modelan la solución hidráulica en 3D CAD, calculando el dimensionamiento de vástagos, camisas templadas, juntas de estanqueidad anti-extrusión de alto rendimiento y remiten el modelo 3D para su inserción en la máquina del cliente.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-proposta-tecnica-600x400.webp'
  },
  {
    step: 3,
    titulo: 'Validación del diseño hidráulico',
    subtitulo: 'Aprobación dimensional, interfaces de amarre y sellado conjunto con el cliente',
    descripcion: 'Revisión técnica de tolerancias micrométricas, conexiones roscadas (G, NPT, SAE), puertos de alimentación y sistemas de amortiguación o válvulas de seguridad integradas antes de ordenar los materiales forjados.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-convalida-progetto-600x433.webp'
  },
  {
    step: 4,
    titulo: 'Presupuestos y viabilidad comercial',
    subtitulo: 'Costes de fabricación CNC de alta precisión y análisis de economías de escala',
    descripcion: 'Presentación formal de oferta con desglose transparente de costes de mecanizado, tratamiento térmico antidesgaste (nitruración, cromado duro) y planificación de plazos de entrega comprometidos para el prototipo y la serie.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/airwork-preventivazione-600x401.webp'
  },
  {
    step: 5,
    titulo: 'Creación de prototipos mecanizados',
    subtitulo: 'Fabricación directa en centros de mecanizado CNC de 5 ejes en Italia',
    descripcion: 'Mecanizado directo de cuerpos de acero forjado y vástagos de aleación de alta resistencia en nuestra planta italiana, con control metrológico tridimensional pieza por pieza y montaje en sala blanca.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-creazione-dei-prototipi-600x450.webp'
  },
  {
    step: 6,
    titulo: 'Pruebas de resistencia y fatiga hidráulica',
    subtitulo: 'Ensayos destructivos de presión, ciclado continuo a millones de maniobras y estanqueidad',
    descripcion: 'Verificación extrema en banco de pruebas hidráulico: ciclado a alta frecuencia, presiones estáticas de sobrecarga hasta 1.5 veces la nominal, medición de microfugas y ensayos térmicos de fricción.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-test-ednurance-600x450.webp'
  },
  {
    step: 7,
    titulo: 'Producción de pre-series y serie certificada',
    subtitulo: 'Validación en la máquina del cliente y suministro industrial con garantía de calidad total',
    descripcion: 'Fabricación del lote piloto para puesta en marcha en la máquina real en ciclo productivo continuo, garantizando cero defectos antes del suministro de serie con certificación UNI EN ISO 9001:2015.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/11/airwork-produzione-pre-serie-600x800.webp'
  }
];

  // Sectores industriales para Airwork
  readonly CAMPOS_APLICACION_AIRWORK: CampoAplicacion[] = [
  {
    "id": "packaging",
    "nombre": "Packaging / Envasado",
    "subtitulo": "Líneas de empaque y etiquetado",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_present.svg",
    "iconoFallback": "bi-box-seam",
    "descripcion": "Componentes neumáticos de ultra alta velocidad y precisión para mantener cadencias elevadas en máquinas envasadoras, llenadoras verticales y empacadoras automáticas."
  },
  {
    "id": "farm",
    "nombre": "Farm Industry / Agropecuario",
    "subtitulo": "Maquinaria agrícola y ganadera",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_farm.svg",
    "iconoFallback": "bi-tree",
    "descripcion": "Soluciones mecánicas robustas capaces de soportar condiciones ambientales extremas, presencia continua de lodo, suciedad animal, humedad y esfuerzos mecánicos intensos."
  },
  {
    "id": "carwash",
    "nombre": "Carwash / Lavado de Vehículos",
    "subtitulo": "Túneles y pórticos de lavado",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_car_wash.svg",
    "iconoFallback": "bi-droplet-half",
    "descripcion": "Cilindros y válvulas diseñados en aceros inoxidables y tecnopolímeros resistentes al ataque de agua a presión continua, jabones químicos alcalinos y ciclos de trabajo ininterrumpidos."
  },
  {
    "id": "truck",
    "nombre": "Truck & Special Vehicles",
    "subtitulo": "Transporte pesado y vialidad",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_truck.svg",
    "iconoFallback": "bi-truck",
    "descripcion": "Sistemas neumáticos de apertura de compuertas basculantes, semirremolques, camiones cisterna y vehículos especiales de soporte logístico."
  },
  {
    "id": "press",
    "nombre": "Prensas Mecánicas",
    "subtitulo": "Estampado y conformado de metales",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/pressa.svg",
    "iconoFallback": "bi-hammer",
    "descripcion": "Cilindros de gran empuje y unidades de amortiguación reforzadas para absorción de impactos severos y accionamiento seguro en líneas de troquelado y prensas."
  },
  {
    "id": "electromech",
    "nombre": "Electromecánica & Mecatrónica",
    "subtitulo": "Armarios y celdas robotizadas",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/elettromeccanica-1.svg",
    "iconoFallback": "bi-cpu",
    "descripcion": "Integración de microelectroválvulas de bajo consumo e islas con protocolos CANopen e IO-Link en armarios de mando compacto y automatización de robots."
  },
  {
    "id": "clamping",
    "nombre": "Sistemas de Sujeción / Clamping",
    "subtitulo": "Amarre en centros de mecanizado",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/sistemi-di-bloccaggio.svg",
    "iconoFallback": "bi-tools",
    "descripcion": "Fijación y desbloqueo instantáneo y de alta rigidez para moldes, mordazas y matrices de inyección plástica o centros de mecanizado CNC."
  },
  {
    "id": "rail",
    "nombre": "Sector Ferroviario",
    "subtitulo": "Material rodante e infraestructura",
    "icono": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_rail.svg",
    "iconoFallback": "bi-train-front",
    "descripcion": "Componentes de máxima seguridad y certificaciones ignífugas para accionamiento de puertas de trenes, pantógrafos de catenaria y equipos de señalización de vías."
  }
];

  // Sectores industriales para Tecnofluid (Oleodinámica)
  readonly CAMPOS_APLICACION_TECNOFLUID: CampoAplicacion[] = [
  {
    id: 'presses',
    nombre: 'Prensas Mecánicas e Hidráulicas',
    subtitulo: 'Estampado, embutición y troquelado de metales',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/pressa.svg',
    iconoFallback: 'bi-hammer',
    descripcion: 'Cilindros de bloqueo de moldes de alta presión, centrales con acumulador hidroneumático de seguridad y amortiguadores de fin de carrera para prensas de alta cadencia.'
  },
  {
    id: 'molds',
    nombre: 'Moldes de Inyección y Fundición',
    subtitulo: 'Inyección de plásticos y fundición a presión de aluminio',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/sistemi-di-bloccaggio.svg',
    iconoFallback: 'bi-box',
    descripcion: 'Cilindros hidráulicos compactos tipo bloque y tirantes con ranura en T para bloqueo ultrarrápido y seguro de matrices y carros móviles a temperaturas elevadas.'
  },
  {
    id: 'machining',
    nombre: 'Centros de Mecanizado CNC y Utillajes',
    subtitulo: 'Amarre de piezas en fixtures de 5 ejes y mesas transfer',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2026/01/elettromeccanica-1.svg',
    iconoFallback: 'bi-gear-wide-connected',
    descripcion: 'Cilindros de palanca basculante y cilindros roscados de tracción/empuje con fuerzas de amarre superiores a 10 kN para asegurar máxima repetibilidad y rigidez en fresado.'
  },
  {
    id: 'bending',
    nombre: 'Deformación y Curvado de Tubos',
    subtitulo: 'Plegadoras, punzonadoras y cizallas industriales',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_present.svg',
    iconoFallback: 'bi-tools',
    descripcion: 'Unidades de control de bloqueo Serie 5G y 5C que suministran presiones oleodinámicas instantáneas sin necesidad de motor eléctrico, ideales para utillajes móviles.'
  },
  {
    id: 'steel',
    nombre: 'Siderurgia y Minería Pesada',
    subtitulo: 'Accionamientos hidráulicos de servicio severo',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_truck.svg',
    iconoFallback: 'bi-building-gear',
    descripcion: 'Bombas oleoneumáticas Serie HP de hasta 550 bar para accionamiento de gatos hidráulicos, llaves dinamométricas, corte de perfiles y tensionadores de pernos.'
  },
  {
    id: 'testing',
    nombre: 'Bancos de Prueba y Alta Tensión',
    subtitulo: 'Laboratorios de calibración y equipos eléctricos',
    icono: 'https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/ico_rail.svg',
    iconoFallback: 'bi-speedometer2',
    descripcion: 'Amortiguadores progresivos de alto rendimiento, presostatos especiales para gas y sistemas hidroneumáticos para ensayo de fatiga de componentes industriales.'
  }
];

  // Getters para renderizado dinámico entre Airwork y Tecnofluid
  get esMarcaAtFluid(): boolean {
    return this.marcaActual === 'airwork' || this.marcaActual === 'tecnofluid';
  }

  get categoriasActivas(): string[] {
    return this.marcaActual === 'tecnofluid' ? this.CATEGORIAS_TECNOFLUID : this.CATEGORIAS_AIRWORK;
  }

  get pasosCustomActivos(): PasoCustom[] {
    return this.marcaActual === 'tecnofluid' ? this.PASOS_CUSTOM_TECNOFLUID : this.PASOS_CUSTOM_AIRWORK;
  }

  get camposAplicacionActivos(): CampoAplicacion[] {
    return this.marcaActual === 'tecnofluid' ? this.CAMPOS_APLICACION_TECNOFLUID : this.CAMPOS_APLICACION_AIRWORK;
  }

  get configMarca(): MarcaConfig {
    if (this.marcaActual === 'tecnofluid') {
      return {
        badgeTag: 'A&T Fluid Solutions · Made in Italy · Oleodinámica de Precisión (Hasta 700 bar)',
        certificaciones: [
          { text: 'UNI EN ISO 9001:2015', icon: 'bi-patch-check' },
          { text: 'Presiones hasta 700 bar', icon: 'bi-speedometer2' },
          { text: '0 Consumo Eléctrico', icon: 'bi-lightning-charge' },
          { text: '100% Calidad Italiana', icon: 'bi-shield-check' }
        ],
        placeholderBusqueda: 'Buscar por serie (HP, SP, 5G, CB, CCP, 4-1783...)',
        garantiaTitulo: 'A&T Fluid Solutions - Oleodinámica',
        garantiaDesc: 'Componentes y centrales hidráulicas de alta potencia para bloqueo de moldes, troqueles y utillajes sin motor eléctrico.',
        garantiaTags: ['ISO 9001:2015', 'Hasta 700 bar', 'Zero Electric', 'Banco 100%'],
        heroEspecialTag: 'Ingeniería Oleodinámica Custom (Hasta 700 bar)',
        heroEspecialTitulo: 'Soluciones Hidráulicas y Equipos Especiales a Medida',
        heroEspecialDesc: 'Gracias a la experiencia y tecnología avanzada de A&T Fluid Solutions en Brescia (Italia), desarrollamos actuadores hidráulicos de alta presión, centrales de bloqueo con acumulador integrado y amortiguadores de fatiga extrema para las condiciones más exigentes.',
        metodologiaTitulo: '7 Pasos para un Producto Oleodinámico CUSTOM',
        metodologiaDesc: 'Metodología integral desde el cálculo de fuerzas hidráulicas hasta el ensayo en banco de pruebas de presión.',
        aplicacionesTitulo: 'Sectores Industriales & Aplicaciones Oleodinámicas',
        aplicacionesDesc: 'Componentes oleodinámicos de alta presión diseñados para trabajar en entornos industriales severos.',
        modalCotizacionTitulo: 'Solicitud de Proyecto Oleodinámico Especial',
        modalCotizacionSub: 'Ingeniería hidráulica custom Tecnofluid & A&T Fluid Solutions'
      };
    }
    return {
      badgeTag: 'A&T Fluid Solutions · Made in Italy · Neumática Industrial',
      certificaciones: [
        { text: 'UNI EN ISO 9001 / 14001', icon: 'bi-patch-check' },
        { text: '100% Calidad Europea', icon: 'bi-shield-check' },
        { text: '+25 Años Experiencia', icon: 'bi-clock-history' }
      ],
      placeholderBusqueda: 'Buscar por serie (MC, CF, VJ, VI, RF, XF...)',
      garantiaTitulo: 'A&T Fluid Solutions - Neumática',
      garantiaDesc: 'Componentes neumáticos de precisión fabricados bajo rigurosos estándares europeos de calidad y medio ambiente.',
      garantiaTags: ['ISO 9001', 'ISO 14001', 'ATEX'],
      heroEspecialTag: 'Ingeniería & Fabricación Custom',
      heroEspecialTitulo: 'Soluciones Neumáticas e Hidráulicas a Medida',
      heroEspecialDesc: 'Gracias a la experiencia y tecnología avanzada de A&T Fluid Solutions, desarrollamos productos a medida que responden con exactitud a las exigencias de tu maquinaria. Desde el diseño preliminar en 3D CAD hasta la entrega del lote piloto pre-serie.',
      metodologiaTitulo: '7 Pasos para Realizar un Producto CUSTOM',
      metodologiaDesc: 'Un flujo estructurado y transparente para garantizar máxima fiabilidad operativa con A&T Fluid Solutions.',
      aplicacionesTitulo: 'Sectores Industriales',
      aplicacionesDesc: 'Los componentes neumáticos e hidráulicos operan en las áreas más exigentes de la industria.',
      modalCotizacionTitulo: 'Solicitud de Producto Especial',
      modalCotizacionSub: 'Ingeniería custom AirWork & A&T Fluid Solutions'
    };
  }

  // Lista de las 14 marcas oficiales para la barra de navegación rápida
  readonly MARCAS_INFO = [
    { id: 'airwork', nombre: 'AirWork', cat: 'Neumática Industrial', prods: 112 },
    { id: 'tecnofluid', nombre: 'Tecnofluid', cat: 'Oleodinámica & Hidráulica', prods: 30 },
    { id: 'aplisens', nombre: 'Aplisens', cat: 'Instrumentación', prods: 4 },
    { id: 'tork', nombre: 'SMS Tork', cat: 'Fluidos', prods: 4 },
    { id: 'genebre', nombre: 'Genebre', cat: 'Válvulas', prods: 4 },
    { id: 'rex', nombre: 'Rex', cat: 'Conectores', prods: 4 },
    { id: 'sun', nombre: 'Sun', cat: 'Sistemas Hidráulicos', prods: 4 },
    { id: 'xcpc', nombre: 'XCPC', cat: 'Cilindros', prods: 4 },
    { id: 'fluidac', nombre: 'Fluidac', cat: 'Tratamiento Aire', prods: 4 },
    { id: 'trimod', nombre: 'Trimod Besta', cat: 'Nivel', prods: 4 },
    { id: 'winters', nombre: 'Winters', cat: 'Manómetros', prods: 4 },
    { id: 'dci-dynamics', nombre: 'DCI Dynamic', cat: 'Automatización', prods: 4 },
    { id: 'conek', nombre: 'Conek', cat: 'Racoraje', prods: 4 },
    { id: 'airfit', nombre: 'Airfit', cat: 'Mangueras', prods: 4 }
  ];

  // Base de datos oficial completa con las 14 marcas representadas por LUMA Industrial.
  // AirWork incluye las 4 categorías con los 112 productos y la sección custom.
  // Tecnofluid incluye las 5 líneas de oleodinámica con 30 productos oficiales de at-fluidsolutions.com.
  // Las demás 12 marcas conservan su información y diseño original.
  readonly DATA_PRODUCTOS: any = {
'airwork': {
      titulo: 'AirWork',
      subtitulo: 'Es parte de A&T FLUID SOLUTIONS empresa ITALIANA con una sólida tradición en la producción de componentes para la automatización industrial, como cilindros neumáticos, válvulas, grupos de tratamiento de aire y conexiones con certificación UNI EN ISO 9001 y 14001, con experiencia de mas de 25 años en la industria mundial. ',
      bannerImg: 'assets/banners/banner-airwork.jpg',
      items: [
{
    "nombre": "Cilindros ISO 6432",
    "desc": "Los microcilindros ISO 6432 de Airwork se fabrican con los más altos niveles de cualidad y tienen diámetros comprendidos entre 8 y 25 mm.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/MC_ISO_6432_pneumatic_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie MC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-6432/"
  },
  {
    "nombre": "Cilindros ISO 6432 INOX",
    "desc": "Los microcilindros MX - ISO 6432 de Airwork se fabrican completamente en acero inoxidable y según los más altos niveles de calidad.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/MX_ISO_6432_stainless_steel_pneumatic_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie MX",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-6432-inox/"
  },
  {
    "nombre": "Cilindros Redondos",
    "desc": "Los cilindros neumáticos redondos serie CT Airwork se fabrican según los más altos estándares de calidad.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CT_pneumatic_round_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CT",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-redondos-serie-ct/"
  },
  {
    "nombre": "Cilindros ISO 15552",
    "desc": "Los cilindros neumáticos ISO 15552 Serie CF de Airwork representan la nueva generación de actuadores estandarizados para la automatización industrial. ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CF_iso_15552_pneumatic_cylinders_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/nuevos-cilindros-iso-15552-serie-cf/"
  },
  {
    "nombre": "Cilindros con tirantes ISO 15552",
    "desc": "Los cilindros neumáticos de tirantes de la Serie CG representan la nueva generación de actuadores conformes a la norma ISO ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CG_iso_15552_pneumatic_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CG",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-con-tirantes-iso-15552-serie-cg/"
  },
  {
    "nombre": "Cilindros ISO 15552",
    "desc": "Robustez, modularidad y alto rendimiento para la automatización industrial Los cilindros neumáticos ISO 15552 de la Serie CY de Airwork ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CY_iso_15552_pneumatic_cylinders_2024-scaled.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CY",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-15552-serie-cy/"
  },
  {
    "nombre": "Cilindros ISO 15552",
    "desc": "Los cilindros neumáticos de la serie CY de Airwork son realizados respetando la normativa ISO 15552 (ex ISO 6431 VDMA) ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CZ_cilindro_iso_15552_2024-scaled.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CZ",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-15552-serie-cz/"
  },
  {
    "nombre": "Cilindros ISO 15552",
    "desc": "Los cilindros neumáticos de gran diámetro de la Serie CQ (fabricados por Airwork) son actuadores conformes a la norma ISO ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CQ_cilindro_iso_15552_2024-copia.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CQ",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-15552-serie-cq/"
  },
  {
    "nombre": "Cilindros de Vástagos Gemelos",
    "desc": "Los cilindros neumáticos de vástagos gemelos de la Serie CA (fabricados por Airwork) representan la solución ideal para las aplicaciones ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CA_twin_rod_pneumatic_cylinders_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CA",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-de-vastagos-gemelos/"
  },
  {
    "nombre": "Cilindros Compactos ISO 21287",
    "desc": "Optimización del espacio, máxima estabilidad y alto rendimiento para la automatización industrial. Los cilindros neumáticos compactos de la Serie CM ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CM_ISO_21287_pneumatic_compact_cylinders_2024_2-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-compactos-iso-21287/"
  },
  {
    "nombre": "Cilindros ISO 15552 INOX",
    "desc": "Máxima resistencia a la corrosión e higiene superior para los entornos industriales más exigentes. Los cilindros neumáticos de la Serie ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/08/CX_iso_15552_stainless_steel_pneumatic_cylinders_2021.png",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CX",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-iso-15552-acero-inoxidable/"
  },
  {
    "nombre": "Cilindros Planos",
    "desc": "Elevada fuerza de empuje y dimensiones reducidas para la automatización industrial pesada. Los cilindros neumáticos compactos de la Serie CP ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CP_flat_pneumatic_compact_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-planos/"
  },
  {
    "nombre": "Kit de montaje para cilindros neumáticos",
    "desc": "Los kits de montaje para cilindros neumáticos representan una solución estratégica dirigida a distribuidores, socios industriales e integradores. Este servicio ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2022/05/kit-di-montaggio-airwork-cilindri-pneumatici.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "AirWork Mod. 13",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/kit-de-montaje-para-cilindros-neumaticos/"
  },
  {
    "nombre": "Accesorios para Cilindros ISO 15552 y 21287",
    "desc": "Los sistemas de fijación y los accesorios dedicados a los cilindros neumáticos según las normas ISO 6432, ISO 15552 e ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/AR_accessories_for_ISO_15552_21287_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "AirWork Mod. 14",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/accesorios-para-cilindros-iso-15552-y-21287/"
  },
  {
    "nombre": "Cilindros Cartucho",
    "desc": "Los cilindros de cartucho de la Serie CH son la solución ideal para aplicaciones de automatización neumática donde el espacio ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/CH_cartridge_pneumatic_cylinders_2024.png",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CH",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-cartucho/"
  },
  {
    "nombre": "Cilindros COMPACTOS GUIADOS",
    "desc": "Los cilindros compactos guiados de la Serie CC representan la gama alta en actuadores neumáticos lineales integrados. Diseñados para ofrecer ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CC_compact_guided_pneumatic_cylinders_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-compactos-guiados-serie-cc/"
  },
  {
    "nombre": "Cilindros Compactos Guiados Amortizado",
    "desc": "Los cilindros compactos guiados y amortiguados de la Serie CC representan la solución ideal para la automatización industrial que requiere ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/CC_compact_guided_pneumatic_cylinders_2024_2-scaled.png",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-compactos-guiados-amortizado/"
  },
  {
    "nombre": "Cilindros Carrera Corta",
    "desc": "Alto rendimiento y dimensiones reducidas. Los cilindros neumáticos de carrera corta de la Serie CD representan la solución ideal para ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/CD_short_stroke_pneumatic_cylinders_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie CD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-carrera-corta/"
  },
  {
    "nombre": "Cilindros sin Vástago",
    "desc": "Sectores y Campos de Aplicación Gracias a su diseño ultracompacto, su estructura robusta y su capacidad para gestionar grandes carreras ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/SS_rodless_pneumatic_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie SS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-sin-vastago/"
  },
  {
    "nombre": "Bloccasteli",
    "desc": "Blocage mécanique de sécurité haute performance pour vérins pneumatiques Le bloqueur de tige breveté série BS d’Airwork est la solution ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/BS_rod_locks_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie BS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/bloccasteli/"
  },
  {
    "nombre": "Cilindros Stopper",
    "desc": "Precisión y Control para Líneas de Transporte Los cilindros de tope de la Serie ST de Airwork constituyen la solución ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/ST_stopper_pneumatic_cylinders_2024_2.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie ST",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-stopper/"
  },
  {
    "nombre": "Unidades de Guía",
    "desc": "Las unidades de guía Airwork son los accesorios ideales para combinar con cilindros neumáticos según las normas ISO 15552 e ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/UG_guida_H_U_2024-scaled.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie UG",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/unidades-de-guia/"
  },
  {
    "nombre": "Cilindros Rotatorios",
    "desc": "Descubra los Cilindros Rotativos Serie RY para aplicaciones industriales: convierten el movimiento lineal en movimiento rotativo con alta precisión y fiabilidad.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/RY_rotary_pneumatic_cylinders_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie RY",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/cilindros-rotatorios-serie-ry/"
  },
  {
    "nombre": "Actuadores Rotatorios",
    "desc": "Los actuadores rotativos neumáticos de la Serie AT están diseñados para ofrecer altas prestaciones mecánicas en espacios reducidos. Fabricados mediante ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/AT_rotary_actuators_2024-0000.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie AT",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/actuadores-rotatorios/"
  },
  {
    "nombre": "Regulador de velocidad hidráulico",
    "desc": "El regulador hidráulico de velocidad Serie RI está diseñado para controlar y ralentizar de manera precisa y progresiva la velocidad ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/RI_hydraulic_speed_control_2024.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie RI",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/regulador-de-velocidad-hidraulico/"
  },
  {
    "nombre": "Pinzas Angulares",
    "desc": "Las pinzas neumáticas de apertura angular de la serie PA de Airwork representan la solución ideal para aplicaciones de pick & place, ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/09/PA_angular_grippers.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie PA",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/pinzas-angulares/"
  },
  {
    "nombre": "Pinzas Angulares a 180°",
    "desc": "En aplicaciones de automatización de alta velocidad, la presencia de los dedos de la pinza en la zona de trabajo ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/09/Airwork_PG_180_grippers_2024-copia.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie PG",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/pinzas-angulares-a-180/"
  },
  {
    "nombre": "Pinzas Paralelas de Gran Apertura",
    "desc": "Las pinzas neumáticas paralelas de Airwork ofrecen el máximo nivel de precisión para los procesos de montaje y manipulación industrial. A diferencia ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/09/Airwork-PH_large_opening_grippers_2024-copia.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie PH",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/pinzas-paralelas-de-gran-apertura/"
  },
  {
    "nombre": "Pinzas Paralelas Guiadas",
    "desc": "Las pinzas neumáticas paralelas guiadas de la serie PS representan la excelencia en automatización de precisión. Diseñadas para garantizar un movimiento suave ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/09/Airwork-PS_parallel_grippers_2024-copia.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie PS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/pinzas-paralelas-guiadas/"
  },
  {
    "nombre": "Pinzas Paralelas de 3 Garrafas",
    "desc": "Las pinzas neumáticas paralelas de 3 mordazas de la Serie PX de Airwork constituyen una solución ideal para la manipulación de componentes ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/09/PX.webp",
    "categoria": "Cilindros y Pinzas",
    "codigo": "Serie PX",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/cilindros-y-pinzas/pinzas-paralelas-de-3-garrafas/"
  },
  {
    "nombre": "Microválvulas neumáticas de obturador",
    "desc": "Máxima eficiencia en espacios reducidos: la miniaturización se une a la versatilidad modular para el control neumático industrial. Las microválvulas ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VM_microvalves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/microvalvulas/"
  },
  {
    "nombre": "Electropiloto 15mm",
    "desc": "Características Técnicas Principales Tecnología de Acción Directa (Direct-Acting): Garantiza un accionamiento rápido y fiable independientemente de las fluctuaciones de presión ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/Airwork-EP_solenoid_valves_15mm_2024-copia.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie EP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electropiloto-15mm/"
  },
  {
    "nombre": "Electropiloto 10mm",
    "desc": "Características Técnicas Principales Conexión Eléctrica Orientable (Sistema Click-Rotate): Permite girar fácilmente la conexión eléctrica 90° o 180° con un simple ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/Airwork_EP_solenoid_valves_10mm_2024_2-copia.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie EP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electropiloto-10mm/"
  },
  {
    "nombre": "Electroválvulas de Accionamiento Directo",
    "desc": "Compacidad, rápido tiempo de respuesta y alta fiabilidad Las electroválvulas de mando directo (electropilotos) de A&T Fluid Solutions / Airwork ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VD_direct_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/elettrovalvole-a-comando-diretto/"
  },
  {
    "nombre": "Electroválvulas de Accionamiento Directo Modulares",
    "desc": "Máxima Flexibilidad de Montaje, Respuesta Rápida y Durabilidad Excepcional para la Automatización Industrial Las electroválvulas modulares de acción directa de ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VDM_direct_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-de-accionamiento-directo-modulares/"
  },
  {
    "nombre": "Electroválvulas de Accionamiento Directo en batería",
    "desc": "Las principales características de las electroválvulas de batería de la serie VD son la extrema compacidad del producto con la ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VD_direct_solenoid_valves_on_manifold-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-de-accionamiento-directo-en-bateria/"
  },
  {
    "nombre": "Electroválvulas directamente en el cilindro",
    "desc": "Integración Perfecta y Respuesta Inmediata para el Control de Cilindros Neumáticos Las electroválvulas de acción directa de la Serie VF ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VF_direct_solenoid_valve_2024_2-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-directamente-en-el-cilindro/"
  },
  {
    "nombre": "Válvulas de Pilotaje Eléctrico",
    "desc": "Electroválvulas serie VY Airwork: soluciones robustas, fiables y versátiles, disponibles en diferentes configuraciones y tamaños para cualquier aplicación neumática.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VY_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VY",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-de-pilotaje-electrico/"
  },
  {
    "nombre": "Bobinas",
    "desc": "Las bobinas BO propuestas por Airwork están diseñadas para garantizar un rendimiento de altísimo nivel. Están disponibles con Corriente Alterna ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/BO_coils_and_connectors_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 09",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/bobinas/"
  },
  {
    "nombre": "Válvulas Neumáticas",
    "desc": "Integración de alto rendimiento, modularidad avanzada y máxima fiabilidad para la automatización industrial. Las válvulas de accionamiento neumático de la ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VK_pneumatic_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VK",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-neumaticas/"
  },
  {
    "nombre": "Válvulas",
    "desc": "Dimensiones Compactas, Alta Eficiencia y Máxima Fiabilidad Las electroválvulas de la Serie VA representan la solución ideal para las aplicaciones ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VA_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VA",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/elettrovalvole-serie-va/"
  },
  {
    "nombre": "Islas de válvulas Fieldbus",
    "desc": "Eficiencia, diseño modular y conectividad avanzada: las nuevas islas de válvulas Fieldbus Serie VJ llevan el control de la automatización ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/aet-isola.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VJ",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/islas-de-valvulas-fieldbus-serie-vj/"
  },
  {
    "nombre": "Islas de electroválvulas",
    "desc": "Las nuevas islas de electroválvulas Serie VH2 de Airwork representan la evolución de la neumática moderna, diseñadas para responder a ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VH2_island_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VH2",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/islas-de-electrovalvulas-serie-vh2/"
  },
  {
    "nombre": "Válvulas ISO 5599/1",
    "desc": "Las válvulas neumáticas y electroválvulas de la Serie VI de Airwork están diseñadas en estricta conformidad con la norma internacional ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VI_iso_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VI",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvole-iso-55991-taglia-1-e-2/"
  },
  {
    "nombre": "Válvulas NAMUR",
    "desc": "Descubra las ventajas de las válvulas NAMUR Serie VU: respuesta rápida, menos fugas y mantenimiento simplificado para actuadores neumáticos industriales.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VU_NAMUR_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VU",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvole-namur/"
  },
  {
    "nombre": "Válvulas de Accionamiento Manual",
    "desc": "Las válvulas de accionamiento manual de la Serie VM están diseñadas para garantizar el máximo control y fiabilidad en los ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VM_manual_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-de-accionamiento-manual/"
  },
  {
    "nombre": "Válvulas Accionamiento Manual con Accionador",
    "desc": "Las válvulas manuales con interfaz son la solución ideal para personalizar su propia válvula. De hecho, con todas las versiones ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VM_manual_actuated_valves_2_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-accionamiento-manual-con-accionador/"
  },
  {
    "nombre": "Válvulas de Pedal",
    "desc": "Las válvulas neumáticas de pedal de la Serie VP están diseñadas para garantizar un control ergonómico, seguro y fiable de ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VP_pedal_actuated_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-de-pedal/"
  },
  {
    "nombre": "Reguladores De Flujo",
    "desc": "El regulador de caudal en línea tiene la función de regular la velocidad de movimiento de los cilindros neumáticos y ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/RF_flow_regulators_in_line_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie RF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/regolatori-di-flusso/"
  },
  {
    "nombre": "Reguladores de Flujo de Acero Inoxidable",
    "desc": "Precisión, resistencia y fiabilidad en los entornos más exigentes Los reguladores de caudal de la Serie RFX en acero inoxidable ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/RF_stainless_steel_flow_regulators-in_line_2021-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie RFX",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/regolatori-di-flusso-in-acciaio-inox/"
  },
  {
    "nombre": "Válvula de Selección",
    "desc": "Gestión Automática y Segura de Señales de Entrada (Función Lógica OR) La válvula selectora de la Serie VS (también conocida ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VS_pneumatic_logic_valves_2021-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvula-de-seleccion-serie-vs/"
  },
  {
    "nombre": "Válvulas Antirretorno",
    "desc": "Control Unidireccional del Flujo y Protección de Circuitos de Aire Comprimido Las válvulas anti-retorno (también conocidas como válvulas de retención ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VR_non_return_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 22",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-antirretorno/"
  },
  {
    "nombre": "Válvulas Antirretorno de Acero Inoxidable",
    "desc": "Máxima Resistencia Química y Seguridad para Entornos Industriales Exigentes Las válvulas anti-retorno en acero inoxidable AISI 316L de la Serie ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VRX-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 23",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-antirretorno-de-acero-inoxidable/"
  },
  {
    "nombre": "Válvulas De Bloqueo",
    "desc": "Seguridad y Mantenimiento de Posición en Circuitos Neumáticos Las válvulas de bloqueo neumáticas de la Serie VO (también conocidas como ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VO_pneumatic_stop_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VO",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvole-di-blocco/"
  },
  {
    "nombre": "Válvula de Corredera",
    "desc": "Corte Directo en Línea y Purga Segura de Aire Comprimido Las válvulas correderas manuales de la Serie VR (también conocidas ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VR_slide_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 25",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvola-a-corsoio/"
  },
  {
    "nombre": "Válvulas de Escape Rápido",
    "desc": "Máxima Velocidad en los Actuadores y Reducción de Tiempos de Ciclo Las válvulas de escape rápido de la Serie VR ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VR_quick_exhaust_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 26",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvole-a-scarico-rapido/"
  },
  {
    "nombre": "Válvulas de Escape Rápido de Acero Inoxidable",
    "desc": "Máxima Velocidad en los Actuadores para Ambientes Corrosivos e Higiénicos Las válvulas de escape rápido en acero inoxidable AISI 316L ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VRX_quick_exhaust_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 27",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-de-escape-rapido-de-acero-inoxidable/"
  },
  {
    "nombre": "Válvulas a Esfera",
    "desc": "Son válvulas ON/OFF para varios campos de aplicación: aire, agua y circuitos oleodinámicos, también es posible el uso para vacío ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/BV_ball_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 28",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-a-esfera/"
  },
  {
    "nombre": "Silenciadores",
    "desc": "Reducción de Ruido y Protección para Sistemas Neumáticos Los silenciadores neumáticos (también conocidos como amortiguadores de escape) son componentes esenciales ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/SI_air_silencers_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "AirWork Mod. 29",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/silenciadores/"
  },
  {
    "nombre": "Electroválvulas de accionamiento directo",
    "desc": "Máxima precisión y mínimo espacio para el control de fluidos Las electroválvulas de accionamiento directo de la Serie VQD representan ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VQD_direct_acting_solenoid_valves_2024_2-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VQD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-de-accionamiento-directo/"
  },
  {
    "nombre": "Válvulas solenoides de operación directa de acero inoxidable",
    "desc": "Descripción del Producto Las electroválvulas de accionamiento directo de la Serie VXD representan la solución ideal para el control de ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VQDX_direct_acting_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VXD",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-solenoides-de-operacion-directa-de-acero-inoxidable-serie-vxd/"
  },
  {
    "nombre": "Electroválvulas de acción indirecta",
    "desc": "Las electroválvulas de accionamiento indirecto de la Serie VQI de Airwork están diseñadas para ofrecer un alto rendimiento y la ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VQI_indirect_acting_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VQI",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-de-accion-indirecta-serie-vqi/"
  },
  {
    "nombre": "Electroválvula de acero inoxidable de accionamiento indirecto",
    "desc": "La electroválvula de accionamiento indirecto Serie VXI de Airwork está fabricada íntegramente en Acero Inoxidable AISI 316L, diseñada para ofrecer ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VXI_indirect_acting_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VXI",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvula-de-acero-inoxidable-de-accionamiento-indirecto-serie-vxi/"
  },
  {
    "nombre": "Electroválvulas de Membrana",
    "desc": "Las electroválvulas de la Serie VQM de accionamiento mixto (comando combinado / alzada asistida) unen las ventajas del control directo ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VQM_membrane_solenoid_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VQM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/electrovalvulas-de-membrana/"
  },
  {
    "nombre": "Válvulas de Escape Condensado",
    "desc": "La Serie VQS ofrece una solución modular y eficaz para la purga automática de condensados en instalaciones de aire comprimido. ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/VQS_condensed_drain_valves_2024-0000.webp",
    "categoria": "Válvulas y Electroválvulas",
    "codigo": "Serie VQS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/valvulas-y-electrovalvulas/valvulas-de-escape-condensado/"
  },
  {
    "nombre": "Filtro MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XF.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XF_coalescent_filters_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-xf-mini/"
  },
  {
    "nombre": "Filtro de Coalescencia MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XC.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XF_air_filters_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-de-coalescencia-xc-mini/"
  },
  {
    "nombre": "Regulador MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XR.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XR_air_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XR",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-xr-mini/"
  },
  {
    "nombre": "Regulador de Agua",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XQ.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XQ_water_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XQ",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-de-agua-xq/"
  },
  {
    "nombre": "Filtro Regulador MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XP.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XP_filter_regulators_0_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-xp-mini/"
  },
  {
    "nombre": "Lubricador MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XL.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XL_air_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XL",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/lubricador-xl-mini/"
  },
  {
    "nombre": "Filtro Regulador + Lubricador (FR+L) MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XS.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XS_filter_regulator_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-lubricador-frl-xs-mini/"
  },
  {
    "nombre": "Filtro + Regulador + Lubricador (F+R+L) MINI",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XT.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/XT0.png",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XT",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-lubricador-frl-xt-mini/"
  },
  {
    "nombre": "Filtro",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XF.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XC_coalescer_filters_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-xf/"
  },
  {
    "nombre": "Filtro de Coalescencia",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XC.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XC_coalescer_filters_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-de-coalescencia-xc/"
  },
  {
    "nombre": "Regulador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XR.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XR_air_regulators_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XR",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-xr/"
  },
  {
    "nombre": "Filtro Regulador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XP.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XP_filter_regulators_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-xp/"
  },
  {
    "nombre": "Lubricador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XL.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XL_lubricators_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XL",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/lubricador-xl/"
  },
  {
    "nombre": "Filtro + Lubricador (FR+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XO.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/XO.png",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XO",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-lubricador-frl-xo/"
  },
  {
    "nombre": "Filtro Regulador + Lubricador (FR+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XS.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XS_filter_regulator_lubricators_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-lubricador-frl-xs/"
  },
  {
    "nombre": "Filtro + Regulador + Lubricador (F+R+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XT.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XT_FRL_filter_regulator_lubricators_1_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XT",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-lubricador-frl-xt/"
  },
  {
    "nombre": "Arrancador Progresivo con Descarga Rápida",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XA.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XA_soft_start_valves_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XA",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/arrancador-progresivo-con-descarga-rapida-xa/"
  },
  {
    "nombre": "Válvula Selectora",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XV.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XV_shot_off_valves_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XV",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/valvula-selectora-xv/"
  },
  {
    "nombre": "Válvula + Filtro Regulador + Lubricador (V+FR+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XM.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XM_VFRL_valve_filter_regulator_lubricator_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XM",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/valvula-filtro-regulador-lubricador-vfrl-xm/"
  },
  {
    "nombre": "Válvula + Filtro + Regulador + Lubricador (V+F+R+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie XN.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XN_VFRL_valve_filter_regulator_lubricator_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie XN",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/valvula-filtro-regulador-lubricador-vfrl-xn/"
  },
  {
    "nombre": "Filtro",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YF.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YF_air_filters_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YF",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-yf/"
  },
  {
    "nombre": "Filtro de Coalescencia",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YC.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YF_air_filters_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-de-coalescencia-yc/"
  },
  {
    "nombre": "Regulador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YR.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YR_air_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YR",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-yr/"
  },
  {
    "nombre": "Filtroregulador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YP.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YP_filter_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YP",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtroregulador-yp/"
  },
  {
    "nombre": "Lubricador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YL.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YL_air_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YL",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/lubricador-yl/"
  },
  {
    "nombre": "Filtroregulador + Lubricador (FR+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YS.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YS_filter_regulator_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YS",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtroregulador-lubricador-ys-frl/"
  },
  {
    "nombre": "Filtro + Regulador + Lubricador (F+R+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YT.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YT_FRL_filter_regulator_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YT",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-regulador-lubricador-yt-frl/"
  },
  {
    "nombre": "Filtro + Lubricador (F+L)",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YO.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YO_FL_filter_lubricators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YO",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/filtro-lubricador-yo-fl/"
  },
  {
    "nombre": "Regulador Pilotable",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YU.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YU_pilot_controlled_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YU",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-pilotable-yu/"
  },
  {
    "nombre": "Secador",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YE.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YE_Dryer_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YE",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/secador-ye/"
  },
  {
    "nombre": "Descargador Automático de Condensación",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YJ.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/YJ_drip_leg_drain_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YJ",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/descargador-automatico-de-condensacion-yj/"
  },
  {
    "nombre": "Accesorios",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie YB.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/XB_FRL_accessories_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "Serie YB",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/accesorios-yb/"
  },
  {
    "nombre": "Regulador de Precisión",
    "desc": "El regulador de precisión se caracteriza por una alta precisión y estabilidad de la presión regulada gracias a un concepto ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/DR_air_precision_regulators_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "AirWork Mod. 33",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/regulador-de-precision/"
  },
  {
    "nombre": "Microregulador",
    "desc": "El microregulador de la serie DT realizado por Airwork es particularmente adecuado para el montaje en panel o en todas ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/DT_air_microregulator_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "AirWork Mod. 34",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/microregulador/"
  },
  {
    "nombre": "Presostatos Digitales",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie .",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/DP_digital_pressure_switches_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "AirWork Mod. 35",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/presostatos-digitales/"
  },
  {
    "nombre": "Manómetros Digitales",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie .",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/DM_digital_pressure_gauges_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "AirWork Mod. 36",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/manometros-digitales/"
  },
  {
    "nombre": "Presostatos",
    "desc": "Unidad de preparación de aire comprimido para máxima pureza según estándar ISO 8573-1. Serie .",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/PR_pressure_switches_2024-0000.webp",
    "categoria": "Tratamiento de Aire",
    "codigo": "AirWork Mod. 37",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/tratamiento-de-aire/presostatos/"
  },
  {
    "nombre": "Accesorios de acoplamiento rápido",
    "desc": "Descubra las características, ventajas y aplicaciones de los racores de conexión rápida Serie PC: conexiones neumáticas seguras, rápidas y fiables.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/PC_push_in_fittings_2024-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie PC",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-de-acoplamiento-rapido/"
  },
  {
    "nombre": "Accesorios de acoplamiento rápido de latón",
    "desc": "Los racores de acoplamiento rápido se denominan así porque permiten acoplar el tubo al conector de forma instantánea sin la ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/A100_push_in_fittings_brass_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie A100",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-de-acoplamiento-rapido-de-laton/"
  },
  {
    "nombre": "Accesorios de conexión rápida de acero inoxidable",
    "desc": "Relaciono la serie A100X con su forma de producto y un panel económico similar a la serie A100 en otomana, ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2016/11/A100X_push_in_fittings_stainless_steel_2024_2.png",
    "categoria": "Racores y Tubería",
    "codigo": "Serie A100X",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-de-acoplamiento-rapido-de-acero-inoxidable/"
  },
  {
    "nombre": "Reguladores De Flujo",
    "desc": "El regulador de caudal tiene la función de regular la velocidad de desplazamiento de los cilindros neumáticos y pueden ser ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/RF_flow_regulators_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "AirWork Mod. 04",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/reguladores-de-flujo/"
  },
  {
    "nombre": "Accesorios estándar",
    "desc": "Racores estándar roscados en latón niquelado.",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/B200_adaptors_fittings_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie B200",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-estandar/"
  },
  {
    "nombre": "Accesorios a presión",
    "desc": "Los racores rápidos son especialmente adecuados para el montaje de tuberías «de plástico» en sistemas neumáticos, especialmente donde puede haber ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/C300_push_on_fittings_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie C300",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-a-calzamento/"
  },
  {
    "nombre": "Accesorios de compresión",
    "desc": "Los accesorios de compresión se definen así porque el apriete de la tubería sobre el accesorio se produce mediante la ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/D400_compression_fittings_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie D400",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/racores-de-compresion/"
  },
  {
    "nombre": "Acopladores rápidos",
    "desc": "Los accesorios pertenecientes a esta categoría permiten desconectar de forma sencilla y rápida la tubería del sistema principal sin tener ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/E500_automatic_quick_coupling_2024_2-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie E500",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/ataques-rapidos/"
  },
  {
    "nombre": "Tubos Neumáticos",
    "desc": "Airwork ofrece una gama completa de mangueras neumáticas, disponibles en diferentes materiales, colores y diámetros. Los paquetes estándar se presentan ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/air_tubes_2024-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "AirWork Mod. 09",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/tubos-neumaticos/"
  },
  {
    "nombre": "Pistolas de aire comprimido",
    "desc": "Airwork ofrece una gama completa de pistolas de soplado adecuadas para todas las necesidades. Con cuerpo de fundición de aluminio ...",
    "img": "https://www.at-fluidsolutions.com/wp-content/uploads/2024/10/pistola-standard_2024-0000.webp",
    "categoria": "Racores y Tubería",
    "codigo": "Serie PI",
    "specs": "A&T Fluid Solutions - Certificación ISO 9001 / 14001",
    "url": "https://www.at-fluidsolutions.com/es/pneumatica/racores-y-tuberia/pistolas-sopladoras/"
  }
      ]
    },

        'tecnofluid': {
      titulo: 'Tecnofluid',
      subtitulo: 'Es parte de A&T FLUID SOLUTIONS empresa ITALIANA con una sólida tradición en la producción de componentes para la automatización industrial y oleodinámica, como bombas oleoneumáticas, unidades de bloqueo, cilindros de cierre y compactos de alta presión, con certificación UNI EN ISO 9001:2015 y más de 35 años de experiencia mundial.',
      bannerImg: 'assets/banners/banner-tecnofluid.jpg',
      items: [
  // 1. BOMBAS OLEONEUMÁTICAS
  {
    nombre: 'Bombas Oleoneumáticas Serie HP',
    desc: 'Bombas hidroneumáticas de alta presión diseñadas para uso industrial severo. Convierten la presión de aire comprimido en alta presión hidráulica de 100 a 550 bar con mínimo consumo neumático. Cuentan con sellos anti-extrusión, tratamiento anticorrosión y válvula de retención de alto rendimiento.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/HP_series.webp',
    categoria: 'Bombas Oleoneumáticas',
    codigo: 'Serie HP',
    specs: 'Presión: 100 a 550 bar · A&T Fluid Solutions · UNI EN ISO 9001:2015',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bombas-oleopneumaticas/bombas-hidroneumaticas-serie-hp/'
  },
  {
    nombre: 'Bombas Oleoneumáticas Serie SP',
    desc: 'Bombas hidroneumáticas compactas idóneas para instalaciones que demandan presión constante en circuito cerrado con compensación automática de fugas. Rango de presiones de 40 a 530 bar. Aptas para montaje en pared o instalación sumergible dentro del depósito de aceite.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/SP_series.webp',
    categoria: 'Bombas Oleoneumáticas',
    codigo: 'Serie SP',
    specs: 'Presión: 40 a 530 bar · Montaje pared o sumergible · Cabezal anticorrosión',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bombas-oleopneumaticas/bombas-hidroneumaticas-serie-sp/'
  },
  {
    nombre: 'Multiplicadores de Presión Aire-Aceite Serie MP',
    desc: 'Equipos oleoneumáticos de relación diferencial continua que proporcionan alta presión instantánea para herramientas hidráulicas portátiles, prensas de laboratorio y ensayos destructivos sin necesidad de bombas rotativas eléctricas.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/01/pompe-oleopneumatiche-composizione.webp',
    categoria: 'Bombas Oleoneumáticas',
    codigo: 'Serie MP',
    specs: 'Relación de compresión hasta 1:80 · Alta fiabilidad operativa',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bombas-oleopneumaticas/'
  },
  {
    nombre: 'Bombas Hidroneumáticas con Mando a Pedal Serie HPP',
    desc: 'Bombas oleoneumáticas de accionamiento por pedal de 3 posiciones ergonómico (avance, retención de carga y descompresión). Concebidas para talleres de matrices, bancos de prensado y herramientas de remachado donde el operario requiere ambas manos libres.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/HP_series.webp',
    categoria: 'Bombas Oleoneumáticas',
    codigo: 'Serie HPP',
    specs: 'Presión hasta 700 bar · Depósito 2.5 a 5 Litros · Pedal ergonómico 3 posiciones',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bombas-oleopneumaticas/'
  },
  {
    nombre: 'Centralitas Hidroneumáticas Autónomas con Carro Móvil Serie HP-BOX',
    desc: 'Grupos autónomos móviles montados en bastidor de acero con ruedas, filtro-regulador FRL integrado, manómetro antichoque en baño de glicerina y acoplamientos rápidos de alta presión para servicios en taller y campo.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/01/pompe-oleopneumatiche-composizione.webp',
    categoria: 'Bombas Oleoneumáticas',
    codigo: 'Serie HP-BOX',
    specs: 'Bastidor portátil de alta resistencia · Presión regulable hasta 700 bar · Válvula de alivio',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bombas-oleopneumaticas/'
  },

  // 2. UNIDADES DE CONTROL Y BLOQUEO
  {
    nombre: 'Unidades de Comando de Bloqueo con Depósito Metálico Serie 5G',
    desc: 'Centrales hidroneumáticas completas con depósito de acero de alta resistencia y bomba Serie SP integrada. Diseñadas para alimentar circuitos de bloqueo de alta presión en prensas, cizallas y plegadoras sin requerir motor eléctrico. Mandos neumáticos, eléctricos o manuales.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/5C_series-locking-power-units-metal-tank.webp',
    categoria: 'Unidades de Control y Bloqueo',
    codigo: 'Serie 5G',
    specs: 'Depósito chapa de acero · Mando neumático / eléctrico / manual',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bloqueo-de-unidades-de-control/unidades-de-cierre-con-deposito-metalico-serie-5g/'
  },
  {
    nombre: 'Unidades de Comando de Bloqueo con Depósito Plástico Serie 5C',
    desc: 'Centrales compactas de peso reducido con depósito termoplástico translúcido para fácil inspección visual del nivel de aceite hidráulico. Ideales para equipos modulares móviles y utillajes donde se requiere ligereza y resistencia química.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/5C_series-locking-power-units-plastic-tank.webp',
    categoria: 'Unidades de Control y Bloqueo',
    codigo: 'Serie 5C',
    specs: 'Depósito translúcido · Dimensiones ultracompactas · Sin consumo eléctrico',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bloqueo-de-unidades-de-control/unidades-de-cierre-con-deposito-de-plastico-serie-5c/'
  },
  {
    nombre: 'Unidades de Comando de Bloqueo sin Depósito Serie 5C',
    desc: 'Módulos compactos de bombeo y control concebidos para instalarse directamente embutidos en el depósito principal de la máquina o prensa. Minimizan tuberías y riesgo de fugas con bomba Serie SP integrada.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/5C_series-locking-power-units-without-tank.webp',
    categoria: 'Unidades de Control y Bloqueo',
    codigo: 'Serie 5C-NT',
    specs: 'Integración en tanque existente · Sin motor eléctrico · Montaje sumergido',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bloqueo-de-unidades-de-control/unidades-de-control-de-bloqueo-sin-tanque-serie-5c/'
  },
  {
    nombre: 'Bloques de Distribución Modular Serie BD',
    desc: 'Bloques distribuidores hidráulicos modulares para configurar circuitos de 3 o 4 vías en las centrales de bloqueo Serie 5C y 5G. Opciones con palanca manual con enclavamiento, pilotaje neumático proporcional o electroválvulas integradas.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Distribution-blocks.webp',
    categoria: 'Unidades de Control y Bloqueo',
    codigo: 'Serie BD',
    specs: 'Configuraciones 3/4 vías · Accionamiento neumático o solenoide',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bloqueo-de-unidades-de-control/bloques-de-distribucion/'
  },
  {
    nombre: 'Central Oleoneumática de Bloqueo Integrada Serie 5GH',
    desc: 'Central oleohidráulica equipada con acumulador hidroneumático de membrana para absorción de pulsaciones, válvulas de retención de seguridad estanca y manómetro con glicerina para control de presión en utillajes de precisión.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/centraline-di-bloccaggio-composizione.webp',
    categoria: 'Unidades de Control y Bloqueo',
    codigo: 'Serie 5GH',
    specs: 'Presión hasta 500 bar · Acumulador de seguridad antigoteo',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/bloqueo-de-unidades-de-control/'
  },

  // 3. CILINDROS DE CIERRE (CLAMPING CYLINDERS)
  {
    nombre: 'Cilindros de Bloqueo de Tirantes con Ranura en T Serie CBS03',
    desc: 'Cilindros hidráulicos de alta potencia diseñados para el amarre rápido y seguro de moldes y matrices en mesas de prensas provistas de ranuras en T. Cuerpo monobloque compacto capaz de generar elevadas fuerzas de apriete a 320 bar.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Locking-Cylinders-with-tie-rod-for-t-slot.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CBS03',
    specs: 'Presión máxima: 320 bar · Fijación en ranuras T según DIN 650',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-de-bloqueo-de-tirantes-con-ranura-en-t-serie-cbs-03/'
  },
  {
    nombre: 'Cilindros de Cierre con Orificio Pasante Exterior Liso Serie CB03',
    desc: 'Actuadores lineales de amarre con cilindro hueco pasante que permite atravesar varillas roscadas o tirantes de apriete. Especialmente indicados para fijación frontal de troqueles pesados en prensas excéntricas e hidráulicas.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Locking-Cylinders-CB03.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CB03',
    specs: 'Presión máxima: 320 bar · Orificio pasante de alta carga',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-de-cierre-con-orificio-pasante-exterior-liso-serie-cb-03/'
  },
  {
    nombre: 'Cilindros con Retorno por Resorte con Rosca Externa Serie CB01',
    desc: 'Cilindros hidráulicos de simple efecto con retorno por resorte interno y cuerpo roscado exteriormente. Su rosca continua facilita el montaje embutido con contratuercas en placas de utillaje, asegurando un diseño extremadamente compacto.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Threaded-outer-body-cylinders.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CB01',
    specs: 'Retorno por resorte · Rosca métrica exterior · Hasta 350 bar',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-con-retorno-por-resorte-con-rosca-externa-serie-cb01/'
  },
  {
    nombre: 'Cilindros Pasantes Roscados con Retorno por Resorte Serie CB04',
    desc: 'Cilindros huecos combinados con rosca exterior y pistón pasante. Permiten aplicaciones mixtas de tracción o compresión sobre tirantes roscados de fijación rápida en dispositivos de mecanizado.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Threaded-through-hole-cylinders.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CB04',
    specs: 'Pistón hueco roscado · Simple efecto · Gran compacidad',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-pasantes-roscados-con-retorno-por-resorte-roscado-externo-serie-cb-04/'
  },
  {
    nombre: 'Cilindros de Tracción Externos Roscados Serie CB06',
    desc: 'Actuadores hidráulicos de tracción diseñados para tirar del vástago hacia el interior del cuerpo, asegurando componentes desde su parte interna o a través de taladros pasantes en utillajes de precisión.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Pulling-cylinders.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CB06',
    specs: 'Tracción hidráulica · Montaje roscado · Sellos de alta presión',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-de-traccion-externos-roscados-serie-cb-06/'
  },
  {
    nombre: 'Cilindros de Doble Efecto con Rosca Exterior Serie CB08',
    desc: 'Cilindros de carrera corta con control hidráulico bidireccional (avance y retroceso hidráulico) y cuerpo roscado. Ideales para operaciones exigentes de punzonado, embutición, calafateado y troquelado de chapa en ciclo continuo.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Double-acting-cylinders.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CB08',
    specs: 'Doble efecto · Ciclos rápidos de cadencia elevada · Hasta 350 bar',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-de-doble-efecto-con-rosca-exterior-serie-cb-08/'
  },
  {
    nombre: 'Cilindros de Sujeción por Palanca Basculante Serie CL01 / CL03 / CL04',
    desc: 'Cilindros de brida basculante compactos para centros de mecanizado CNC de 4 y 5 ejes. La palanca transmite la fuerza del pistón amplificada generando fuerzas de amarre superiores a 10 kN a 250 bar con rotación lateral para despeje total de la pieza.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/cilindri-di-bloccaggio-composizione.webp',
    categoria: 'Cilindros de Cierre',
    codigo: 'Serie CL',
    specs: 'Fuerza > 10 kN a 250 bar · Despeje angular de carga · Regulación de caudal',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-de-cierre/cilindros-de-sujecion-por-palanca-cl03/'
  },

  // 4. CILINDROS COMPACTOS (COMPACT HYDRAULIC CYLINDERS)
  {
    nombre: 'Cilindros Compactos de Montaje Superior con Cuerpo de Acero Serie CCP',
    desc: 'Cilindros hidráulicos compactos monobloque fabricados en acero forjado con orificios pasantes superiores para atornillado directo. Generan altísima fuerza de empuje hasta 200 bar con vástagos templados por inducción y tratamiento antidesgaste.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Compact-Cylinders.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CCP',
    specs: 'Presión: hasta 200 bar · Cuerpo de acero forjado · Tratamiento antidesgaste',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/cilindros-compactos-de-montaje-superior-con-cuerpo-de-acero-serie-ccp/'
  },
  {
    nombre: 'Cilindros Compactos Estándar con Cuerpo de Acero Serie CCP',
    desc: 'Actuadores hidráulicos compactos estándar intercambiables con las principales marcas europeas. Disponibles en versiones de simple y doble efecto para moldes de inyección plástica, prensado y troquelado industrial.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Standard-Compact-Cylinders.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CCP-STD',
    specs: 'Intercambiabilidad universal · Opciones simple/doble efecto · 200 bar',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/cilindros-compactos-estandar-con-cuerpo-de-acero-serie-ccp/'
  },
  {
    nombre: 'Cilindros de Cierre Compactos con Cuerpo de Aluminio Serie CC',
    desc: 'Cilindros hidráulicos de carrera corta con cuerpo perfilado en aleación ligera anodizada y ranuras longitudinales para alojamiento de sensores magnéticos de fin de carrera. Máxima ligereza con alta resistencia a la presión.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Compact-locking-cylinders.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CC',
    specs: 'Cuerpo de aleación ligera · Ranura para sensores magnéticos · Alta cadencia',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/cilindros-de-cierre-compactos-con-cuerpo-de-aluminio-serie-cc/'
  },
  {
    nombre: 'Cilindros Hidráulicos de Bloque para Moldes Serie CHB',
    desc: 'Cilindros tipo bloque de diseño ultraplano con conexiones de aceite integradas en la base mediante juntas tóricas (montaje en placa / manifold). Diseñados para accionar carros y movimientos de núcleos en moldes de inyección térmica.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/cilindri-compatti-composizione.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CHB',
    specs: 'Montaje en manifold sin racores exteriores · Resistente a altas temperaturas',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/'
  },
  {
    nombre: 'Cilindros Compactos con Ranura para Sensores Magnéticos Serie CC-M',
    desc: 'Cilindros hidráulicos compactos con cuerpo de aleación ligera anodizada dura provistos de ranuras longitudinales integradas para detectores magnéticos reed o de efecto Hall, garantizando monitorización electrónica continua de posición en ciclos automáticos.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Compact-locking-cylinders.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CC-M',
    specs: 'Detección magnética inductiva · Aleación aeronáutica anodizada · Presión 160 bar',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/'
  },
  {
    nombre: 'Cilindros Hidráulicos Guiados de Bloque Serie CCG',
    desc: 'Cilindros hidráulicos de bloque con dos columnas de guiado templadas y rectificadas y placa frontal de amarre, evitando cualquier torsión angular del vástago bajo cargas excéntricas severas en prensas y troqueles.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/02/Compact-Cylinders.webp',
    categoria: 'Cilindros Compactos',
    codigo: 'Serie CCG',
    specs: 'Guías dobles templadas · Cero torsión angular · Fuerza hasta 50 kN',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/cilindros-compactos/'
  },

  // 5. PRODUCTOS ESPECIALES OLEODINÁMICA
  {
    nombre: 'Amortiguadores de Altas Prestaciones para Sector Alta Tensión',
    desc: 'Amortiguadores hidráulicos de precisión diseñados para absorber impactos severos en interruptores y disyuntores de subestaciones eléctricas de alta tensión, garantizando disipación controlada y larga vida útil.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/03/4-1783-0-B.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 4-1783',
    specs: 'Sector Eléctrico / AT · Disipación cinética extrema · Fabricación italiana',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/amortiguadores-de-altas-prestaciones-para-el-sector-de-alta-tension/'
  },
  {
    nombre: 'Amortiguador Progresivo Autocompensante',
    desc: 'Amortiguador hidráulico con perfil hidráulico de frenado autocompensante que adapta la deceleración en función de la masa y velocidad de impacto, protegiendo prensas mecánicas y líneas transfer.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/04/4-1832-0-2.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 4-1832',
    specs: 'Frenado progresivo autocompensante · Alta repetibilidad milimétrica',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/amortiguador-progresivo-autocompensante/'
  },
  {
    nombre: 'Presostatos y Densostatos Especiales para Gases Industriales',
    desc: 'Instrumentación de seguridad y presostatos de 2 y 4 niveles de intervención con estanqueidad metálica para fluidos de proceso y gas SF6 en equipos de distribución eléctrica.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/04/5-1918-0-A.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 5-1918 / 5-1810',
    specs: 'Estanqueidad metálica estricta · Monitoreo multi-nivel',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/presostato-de-media-presion-con-cuatro-niveles-de-intervencion/'
  },
  {
    nombre: 'Unidad de Control Oleoneumática con Acumulador Aire/Aceite Integrado',
    desc: 'Central hidráulica combinada con acumulador coaxial integrado para garantizar compensación volumétrica instantánea y amarre elástico en operaciones de corte y deformación de chapa.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/04/5-1887-0-2.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 5-1887',
    specs: 'Acumulador coaxial aire/aceite · Respuesta milisegundos',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/unidad-de-control-oleoneumatica-con-acumulador-aire-aceite-integrado/'
  },
  {
    nombre: 'Central Oleoneumática para Seguridad Hidráulica con Válvulas Integradas',
    desc: 'Centralita hidroneumática de seguridad diseñada para evitar el bloqueo del pistón en prensas excéntricas mediante descarga rápida de sobrepresión e inyección instantánea de fluidos.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/09/5GH2C9061211-A-centr.-idropneu.-per-sicurezza-idr.-valvole-integrate.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 5GH-VALV',
    specs: 'Seguridad para prensas excéntricas · Válvula de alivio integrada',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/central-oleoneumatica-para-la-seguridad-hidraulica-con-valvulas-integradas/'
  },
  {
    nombre: 'Cilindro Hidráulico Especial con Distribuidor Rotativo Integrado',
    desc: 'Solución a medida que combina actuador hidráulico de rotación con colector giratorio multicanal para transferir fluidos a alta presión a elementos móviles en tornos y cabezales rotativos.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/04/4-1713-0.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 4-1713',
    specs: 'Distribuidor giratorio multicanal · Alta presión continua',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/cilindro-especial-con-distribuidor-rotativo-integrado/'
  },
  {
    nombre: 'Regulador Hidráulico de Velocidad con Mando a Distancia',
    desc: 'Regulador hidráulico de avance de precisión con sistema de pilotaje remoto para controlar la velocidad de penetración de brocas y fresas en centros de taladrado pesado.',
    img: 'https://www.at-fluidsolutions.com/wp-content/uploads/2025/04/4-1604-0-1.webp',
    categoria: 'Productos Especiales',
    codigo: 'Serie 4-1604',
    specs: 'Control de avance micrométrico · Pilotaje remoto',
    url: 'https://www.at-fluidsolutions.com/es/oleodinamica/productos-especiales-oleodinamica/regulador-hidraulico-de-velocidad-con-mando-a-distancia/'
  }
]
    },

    'aplisens': {
      titulo: 'Aplisens',
    subtitulo: 'Es uno de los principales fabricantes de instrumentación de procesos de alta calidad. La empresa fue fundada en 1992 y la sede encuentra en Varsovia. Desde el principio se ha concentrado en la tecnología electrónica de medición de presión y presión diferencial. ',
    bannerImg: 'assets/banners/banner-aplisens.jpg',
    items: [
      { nombre: 'PRESION', desc: '', img: 'assets/images/aplisens/PRESION.jpg.jpeg' },
      { nombre: 'NIVEL', desc: '', img: 'assets/images/aplisens/NIVEL.jpg.jpeg' },
      { nombre: 'TEMPERATURA', desc: '', img: 'assets/images/aplisens/TEMPERATURA.jpg.jpeg' },
      { nombre: 'FLUJO', desc: '', img: 'assets/images/aplisens/FLUJO.jpg.jpeg' },
      { nombre: 'POSICIONADORES', desc: '', img: 'assets/images/aplisens/POSICIONADORES.jpg.jpeg' },
      { nombre: 'SELLOS DE DIAFRAGMA', desc: '', img: 'assets/images/aplisens/SELLOS DE DIAFRAGMA.jpg.jpeg' },
      { nombre: 'DISPLAYS', desc: '', img: 'assets/images/aplisens/DISPLAYS.jpg.jpeg' },
      { nombre: 'MANIFOLDS', desc: '', img: 'assets/images/aplisens/MANIFOLDS.jpg.jpeg' },
      { nombre: 'FUENTE DE ALIMENTACIÓN', desc: '', img: 'assets/images/aplisens/FUENTE DE ALIMENTACION.jpg.jpeg' }
    ]
    },

    'tork': {
      titulo: 'SMS Tork',
    subtitulo: 'Es el primer productor de válvulas solenoide, actuadores neumáticos, válvulas de asiento inclinado, válvula de pulso y actuadores eléctricos en Turquía y Europa. Desde 1985 es el preferido en más de 87 países. ',
    bannerImg: 'assets/banners/banner-tork.jpg',
    items: [
      { nombre: 'VÁLVULAS SELENOIDE', desc: '', img: 'assets/images/smstork/VALVULAS SOLENOIDE.jpg' },
      { nombre: 'VALVULAS DE PULSO', desc: '', img: 'assets/images/smstork/VALVULAS DE PULSO.jpg' },
      { nombre: 'VALVULAS PARA GAS NATURAL', desc: '', img: 'assets/images/smstork/VALVULAS PARA GAS NATURAL.jpg' },
      { nombre: 'VALVULA DE CONTROL', desc: '', img: 'assets/images/smstork/VALVULA DE CONTROL.jpg' },
      { nombre: 'VALVULA DE ASIENTO INCLINADO', desc: '', img: 'assets/images/smstork/VALVULA DE ASIENTO INCLINADO.jpg' },
      { nombre: 'VALVULAS DE BOLA CON ACTUADOR', desc: '', img: 'assets/images/smstork/VALVULAS DE BOLA CON ACTUADOR.jpg' },
      { nombre: 'VALVULAS MARIPOSA CON ACTUADOR', desc: '', img: 'assets/images/smstork/VALVULAS MARIPOSA CON ACTUADOR.jpg' },
      { nombre: 'ACTUADORES Y ACCESORIOS', desc: '', img: 'assets/images/smstork/ACTUADORES Y ACCESORIOS.jpg' },
      { nombre: 'LIMIT SWITCH', desc: '', img: 'assets/images/smstork/LIMIT SWITCH.jpg' }
    ]
    },

    'genebre': {
      titulo: 'Genebre',
    subtitulo: 'Desde que en 1981 GENEBRE inicio su actividad en el mercado de válvulas y accesorios para control de fluidos y posteriormente seguiría su internacionalización con filiales en todo el mundo. La compañía ha mantenido un crecimiento continuo hasta situarse como uno de los líderes mundiales en su sector. ',
    bannerImg: 'assets/banners/banner-genebre.jpg',
    items: [
      { nombre: 'VALVULA MARIPOSA CON ACTUADOR', desc: '', img: 'assets/images/genebre/VALVULA MARIPOSA CON ACTUADOR.jpg' },
      { nombre: 'VALVULA DE BOLA CON ACTUADOR', desc: '', img: 'assets/images/genebre/VALVULA DE BOLA CON ACTUADOR.jpg' },
      { nombre: 'POSICIONADORES', desc: '', img: 'assets/images/genebre/POSICIONADORES.jpg' },
      { nombre: 'VALVULA MARIPOSA', desc: '', img: 'assets/images/genebre/VALVULA MARIPOSA.jpg' },
      { nombre: 'VALVULA DE BOLA', desc: '', img: 'assets/images/genebre/VALVULA DE BOLA.jpg' },
      { nombre: 'VALVULA DE ASIENTO INCLINADO', desc: '', img: 'assets/images/genebre/VALVULA DE ASIENTO INCLINADO.jpg' },
      { nombre: 'ACTUADOR NEUMATICO', desc: '', img: 'assets/images/genebre/ACTUADOR NEUMATICO.png' },
      { nombre: 'ACTUADOR ELECTRICO', desc: '', img: 'assets/images/genebre/ACTUADOR ELECTRICO.png' },
      { nombre: 'LIMIT SWITCH', desc: '', img: 'assets/images/genebre/LIMIT SWITCH.jpg' }
    ]
    },

    'rex': {
      titulo: 'Rex',
    subtitulo: 'REX VALVES se ha convertido en líder del mercado en el negocio de productos para el control de fluidos, suministrando a fabricantes de maquinarias y fabricas en el campo de papel, textil, químico, petroquímicos, fertilizantes, acero, etc. en los sectores publico y privado.  ',
    bannerImg: 'assets/banners/banner-rex.jpg',
    items: [
      { nombre: 'VALVULA COMPUERTA', desc: '', img: 'assets/images/rex/VALVULA COMPUERTA.jpg' },
      { nombre: 'VALVULA GLOBO', desc: '', img: 'assets/images/rex/VALVULA GLOBO.png' },
      { nombre: 'VALVULA MARIPOSA', desc: '', img: 'assets/images/rex/VALVULA MARIPOSA.jpg' },
      { nombre: 'VALVULA ESFERICA', desc: '', img: 'assets/images/rex/VALVULA ESFERICA.jpg' },
      { nombre: 'VALVULA CHECK SWING', desc: '', img: 'assets/images/rex/VALVULA CHECK SWING.jpg' },
      { nombre: 'VALVULA CHECK PISTON', desc: '', img: 'assets/images/rex/VALVULA CHECK PISTON.jpg' },
    ]
    },

    'sun': {
      titulo: 'Sun',
    subtitulo: 'Fabricante de válvulas industriales y accesorios para vapor, cuenta con fabricas con la última tecnología de mecanizado que garantizan productos de alta calidad a precios que se ajustan al presupuesto del cliente.  ',
    bannerImg: 'assets/banners/banner-sun.jpg',
    items: [
      { nombre: 'VALVULA COMPUERTA', desc: '', img: 'assets/images/sun/VALVULA COMPUERTA.jpeg' },
      { nombre: 'VALVULA CHECK SWING', desc: '', img: 'assets/images/sun/VALVULA CHECK SWING.jpeg' },
      { nombre: 'VALVULA CHECK DISCO', desc: '', img: 'assets/images/sun/VALVULA CHECK DISCO.jpeg' },
      { nombre: 'VALVULA DE BOLA', desc: '', img: 'assets/images/sun/VALVULA DE BOLA.jpeg' },
      { nombre: 'VALVULA ASIENTO INCLINADO', desc: '', img: 'assets/images/sun/VALVULA ASIENTO INCLINADO.jpeg' },
      { nombre: 'VALVULA AGUJA', desc: '', img: 'assets/images/sun/VALVULA AGUJA.jpeg' },
    ]
    },

    'xcpc': {
      titulo: 'XCPC',
    subtitulo: 'Ningbo Xinchao Automatization Component Co., Ltd se estableció en 1991 en una compañía especializada en la fabricación de componentes para la automatización neumática con certificación ISO 9001 y 2000. En el presente es uno de los más grandes fabricantes en el mundo. ',
    bannerImg: 'assets/banners/banner-xcpc.jpg',
    items: [
      { nombre: 'CILINDROS NEUMATICOS', desc: '', img: 'assets/images/xcpc/CILINDROS NEUMATICOS.jpg' },
      { nombre: 'TRATAMIENTO DE AIRE', desc: '', img: 'assets/images/xcpc/TRATAMIENTO DE AIRE.jpg' },
      { nombre: 'VALVULAS DIRECCIONALES', desc: '', img: 'assets/images/xcpc/VALVULAS DIRECCIONALES.jpg' },
      { nombre: 'VALVULAS DE ACCIONAMIENTO MECANICO', desc: '', img: 'assets/images/xcpc/VALVULAS DE ACCIONAMIENTO MECANICO.jpg' },
      { nombre: 'VALVULAS SOLENOIDE', desc: '', img: 'assets/images/xcpc/VALVULAS SOLENOIDE.jpg' },
      { nombre: 'ACCESORIOS', desc: '', img: 'assets/images/xcpc/ACCESORIOS.jpg' },
    ]
    },

    'fluidac': {
      titulo: 'Fluidac',
    subtitulo: 'Es un fabricante especializado en la automatización neumática con mas de 10 años de experiencia y un profundo conocimiento del sector industrial. Actualmente la gama principal incluye tratamiento de aire, válvulas, cilindros neumáticos y conexiones.  ',
    bannerImg: 'assets/banners/banner-fluidac.jpg',
    items: [
      { nombre: 'CILINDROS ISO6432', desc: '', img: 'assets/images/fluidac/CILINDROS ISO6432.jpg' },
      { nombre: 'CILINDROS GUIADOS', desc: '', img: 'assets/images/fluidac/CILINDROS GUIADOS.jpg' },
      { nombre: 'CILINDROS COMPACTOS', desc: '', img: 'assets/images/fluidac/CILINDROS COMPACTOS.jpg' },
      { nombre: 'ELECTROVALVULAS', desc: '', img: 'assets/images/fluidac/ELECTROVALVULAS.png' },
      { nombre: 'TRATAMIENTO DE AIRE', desc: '', img: 'assets/images/fluidac/TRATAMIENTO DE AIRE.jpg' },
      { nombre: 'VALVULAS MANUALES', desc: '', img: 'assets/images/fluidac/VALVULAS MANUALES.jpg' },
    ]
    },

    'trimod': {
      titulo: 'Trimod Besta',
    subtitulo: 'BESTA AG fue fundada en 1966 como una subsidiaria de Bachofen Holding AG en Uster. A partir de octubre de 2015 la compañía se fusionó con la unidad de negocios Bachofen Automation. Los productos TRIMOD BESTA de nivel, flujo, presión y temperatura se desarrollan y producen en Uster-Suiza y se distribuyen en todo el mundo con representantes en 45 países. ',
    bannerImg: 'assets/banners/banner-trimod.jpg',
    items: [
      { nombre: 'BOYA NEUMATICA', desc: '', img: 'assets/images/trimod/BOYA NEUMATICA.jpg' },
      { nombre: 'INTERRUPTOR DE NIVEL', desc: '', img: 'assets/images/trimod/INTERRUPTOR DE NIVEL.jpg' },
      { nombre: 'ACCESORIOS DE MONTAJE', desc: '', img: 'assets/images/trimod/ACCESORIOS DE MONTAJE.png' }
    ]
    },

    'winters': {
      titulo: 'Winters',
    subtitulo: 'Es uno de los principales fabricantes de instrumentos de medición de presión y temperatura, como manómetros, termómetros, sellos de diafragma, transmisores y accesorios. Fue fundada en 1953 con sede en Toronto – Canadá.  ',
    bannerImg: 'assets/banners/banner-winters.jpg',
    items: [
      { nombre: 'MANOMETROS', desc: '', img: 'assets/images/winters/MANOMETROS.jpg' },
      { nombre: 'TERMOMETROS', desc: '', img: 'assets/images/winters/TERMOMETROS.jpg' },
      { nombre: 'TRANSMISORES DE PRESION', desc: '', img: 'assets/images/winters/TRANSMISORES DE PRESION.jpg' }
    ]
    },

    'dci-dynamics': {
      titulo: 'DCI Dynamic',
    subtitulo: 'Hacemos que sus elecciones de instrumentos de control sean fáciles con nuestras amplias líneas de productos de manómetros, termómetros, sellos diafragma y accesorios. Atendemos a industrias que abarcan toda la gama desde el refinamiento petroquímico hasta el procesamiento de alimentos. ',
    bannerImg: 'assets/banners/banner-dci.jpg',
    items: [
      { nombre: 'MANOMETROS', desc: '', img: 'assets/images/dci/MANOMETROS.jpg' },
      { nombre: 'TERMOMETROS', desc: '', img: 'assets/images/dci/TERMOMETROS.png' },
      { nombre: 'ACCESORIOS', desc: '', img: 'assets/images/dci/ACCESORIOS.jpg' }
    ]
    },

    'conek': {
      titulo: 'Conek',
    subtitulo: 'CONEK PNEUMATIC CO. LTD. es uno de los mayores fabricantes de accesorios neumáticos, que presta servicios a la industria en todo el mundo. Desde su establecimiento en 1998, ha estado proporcionando accesorios neumáticos con sistemas de medición en pulgadas y métrico. ',
    bannerImg: 'assets/banners/banner-conek.jpg',
    items: [
      { nombre: 'CONECTORES NEUMATICOS', desc: '', img: 'assets/images/conek/CONECTORES NEUMATICOS.jpg' },
      { nombre: 'REGULADORES DE CAUDAL', desc: '', img: 'assets/images/conek/REGULADORES DE CAUDAL.jpg' },
      { nombre: 'SILENCIADORES', desc: '', img: 'assets/images/conek/SILENCIADORES.jpg' }
    ]
    },

    'airfit': {
      titulo: 'Airfit',
    subtitulo: 'AIRFIT es un nombre confiable en la fabricación de mangueras y accesorios de PU, nylon, PE, PVC y todo tipo de mangueras compuestas, como manguera trenzada de PU y manguera de alta presión utilizadas para la transferencia de aire, agua, aceite y productos químicos. ',
    bannerImg: 'assets/banners/banner-airfit.jpg',
    items: [
      { nombre: 'MANGUERA DE POLIURETANO Y NYLON', desc: '', img: 'assets/images/airfit/MANGUERA DE POLIURETANO Y NYLON.jpg' },
      { nombre: 'MANGUERA EN ESPIRAL', desc: '', img: 'assets/images/airfit/MANGUERA EN ESPIRAL.jpg' },
      { nombre: 'ACCESORIOS Y ACOPLES', desc: '', img: 'assets/images/airfit/ACCESORIOS Y ACOPLES.jpg' }
    ]
    }

  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Detectamos cambios en el parámetro :id o :marca de la URL (/productos/:marca)
    this.route.paramMap.subscribe(params => {
      const brandId = params.get('marca') || params.get('id') || 'airwork';
      this.cargarDatos(brandId);
    });

    // Ajusta la cabecera a modo blanco en páginas interiores
    const header = document.querySelector('header');
    if (header) header.classList.add('menu-blanco');
  }

  cargarDatos(id: string | null): void {
    const brandId = id && this.DATA_PRODUCTOS[id] ? id : 'airwork';
    this.marcaActual = brandId;
    const data = this.DATA_PRODUCTOS[brandId];
    if (data) {
      this.titulo = data.titulo;
      this.subtitulo = data.subtitulo;
      this.bannerImg = data.bannerImg;
      this.productos = data.items || [];
      this.categoriaActiva = 'Todas';
      this.busqueda = '';
      this.pasoActivoIndex = 0;
      this.filtrarProductos();
      window.scrollTo(0, 0);
    }
  }

  cambiarMarca(brandId: string): void {
    this.cargarDatos(brandId);
  }

  cambiarCategoria(cat: string): void {
    this.categoriaActiva = cat;
    this.filtrarProductos();
  }

  cambiarCategoriaAirwork(cat: string): void {
    this.cambiarCategoria(cat);
  }

  conteoPorCategoria(cat: string): number {
    if (cat === 'Todas') return this.productos.length;
    return this.productos.filter(p => p.categoria && p.categoria.toLowerCase() === cat.toLowerCase()).length;
  }

  filtrarProductos(): void {
    const q = this.busqueda.trim().toLowerCase();

    if (this.categoriaActiva === 'Productos Especiales' && !q) {
      this.productosFiltrados = this.productos.filter(p => p.categoria === 'Productos Especiales');
      this.productosAirworkFiltrados = this.productosFiltrados;
      return;
    }

    this.productosFiltrados = this.productos.filter(p => {
      const matchCat = this.categoriaActiva === 'Todas' ||
        (p.categoria && p.categoria.toLowerCase() === this.categoriaActiva.toLowerCase());
      if (!matchCat) return false;
      if (!q) return true;
      return (
        (p.nombre && p.nombre.toLowerCase().includes(q)) ||
        (p.codigo && p.codigo.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.categoria && p.categoria.toLowerCase().includes(q)) ||
        (p.specs && p.specs.toLowerCase().includes(q))
      );
    });

    this.productosAirworkFiltrados = this.productosFiltrados;
  }

  filtrarProductosAirwork(): void {
    this.filtrarProductos();
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.filtrarProductos();
  }

  abrirModalFicha(prod: ProductoItem): void {
    this.productoSeleccionado = prod;
    this.modalFichaAbierto = true;
  }

  cerrarModalFicha(): void {
    this.modalFichaAbierto = false;
  }

  abrirModalCotizacion(prod?: ProductoItem): void {
    if (prod) {
      this.productoSeleccionado = prod;
      this.formularioCotizacion.comentarios = 'Solicito cotización formal y plazo de entrega para el producto: ' + prod.nombre + (prod.codigo ? ' (Código: ' + prod.codigo + ')' : '') + '.';
    } else {
      this.formularioCotizacion.comentarios = 'Solicito asesoría técnica especializada para componentes de la línea ' + (this.marcaActual === 'tecnofluid' ? 'Tecnofluid (Oleodinámica)' : 'Airwork (Neumática)') + '.';
    }
    this.cotizacionEnviada = false;
    this.modalCotizacionAbierto = true;
  }

  // Correo corporativo de destino para cotizaciones técnicas y comerciales
  readonly emailDestino = 'ediaz@lumaindustrial.pe';

  enviarCotizacion(): void {
    // 1. Activa la pantalla de confirmación exitosa en el modal
    this.cotizacionEnviada = true;

    // 2. Si dispones de un backend o servicio API REST / Formspree / EmailJS:
    /*
    this.http.post('https://tu-api.lumaindustrial.pe/cotizaciones', {
      destinatario: this.emailDestino,
      empresa: this.formularioCotizacion.empresa,
      contacto: this.formularioCotizacion.contacto,
      telefono: this.formularioCotizacion.telefono,
      email: this.formularioCotizacion.email,
      comentarios: this.formularioCotizacion.comentarios,
      marca: this.marcaActual
    }).subscribe({
      next: () => console.log('Cotización enviada a ' + this.emailDestino),
      error: (err) => console.error('Error al enviar:', err)
    });
    */

    console.log('Cotización remitida a:', this.emailDestino, this.formularioCotizacion);
  }

  cerrarModalCotizacion(): void {
    this.modalCotizacionAbierto = false;
    this.cotizacionEnviada = false;
    this.formularioCotizacion = {
      empresa: '',
      contacto: '',
      email: '',
      telefono: '',
      comentarios: ''
    };
  }

  // Genera el enlace de respaldo mailto para abrir copia en cliente de correo
  generarMailtoUrl(): string {
    const asunto = encodeURIComponent(
      'Solicitud de Cotización LUMA - ' + (this.formularioCotizacion.empresa || 'Cliente')
    );
    const cuerpo = encodeURIComponent(
      'Estimado Eduardo Díaz,\n\n' +
      'Solicito cotización técnica y comercial con el siguiente detalle:\n\n' +
      '• Empresa / Razón Social: ' + this.formularioCotizacion.empresa + '\n' +
      '• Contacto: ' + this.formularioCotizacion.contacto + '\n' +
      '• Teléfono / WhatsApp: ' + this.formularioCotizacion.telefono + '\n' +
      '• Email remitente: ' + this.formularioCotizacion.email + '\n' +
      '• Requerimiento:\n' + this.formularioCotizacion.comentarios + '\n\n' +
      'Atentamente,\n' + this.formularioCotizacion.contacto
    );
    return 'mailto:' + this.emailDestino + '?subject=' + asunto + '&body=' + cuerpo;
  }

  // Previene loops y controla iconos pequeños sin desbordar
  onImgError(event: any): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    if (img.classList.contains('icon-img') || img.parentElement?.classList.contains('campo-icon') || img.parentElement?.classList.contains('icon-box') || img.classList.contains('campo-icon')) {
      img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2028%2028%22%3E%3Crect%20fill%3D%22%23fdf2f8%22%20width%3D%2228%22%20height%3D%2228%22%20rx%3D%226%22%2F%3E%3Ccircle%20cx%3D%2214%22%20cy%3D%2214%22%20r%3D%226%22%20fill%3D%22%2357204f%22%2F%3E%3C%2Fsvg%3E';
      return;
    }
    img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%231e293b%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20x%3D%22200%22%20y%3D%22150%22%3ELUMA%20Industrial%3C%2Ftext%3E%3C%2Fsvg%3E';
  }
}