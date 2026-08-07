export interface MedicalUnit {
  clues: string;
  name: string;
  stateId: string;
  municipality: string;
}

export const MEDICAL_UNITS: MedicalUnit[] = [
  // Aguascalientes
  { clues: "ASSSA000001", name: "Centro de Salud Aguascalientes Centro", stateId: "ags", municipality: "Aguascalientes" },
  { clues: "ASSSA000002", name: "Centro de Salud Jesús Terán", stateId: "ags", municipality: "Aguascalientes" },
  { clues: "ASSSA000003", name: "Centro de Salud Insurgentes", stateId: "ags", municipality: "Aguascalientes" },

  // Baja California
  { clues: "BCSSA000001", name: "Centro de Salud Zona Norte Tijuana", stateId: "bc", municipality: "Tijuana" },
  { clues: "BCSSA000002", name: "Centro de Salud Ensenada Centro", stateId: "bc", municipality: "Ensenada" },
  { clues: "BCSSA000003", name: "Unidad Médica Mexicali Sur", stateId: "bc", municipality: "Mexicali" },

  // Baja California Sur
  { clues: "BSSSA000001", name: "Centro de Salud La Paz Centro", stateId: "bcs", municipality: "La Paz" },
  { clues: "BSSSA000002", name: "Centro de Salud Los Cabos", stateId: "bcs", municipality: "Los Cabos" },

  // Campeche
  { clues: "CMSSA000001", name: "Centro de Salud San Francisco de Campeche", stateId: "camp", municipality: "Campeche" },
  { clues: "CMSSA000002", name: "Centro de Salud Ciudad del Carmen", stateId: "camp", municipality: "Carmen" },

  // Chiapas
  { clues: "CSSSA000001", name: "Centro de Salud Tuxtla Gutiérrez Norte", stateId: "chis", municipality: "Tuxtla Gutiérrez" },
  { clues: "CSSSA000002", name: "Centro de Salud San Cristóbal de las Casas", stateId: "chis", municipality: "San Cristóbal" },
  { clues: "CSSSA000003", name: "Unidad Médica Tapachula", stateId: "chis", municipality: "Tapachula" },

  // Chihuahua
  { clues: "CHSSA000001", name: "Centro de Salud Chihuahua Centro", stateId: "chih", municipality: "Chihuahua" },
  { clues: "CHSSA000002", name: "Centro de Salud Ciudad Juárez Este", stateId: "chih", municipality: "Juárez" },
  { clues: "CHSSA000003", name: "Centro de Salud Ciudad Juárez Oeste", stateId: "chih", municipality: "Juárez" },

  // CDMX
  { clues: "DFSSA000001", name: "Centro de Salud Dr. José Castro Villagrana", stateId: "cdmx", municipality: "Benito Juárez" },
  { clues: "DFSSA000002", name: "Centro de Salud T-III Portales", stateId: "cdmx", municipality: "Benito Juárez" },
  { clues: "DFSSA000003", name: "Centro de Salud Milpa Alta", stateId: "cdmx", municipality: "Milpa Alta" },
  { clues: "DFSSA000004", name: "Centro de Salud Iztapalapa Norte", stateId: "cdmx", municipality: "Iztapalapa" },

  // Coahuila
  { clues: "CLSSA000001", name: "Centro de Salud Saltillo Centro", stateId: "coah", municipality: "Saltillo" },
  { clues: "CLSSA000002", name: "Centro de Salud Torreón Norte", stateId: "coah", municipality: "Torreón" },

  // Colima
  { clues: "CMSSA000101", name: "Centro de Salud Colima Centro", stateId: "col", municipality: "Colima" },
  { clues: "CMSSA000102", name: "Centro de Salud Manzanillo", stateId: "col", municipality: "Manzanillo" },

  // Durango
  { clues: "DGSSA000001", name: "Centro de Salud Victoria de Durango", stateId: "dgo", municipality: "Durango" },
  { clues: "DGSSA000002", name: "Centro de Salud Gómez Palacio", stateId: "dgo", municipality: "Gómez Palacio" },

  // Guanajuato
  { clues: "GTSSA000001", name: "Centro de Salud León Centro", stateId: "gto", municipality: "León" },
  { clues: "GTSSA000002", name: "Centro de Salud Irapuato", stateId: "gto", municipality: "Irapuato" },
  { clues: "GTSSA000003", name: "Centro de Salud Celaya", stateId: "gto", municipality: "Celaya" },

  // Guerrero
  { clues: "GRSSA000001", name: "Centro de Salud Acapulco Centro", stateId: "gro", municipality: "Acapulco" },
  { clues: "GRSSA000002", name: "Centro de Salud Chilpancingo", stateId: "gro", municipality: "Chilpancingo" },

  // Hidalgo
  { clues: "HGSSA000001", name: "Centro de Salud Pachuca Norte", stateId: "hgo", municipality: "Pachuca" },
  { clues: "HGSSA000002", name: "Centro de Salud Tulancingo", stateId: "hgo", municipality: "Tulancingo" },

  // Jalisco
  { clues: "JCSSA000001", name: "Centro de Salud Guadalajara Centro", stateId: "jal", municipality: "Guadalajara" },
  { clues: "JCSSA000002", name: "Centro de Salud Zapopan Norte", stateId: "jal", municipality: "Zapopan" },
  { clues: "JCSSA000003", name: "Centro de Salud Puerto Vallarta", stateId: "jal", municipality: "Puerto Vallarta" },

  // Estado de México
  { clues: "MCSSA000001", name: "Centro de Salud Toluca Centro", stateId: "mex", municipality: "Toluca" },
  { clues: "MCSSA000002", name: "Centro de Salud Ecatepec Norte", stateId: "mex", municipality: "Ecatepec" },
  { clues: "MCSSA000003", name: "Centro de Salud Naucalpan", stateId: "mex", municipality: "Naucalpan" },

  // Michoacán
  { clues: "MCSSA000101", name: "Centro de Salud Morelia Centro", stateId: "mich", municipality: "Morelia" },
  { clues: "MCSSA000102", name: "Centro de Salud Uruapan", stateId: "mich", municipality: "Uruapan" },

  // Morelos
  { clues: "MRSSA000001", name: "Centro de Salud Cuernavaca Centro", stateId: "mor", municipality: "Cuernavaca" },
  { clues: "MRSSA000002", name: "Centro de Salud Cuautla", stateId: "mor", municipality: "Cuautla" },

  // Nayarit
  { clues: "NTSSA000001", name: "Centro de Salud Tepic Centro", stateId: "nay", municipality: "Tepic" },
  { clues: "NTSSA000002", name: "Centro de Salud Bahía de Banderas", stateId: "nay", municipality: "Bahía de Banderas" },

  // Nuevo León
  { clues: "NLSSA000001", name: "Centro de Salud Monterrey Centro", stateId: "nl", municipality: "Monterrey" },
  { clues: "NLSSA000002", name: "Centro de Salud San Nicolás de los Garza", stateId: "nl", municipality: "San Nicolás" },
  { clues: "NLSSA000003", name: "Centro de Salud Guadalupe", stateId: "nl", municipality: "Guadalupe" },

  // Oaxaca
  { clues: "OCSSA000001", name: "Centro de Salud Oaxaca de Juárez", stateId: "oax", municipality: "Oaxaca" },
  { clues: "OCSSA000002", name: "Centro de Salud Salina Cruz", stateId: "oax", municipality: "Salina Cruz" },

  // Puebla
  { clues: "PLSSA000001", name: "Centro de Salud Puebla Centro", stateId: "pue", municipality: "Puebla" },
  { clues: "PLSSA000002", name: "Centro de Salud Tehuacán", stateId: "pue", municipality: "Tehuacán" },
  { clues: "PLSSA000003", name: "Centro de Salud San Martín Texmelucan", stateId: "pue", municipality: "San Martín Texmelucan" },

  // Querétaro
  { clues: "QTSSA000001", name: "Centro de Salud Querétaro Centro", stateId: "qro", municipality: "Querétaro" },
  { clues: "QTSSA000002", name: "Centro de Salud San Juan del Río", stateId: "qro", municipality: "San Juan del Río" },

  // Quintana Roo
  { clues: "QRSSA000001", name: "Centro de Salud Cancún Norte", stateId: "qroo", municipality: "Benito Juárez" },
  { clues: "QRSSA000002", name: "Centro de Salud Chetumal", stateId: "qroo", municipality: "Othón P. Blanco" },

  // San Luis Potosí
  { clues: "SPSSA000001", name: "Centro de Salud San Luis Potosí Centro", stateId: "slp", municipality: "San Luis Potosí" },
  { clues: "SPSSA000002", name: "Centro de Salud Ciudad Valles", stateId: "slp", municipality: "Ciudad Valles" },

  // Sinaloa
  { clues: "SLSSA000001", name: "Centro de Salud Culiacán Centro", stateId: "sin", municipality: "Culiacán" },
  { clues: "SLSSA000002", name: "Centro de Salud Mazatlán", stateId: "sin", municipality: "Mazatlán" },
  { clues: "SLSSA000003", name: "Centro de Salud Los Mochis", stateId: "sin", municipality: "Ahome" },

  // Sonora
  { clues: "SRSSA000001", name: "Centro de Salud Hermosillo Centro", stateId: "son", municipality: "Hermosillo" },
  { clues: "SRSSA000002", name: "Centro de Salud Nogales", stateId: "son", municipality: "Nogales" },
  { clues: "SRSSA000003", name: "Centro de Salud Ciudad Obregón", stateId: "son", municipality: "Cajeme" },

  // Tabasco
  { clues: "TCSSA000001", name: "Centro de Salud Villahermosa Centro", stateId: "tab", municipality: "Centro" },
  { clues: "TCSSA000002", name: "Centro de Salud Cárdenas", stateId: "tab", municipality: "Cárdenas" },

  // Tamaulipas
  { clues: "TSSSA000001", name: "Centro de Salud Tampico", stateId: "tamps", municipality: "Tampico" },
  { clues: "TSSSA000002", name: "Centro de Salud Reynosa", stateId: "tamps", municipality: "Reynosa" },
  { clues: "TSSSA000003", name: "Centro de Salud Matamoros", stateId: "tamps", municipality: "Matamoros" },

  // Tlaxcala
  { clues: "TLSSA000001", name: "Centro de Salud Tlaxcala Centro", stateId: "tlax", municipality: "Tlaxcala" },
  { clues: "TLSSA000002", name: "Centro de Salud Apizaco", stateId: "tlax", municipality: "Apizaco" },

  // Veracruz
  { clues: "VRSSA000001", name: "Centro de Salud Veracruz Puerto", stateId: "ver", municipality: "Veracruz" },
  { clues: "VRSSA000002", name: "Centro de Salud Xalapa Norte", stateId: "ver", municipality: "Xalapa" },
  { clues: "VRSSA000003", name: "Centro de Salud Coatzacoalcos", stateId: "ver", municipality: "Coatzacoalcos" },

  // Yucatán
  { clues: "YCSSA000001", name: "Centro de Salud Mérida Centro", stateId: "yuc", municipality: "Mérida" },
  { clues: "YCSSA000002", name: "Centro de Salud Valladolid", stateId: "yuc", municipality: "Valladolid" },

  // Zacatecas
  { clues: "ZCSSA000001", name: "Centro de Salud Zacatecas Centro", stateId: "zac", municipality: "Zacatecas" },
  { clues: "ZCSSA000002", name: "Centro de Salud Fresnillo", stateId: "zac", municipality: "Fresnillo" },
];
