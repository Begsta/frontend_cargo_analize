export type Cargo = {
  id: number;
  name: string;
  category: string;
  mass: number;
  dimensions: [number, number, number];
  description: string;
  image: string;
  video: string;
};

const cargoGroups = [
  { category: 'Панели', name: 'Панель стеновая' },
  { category: 'Балки', name: 'Балка железобетонная' },
  { category: 'Фундаментные блоки', name: 'Блок ФБС' },
];

const cargoNumbers = ['01', '02', '03'];

const description = [
  'Сборный железобетонный элемент.',
  'Масса и габариты используются при подборе',
  'грузоподъёмности крана и последующем расчёте цикла подъёма.',
].join(' ');

export const cargos: Cargo[] = cargoGroups.flatMap((group, groupId) => (
  cargoNumbers.map((number, itemId): Cargo => ({
    id: groupId * 3 + itemId + 1,
    name: `${group.name} ${number}`,
    category: group.category,
    mass: Number((1.2 + groupId * 0.7 + itemId * 0.4).toFixed(1)),
    dimensions: [
      3 + itemId,
      0.4 + groupId * 0.2,
      0.6 + itemId * 0.1,
    ],
    description,
    image: '',
    video: '',
  }))
));

export function getCargoVolume(cargo: Cargo): number {
  return cargo.dimensions.reduce((volume, size) => volume * size, 1);
}
