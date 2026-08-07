export interface EquipmentQuestion {
  id: string;
  label: string;
  category: string;
}

export const EQUIPMENT_QUESTIONS: EquipmentQuestion[] = [
  { id: "eq_computo", label: "Equipo de cómputo", category: "Tecnología" },
  { id: "banco_altura", label: "Banco de altura", category: "Mobiliario" },
  { id: "banco_giratorio", label: "Banco giratorio", category: "Mobiliario" },
  { id: "bascula_estadimetro", label: "Báscula electrónica con estadímetro", category: "Diagnóstico" },
  { id: "bascula_bebes", label: "Báscula pesabebés electrónica", category: "Diagnóstico" },
  { id: "baumanometro_aneroide", label: "Baumanómetro aneroide", category: "Diagnóstico" },
  { id: "baumanometro_mercurio", label: "Baumanómetro de mercurio", category: "Diagnóstico" },
  { id: "camilla", label: "Camilla de exploración", category: "Mobiliario" },
  { id: "estetoscopio", label: "Estetoscopio", category: "Diagnóstico" },
  { id: "glucometro", label: "Glucómetro", category: "Diagnóstico" },
  { id: "lampara_chicote", label: "Lámpara de chicote", category: "Iluminación" },
  { id: "lampara_cabeza", label: "Lámpara de cabeza", category: "Iluminación" },
  { id: "negatoscopio", label: "Negatoscopio", category: "Diagnóstico" },
  { id: "oftalmoscopio", label: "Oftalmoscopio", category: "Diagnóstico" },
  { id: "otoscopio", label: "Otoscopio", category: "Diagnóstico" },
  { id: "oximetro", label: "Oxímetro de pulso", category: "Diagnóstico" },
  { id: "refrigerador_biológico", label: "Refrigerador para biológicos", category: "Equipamiento" },
  { id: "silla_ruedas", label: "Silla de ruedas", category: "Movilidad" },
  { id: "espirómetro", label: "Espirómetro", category: "Diagnóstico" },
  { id: "electrocardiógrafo", label: "Electrocardiógrafo", category: "Diagnóstico" },
  { id: "ultrasonido", label: "Ultrasonido portátil", category: "Imagen" },
  { id: "desfibrilador", label: "Desfibrilador automático (DEA)", category: "Urgencias" },
  { id: "carro_curaciones", label: "Carro de curaciones", category: "Mobiliario" },
  { id: "vitrina", label: "Vitrina para medicamentos", category: "Mobiliario" },
];
