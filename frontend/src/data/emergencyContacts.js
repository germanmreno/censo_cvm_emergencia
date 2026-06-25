export const emergencyContacts = [
  {
    id: 'proteccion-civil',
    name: 'Protección Civil',
    icon: 'shield',
    phones: ['0800-5588427', '0800-2668446', '0800-2624368'],
  },
  {
    id: 'instituto-proteccion-civil',
    name: 'Instituto de Protección Civil',
    icon: 'shield',
    phones: [
      '(0212) 631.86.62',
      '(0212) 631.90.58',
      '(0212) 662.84.76',
      '(0212) 662.32.05',
      '(0212) 545.93.91',
    ],
  },
  {
    id: 'defensa-civil-alcaldia',
    name: 'Defensa Civil Alcaldía Mayor',
    icon: 'building',
    phones: ['(0212) 662.67.59', '(0212) 662.32.05'],
  },
  {
    id: 'defensa-civil-nacional',
    name: 'Defensa Civil Nacional',
    icon: 'building',
    phones: [
      '0800-28326',
      '0800-24845',
      '(0212) 483.98.05',
      '(0212) 662.22.52',
      '(0212) 662.66.19',
    ],
  },
  {
    id: 'bomberos-antimano',
    name: 'Bomberos Antímano',
    icon: 'flame',
    phones: ['(0212) 472.20.54'],
  },
  {
    id: 'bomberos-catia',
    name: 'Bomberos Catia La Mar',
    icon: 'flame',
    phones: ['(0212) 351.99.66'],
  },
  {
    id: 'bomberos-chacao',
    name: 'Bomberos Chacao',
    icon: 'flame',
    phones: ['(0212) 265.32.61'],
  },
  {
    id: 'bomberos-del-este',
    name: 'Bomberos del Este (El Cafetal)',
    icon: 'flame',
    phones: ['(0212) 987.43.34', '(0212) 985.50.60'],
  },
  {
    id: 'bomberos-sucre',
    name: 'Bomberos Sucre',
    icon: 'flame',
    phones: ['(0212) 985.36.40'],
  },
  {
    id: 'bomberos-el-cafetal',
    name: 'Bomberos El Cafetal',
    icon: 'flame',
    phones: ['(0212) 985.36.40', '(0212) 985.29.77'],
  },
  {
    id: 'bomberos-el-paraiso',
    name: 'Bomberos El Paraíso',
    icon: 'flame',
    phones: ['(0212) 481.09.61'],
  },
  {
    id: 'bomberos-el-valle',
    name: 'Bomberos El Valle',
    icon: 'flame',
    phones: ['(0212) 672.01.75', '(0212) 672.06.36'],
  },
  {
    id: 'bomberos-la-guaira',
    name: 'Bomberos La Guaira',
    icon: 'flame',
    phones: ['(0212) 332.76.20', '(0212) 331.04.45'],
  },
  {
    id: 'bomberos-la-trinidad',
    name: 'Bomberos La Trinidad',
    icon: 'flame',
    phones: ['(0212) 943.43.61'],
  },
  {
    id: 'bomberos-la-urbina',
    name: 'Bomberos La Urbina',
    icon: 'flame',
    phones: ['(0212) 241.66.41'],
  },
  {
    id: 'bomberos-metropolitanos',
    name: 'Bomberos Metropolitanos',
    icon: 'flame',
    phones: ['(0212) 545.45.45'],
  },
  {
    id: 'bomberos-miranda',
    name: 'Bomberos Miranda',
    icon: 'flame',
    phones: ['(0212) 235.69.67'],
  },
  {
    id: 'bomberos-plaza-venezuela',
    name: 'Bomberos Plaza Venezuela',
    icon: 'flame',
    phones: ['(0212) 793.00.39', '(0212) 793.64.57'],
  },
  {
    id: 'bomberos-san-bernardino',
    name: 'Bomberos San Bernardino',
    icon: 'flame',
    phones: ['(0212) 577.92.09'],
  },
];

export function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
