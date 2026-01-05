import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  moloni_id: number; // Novo campo para o ID do Moloni
  name: string;
  genre: string;
  description: string;
  stock_moloni: number;
  stock_online: number;
  price: number;
  imageUrl: string;
  imageHint: string;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  password?: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string;
  registrationDate: string;
  sap_id: string | null;
  points_saldo: number;
  avatarUrl: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'Pago' | 'Processing' | 'Shipped' | 'Cancelled';
  invoiceId: string | null;
  date: string;
  total: number;
  items: { productName: string; quantity: number }[];
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
};

const gameImages = PlaceHolderImages.filter(img => img.id.startsWith('game-'));

export const products: Product[] = [
  {
    id: 'PROD001',
    moloni_id: 217868710,
    name: 'Cyberpunk 2077',
    genre: 'RPG',
    description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Improved and featuring all-new free additional content, customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades.',
    stock_moloni: 50,
    stock_online: 48,
    price: 59.99,
    imageUrl: gameImages.find(img => img.id === 'game-1')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-1')?.imageHint || '',
  },
  {
    id: 'PROD002',
    moloni_id: 217868713,
    name: 'Elden Ring',
    genre: 'Fantasy',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.',
    stock_moloni: 1,
    stock_online: 1,
    price: 69.99,
    imageUrl: gameImages.find(img => img.id === 'game-2')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-2')?.imageHint || '',
  },
  {
    id: 'PROD003',
    moloni_id: 217868718,
    name: 'Starfield',
    genre: 'Sci-Fi',
    description: 'Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4. In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom as you embark on an epic journey to answer humanity’s greatest mystery.',
    stock_moloni: 120,
    stock_online: 120,
    price: 69.99,
    imageUrl: gameImages.find(img => img.id === 'game-3')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-3')?.imageHint || '',
  },
  {
    id: 'PROD004',
    moloni_id: 217868721,
    name: 'Forza Horizon 5',
    genre: 'Racing',
    description: 'Your ultimate Horizon adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars. Lead breathtaking expeditions across a world of striking contrast and beauty.',
    stock_moloni: 200,
    stock_online: 195,
    price: 59.99,
    imageUrl: gameImages.find(img => img.id === 'game-4')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-4')?.imageHint || '',
  },
  {
    id: 'PROD005',
    moloni_id: 217868723,
    name: 'EA Sports FC 24',
    genre: 'Sports',
    description: 'EA SPORTS FC™ 24 welcomes you to The World’s Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and a revolutionised Frostbite™ Engine. It features an unparalleled roster of players, teams, and leagues.',
    stock_moloni: 300,
    stock_online: 250,
    price: 64.99,
    imageUrl: gameImages.find(img => img.id === 'game-5')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-5')?.imageHint || '',
  },
  {
    id: 'PROD006',
    moloni_id: 217868728,
    name: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    description: 'You are Geralt of Rivia, mercenary monster slayer. At your disposal is every tool of the trade: razor-sharp swords, lethal mixtures, stealthy crossbows, and powerful combat magic. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.',
    stock_moloni: 75,
    stock_online: 70,
    price: 39.99,
    imageUrl: gameImages.find(img => img.id === 'game-6')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-6')?.imageHint || '',
  },
  {
    id: 'PROD007',
    moloni_id: 217868733,
    name: 'Red Dead Redemption 2',
    genre: 'Action-Adventure',
    description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, Red Dead Redemption 2 is an epic tale of honor and loyalty at the dawn of the modern age. America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.',
    stock_moloni: 60,
    stock_online: 55,
    price: 49.99,
    imageUrl: gameImages.find(img => img.id === 'game-7')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-7')?.imageHint || '',
  },
  {
    id: 'PROD008',
    moloni_id: 217868738,
    name: 'Helldivers 2',
    genre: 'Shooter',
    description: 'The Galaxy’s Last Line of Offence. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter. Urgent broadcast – Super Earth Armed Forces. Freedom. Peace. Democracy. Your Super Earth-born rights. The key pillars of our civilization. Are under attack from deadly alien civilizations, conspiring to destroy the Super Earth and its values.',
    stock_moloni: 150,
    stock_online: 140,
    price: 39.99,
    imageUrl: gameImages.find(img => img.id === 'game-8')?.imageUrl || '',
    imageHint: gameImages.find(img => img.id === 'game-8')?.imageHint || '',
  },
  {
    id: 'PROD009',
    moloni_id: 217868741,
    name: 'Steam Gift Card 10€',
    genre: 'Gift Card',
    description: 'The easiest way to give the gift of games. Steam Gift Cards are an easy way to put money into your own Steam Wallet or give the perfect gift of games to your friend or family member.',
    stock_moloni: 1000,
    stock_online: 1000,
    price: 10.00,
    imageUrl: gameImages.find(img => img.id === 'game-9')?.imageUrl || '',
    imageHint: 'gift card',
  },
  {
    id: 'PROD010',
    moloni_id: 217868742,
    name: 'Steam Gift Card 20€',
    genre: 'Gift Card',
    description: 'The easiest way to give the gift of games. Steam Gift Cards are an easy way to put money into your own Steam Wallet or give the perfect gift of games to your friend or family member.',
    stock_moloni: 1000,
    stock_online: 1000,
    price: 20.00,
    imageUrl: gameImages.find(img => img.id === 'game-9')?.imageUrl || '',
    imageHint: 'gift card',
  },
  {
    id: 'PROD011',
    moloni_id: 217868747,
    name: 'Steam Gift Card 50€',
    genre: 'Gift Card',
    description: 'The easiest way to give the gift of games. Steam Gift Cards are an easy way to put money into your own Steam Wallet or give the perfect gift of games to your friend or family member.',
    stock_moloni: 500,
    stock_online: 500,
    price: 50.00,
    imageUrl: gameImages.find(img => img.id === 'game-9')?.imageUrl || '',
    imageHint: 'gift card',
  },
];

export const customers: Customer[] = [
  {
    id: 'CUST001',
    firstName: 'Ana',
    lastName: 'Silva',
    nickname: 'Aninha',
    email: 'ana.silva@example.com',
    password: 'password123',
    nif: '258369147',
    address: 'Rua das Flores 123',
    postalCode: '1200-193',
    city: 'Lisboa',
    registrationDate: '2023-01-15',
    sap_id: 'SAP-10394A',
    points_saldo: 1250,
    avatarUrl: 'https://picsum.photos/seed/c1/100/100',
  },
  {
    id: 'CUST002',
    firstName: 'Bruno',
    lastName: 'Martins',
    nickname: 'Bmart',
    email: 'bruno.martins@example.com',
    password: 'password123',
    nif: '214587963',
    address: 'Avenida da Liberdade 45',
    postalCode: '4000-322',
    city: 'Porto',
    registrationDate: '2023-03-22',
    sap_id: 'SAP-11487B',
    points_saldo: 500,
    avatarUrl: 'https://picsum.photos/seed/c2/100/100',
  },
  {
    id: 'CUST003',
    firstName: 'Carla',
    lastName: 'Costa',
    nickname: 'CC',
    email: 'carla.costa@example.com',
    password: 'password123',
    nif: '298741256',
    address: 'Praça do Comércio 78',
    postalCode: '3000-116',
    city: 'Coimbra',
    registrationDate: '2024-05-10',
    sap_id: null,
    points_saldo: 75,
    avatarUrl: 'https://picsum.photos/seed/c3/100/100',
  },
  {
    id: 'CUST004',
    firstName: 'Diogo',
    lastName: 'Ferreira',
    nickname: 'Digo',
    email: 'diogo.ferreira@example.com',
    password: 'password123',
    nif: '236985147',
    address: 'Rua de Santa Catarina 90',
    postalCode: '4750-333',
    city: 'Braga',
    registrationDate: '2024-06-01',
    sap_id: 'SAP-13998D',
    points_saldo: 2300,
    avatarUrl: 'https://picsum.photos/seed/c4/100/100',
  },
  {
    id: 'CUST005',
    firstName: 'Pedro',
    lastName: 'Machado',
    nickname: 'Tó',
    email: 'topedromachado@gmail.com',
    password: '1234567',
    nif: '123456789',
    address: 'Rua da Teste, 123',
    postalCode: '1000-001',
    city: 'Lisboa',
    registrationDate: '2024-07-31',
    sap_id: null,
    points_saldo: 0,
    avatarUrl: 'https://picsum.photos/seed/c5/100/100',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Ana Silva',
    customerEmail: 'ana.silva@example.com',
    status: 'Shipped',
    invoiceId: 'FR2024/00123',
    date: '2024-07-28',
    total: 59.99,
    items: [{ productName: 'Cyberpunk 2077', quantity: 1 }],
  },
  {
    id: 'ORD002',
    customerName: 'Bruno Martins',
    customerEmail: 'bruno.martins@example.com',
    status: 'Processing',
    invoiceId: 'FR2024/00124',
    date: '2024-07-29',
    total: 109.98,
    items: [
      { productName: 'Elden Ring', quantity: 1 },
      { productName: 'Starfield', quantity: 1 },
    ],
  },
  {
    id: 'ORD003',
    customerName: 'Diogo Ferreira',
    customerEmail: 'diogo.ferreira@example.com',
    status: 'Pago',
    invoiceId: null,
    date: '2024-07-30',
    total: 69.99,
    items: [{ productName: 'Forza Horizon 5', quantity: 1 }],
  },
  {
    id: 'ORD004',
    customerName: 'Ana Silva',
    customerEmail: 'ana.silva@example.com',
    status: 'Shipped',
    invoiceId: 'FR2024/00119',
    date: '2024-07-25',
    total: 39.99,
    items: [{ productName: 'The Witcher 3: Wild Hunt', quantity: 1 }],
  },
];

export const salesData = [
    { date: '2024-07-01', 'Total Sales': 2400 },
    { date: '2024-07-02', 'Total Sales': 1398 },
    { date: '2024-07-03', 'Total Sales': 9800 },
    { date: '2024-07-04', 'Total Sales': 3908 },
    { date: '2024-07-05', 'Total Sales': 4800 },
    { date: '2024-07-06', 'Total Sales': 3800 },
    { date: '2024-07-07', 'Total Sales': 4300 },
];

export const suppliers: Supplier[] = [
  {
    id: 'SUP001',
    name: 'GamerSource',
    contactPerson: 'Ricardo Marques',
    email: 'ricardo@gamersource.com',
    phone: '912345678',
  },
  {
    id: 'SUP002',
    name: 'DigitalDreams',
    contactPerson: 'Sofia Almeida',
    email: 'sofia@digitaldreams.pt',
    phone: '934567890',
  },
  {
    id: 'SUP003',
    name: 'PixelPerfect',
    contactPerson: 'João Costa',
    email: 'joao@pixelperfect.pt',
    phone: '965678901',
  },
];