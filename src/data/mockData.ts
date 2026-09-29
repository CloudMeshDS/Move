import { CityHub, DriverPartner, VehicleOption } from '../types/logistics';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: '2_wheeler',
    name: '2 Wheeler',
    subTitle: 'Express 2-Wheeler Delivery',
    tagline: 'Best for urgent documents, clothes, food, parcels, keys',
    capacityKg: 20,
    dimensions: '40cm x 40cm box',
    baseFare: 41.0,
    baseKm: 1,
    perKmRate: 12.0,
    helperFee: 0,
    etaMins: 1,
    iconType: 'bike',
    popularFor: 'Fastest doorstep delivery in city',
    dimensionTag: '40 CM'
  },
  {
    id: 'scooter',
    name: 'Scooter',
    subTitle: 'Eco-friendly Electric Scooter Courier',
    tagline: 'Ideal for packages, electronics, lunch boxes, retail orders',
    capacityKg: 20,
    dimensions: '45cm x 45cm trunk',
    baseFare: 75.0,
    baseKm: 2,
    perKmRate: 14.0,
    helperFee: 0,
    etaMins: 3,
    iconType: 'scooter',
    popularFor: 'Quick city courier with EV zero-emission',
    badge: 'New'
  },
  {
    id: '3_wheeler',
    name: '3 Wheeler',
    subTitle: 'Reliable 3 Wheeler Cargo Auto',
    tagline: 'Medium cartons, wholesale supplies, electrical appliances',
    capacityKg: 500,
    dimensions: '1.6m x 1.2m x 1.1m open carrier',
    baseFare: 337.0,
    baseKm: 3,
    perKmRate: 22.0,
    helperFee: 100.0,
    etaMins: 1,
    iconType: '3wheeler',
    popularFor: 'City market & local commercial shifting'
  },
  {
    id: 'e_loader',
    name: 'E Loader',
    subTitle: 'Electric 3-Wheeler Cargo Loader',
    tagline: 'Eco-friendly urban freight carrier with high torque',
    capacityKg: 310,
    dimensions: '1.5m x 1.1m x 1.0m tray',
    baseFare: 266.0,
    baseKm: 2,
    perKmRate: 18.0,
    helperFee: 80.0,
    etaMins: 8,
    iconType: 'eloader',
    popularFor: 'Low cost, zero emission commercial transit'
  },
  {
    id: 'tata_ace',
    name: 'Tata Ace (Chota Hathi)',
    subTitle: 'India\'s #1 Choice for Goods Transport',
    tagline: 'Bulky furniture, up to 30 cartons, hardware, trades supplies',
    capacityKg: 750,
    dimensions: '2.1m x 1.4m x 1.3m cargo bed',
    baseFare: 450.0,
    baseKm: 4,
    perKmRate: 28.0,
    helperFee: 150.0,
    etaMins: 5,
    iconType: 'truck',
    popularFor: 'Wholesale, electronics, house shifting'
  },
  {
    id: '10ft',
    name: '10ft Truck',
    subTitle: 'Large Enclosed Commercial Container',
    tagline: 'Bulky machinery, event equipment, industrial pallet freight',
    capacityKg: 1700,
    dimensions: '3.0m x 1.8m x 1.8m container',
    baseFare: 862.0,
    baseKm: 4,
    perKmRate: 38.0,
    helperFee: 250.0,
    etaMins: 11,
    iconType: 'truck',
    popularFor: 'Large warehouse & factory logistics',
    badge: 'New'
  },
  {
    id: 'packers_movers',
    name: 'Packers & Movers',
    subTitle: 'Professional House & Office Relocation',
    tagline: 'Trained movers, bubble wrap, dismantling & safe placement',
    capacityKg: 2500,
    dimensions: 'Enclosed Truck + 2 Helpers',
    baseFare: 1250.0,
    baseKm: 5,
    perKmRate: 45.0,
    helperFee: 350.0,
    etaMins: 15,
    iconType: 'movers',
    popularFor: 'Stress-free home shifting & packing'
  }
];

export const CITY_HUBS: CityHub[] = [
  {
    id: 'gurugram',
    name: 'Gurugram (NCR)',
    state: 'Haryana',
    center: { x: 50, y: 50 },
    popularLandmarks: [
      {
        x: 48,
        y: 28,
        name: 'Sector 48, Gurugram',
        address: 'B1, B2, B3, Sector 48, Gurugram, Haryana 122018, India',
        area: 'Sector 48',
        city: 'Gurugram'
      },
      {
        x: 52,
        y: 45,
        name: '505, Iris Tech Park',
        address: 'Iris Tech Park, Sector 48, Gurugram, Haryana, India',
        area: 'Iris Tech Park',
        city: 'Gurugram'
      },
      {
        x: 60,
        y: 50,
        name: 'Artemis Hospital Gurgaon',
        address: 'Sector 51, Gurugram, Haryana, India',
        area: 'Sector 51',
        city: 'Gurugram'
      },
      {
        x: 35,
        y: 65,
        name: '402, Udyog Vihar III',
        address: 'Sector 20, Gurugram, Haryana 122022, India',
        area: 'Udyog Vihar',
        city: 'Gurugram'
      },
      {
        x: 70,
        y: 80,
        name: 'Signature Global Synera 81',
        address: 'Sector 81, Gurugram, Haryana, India',
        area: 'Sector 81',
        city: 'Gurugram'
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    center: { x: 52, y: 48 },
    popularLandmarks: [
      {
        x: 50,
        y: 40,
        name: 'Connaught Place',
        address: 'Radial Road, Connaught Place, New Delhi 110001',
        area: 'CP Central',
        city: 'Delhi'
      },
      {
        x: 65,
        y: 60,
        name: 'Okhla Industrial Area Phase III',
        address: 'Okhla Phase 3, New Delhi 110020',
        area: 'Okhla',
        city: 'Delhi'
      }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: { x: 45, y: 55 },
    popularLandmarks: [
      {
        x: 46,
        y: 45,
        name: 'Bandra Kurla Complex (BKC)',
        address: 'G Block, BKC, Bandra East, Mumbai 400051',
        area: 'BKC',
        city: 'Mumbai'
      },
      {
        x: 42,
        y: 35,
        name: 'Andheri East MIDC',
        address: 'Central Road, Andheri East, Mumbai 400093',
        area: 'Andheri East',
        city: 'Mumbai'
      }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: { x: 55, y: 52 },
    popularLandmarks: [
      {
        x: 50,
        y: 50,
        name: 'Koramangala 4th Block',
        address: '80 Feet Road, Koramangala, Bengaluru 560034',
        area: 'Koramangala',
        city: 'Bengaluru'
      },
      {
        x: 65,
        y: 40,
        name: 'Whitefield Tech Park',
        address: 'ITPL Main Road, Whitefield, Bengaluru 560066',
        area: 'Whitefield',
        city: 'Bengaluru'
      }
    ]
  },
  {
    id: 'auckland',
    name: 'Auckland (Tāmaki Makaurau)',
    state: 'North Island',
    center: { x: 50, y: 50 },
    popularLandmarks: [
      {
        x: 48,
        y: 28,
        name: 'Auckland CBD - Queen Street',
        address: '205 Queen St, Auckland Central, Auckland 1010',
        area: 'Auckland Central',
        city: 'Auckland'
      },
      {
        x: 52,
        y: 45,
        name: 'Penrose Industrial Freight Hub',
        address: 'Industry Road, Penrose, Auckland 1061',
        area: 'Penrose',
        city: 'Auckland'
      },
      {
        x: 68,
        y: 54,
        name: 'East Tāmaki Logistics Park',
        address: 'Highbrook Drive, East Tāmaki, Auckland 2013',
        area: 'East Tāmaki',
        city: 'Auckland'
      },
      {
        x: 54,
        y: 72,
        name: 'Auckland Airport Cargo Precinct',
        address: 'George Bolt Memorial Dr, Mangere, Auckland 2022',
        area: 'Mangere / Airport',
        city: 'Auckland'
      },
      {
        x: 28,
        y: 34,
        name: 'Rosebank Road Industrial Zone',
        address: 'Rosebank Rd, Avondale, Auckland 1026',
        area: 'Avondale / West',
        city: 'Auckland'
      },
      {
        x: 44,
        y: 12,
        name: 'Albany Commercial Centre',
        address: 'Don McKinnon Dr, Albany, Auckland 0632',
        area: 'North Shore',
        city: 'Auckland'
      },
      {
        x: 58,
        y: 84,
        name: 'Wiri Freight Terminal & Inland Port',
        address: 'Wiri Station Rd, Manukau, Auckland 2104',
        area: 'Manukau South',
        city: 'Auckland'
      }
    ]
  },
  {
    id: 'wellington',
    name: 'Wellington (Te Whanganui-a-Tara)',
    state: 'North Island',
    center: { x: 50, y: 50 },
    popularLandmarks: [
      {
        x: 44,
        y: 35,
        name: 'Lambton Quay CBD & Waterfront',
        address: '120 Lambton Quay, Wellington 6011',
        area: 'Wellington Central',
        city: 'Wellington'
      },
      {
        x: 62,
        y: 48,
        name: 'Petone Commercial & Trade Hub',
        address: 'Jackson Street, Petone, Lower Hutt 5012',
        area: 'Lower Hutt',
        city: 'Wellington'
      },
      {
        x: 48,
        y: 68,
        name: 'Wellington International Airport Cargo',
        address: 'Stewart Duff Dr, Rongotai, Wellington 6022',
        area: 'Rongotai / Kilbirnie',
        city: 'Wellington'
      },
      {
        x: 35,
        y: 22,
        name: 'Porirua Commercial City Centre',
        address: 'Norrie Street, Porirua 5022',
        area: 'Porirua',
        city: 'Wellington'
      }
    ]
  },
  {
    id: 'christchurch',
    name: 'Christchurch (Ōtautahi)',
    state: 'South Island',
    center: { x: 50, y: 50 },
    popularLandmarks: [
      {
        x: 50,
        y: 42,
        name: 'Christchurch Central CBD (Cathedral Sq)',
        address: 'Colombo Street, Christchurch Central 8011',
        area: 'CBD Central',
        city: 'Christchurch'
      },
      {
        x: 35,
        y: 56,
        name: 'Wigram Business & Logistics Park',
        address: 'Vickers Crescent, Wigram, Christchurch 8025',
        area: 'Wigram',
        city: 'Christchurch'
      },
      {
        x: 28,
        y: 68,
        name: 'Hornby Industrial Freight Terminal',
        address: 'Waterloo Road, Hornby, Christchurch 8042',
        area: 'Hornby',
        city: 'Christchurch'
      },
      {
        x: 38,
        y: 28,
        name: 'Christchurch Airport Logistics Precinct',
        address: 'Durey Road, Harewood, Christchurch 8053',
        area: 'Harewood / Airport',
        city: 'Christchurch'
      }
    ]
  }
];

export const INITIAL_DRIVERS: DriverPartner[] = [
  {
    id: 'drv-101',
    name: 'Liam McKenzie',
    phone: '+64 21 849 2011',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'cargo_van',
    vehicleName: 'Toyota HiAce LWB Diesel',
    vehiclePlate: 'KWT892',
    rating: 4.92,
    totalTrips: 1140,
    status: 'online_idle',
    currentLocation: { x: 50, y: 44, area: 'Penrose' },
    heading: 45,
    todayEarnings: 285.5,
    walletBalance: 840.0,
    acceptanceRate: 98,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  },
  {
    id: 'drv-102',
    name: 'Wiremu Te Kanawa',
    phone: '+64 22 419 8832',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'ute_flatdeck',
    vehicleName: 'Ford Ranger XLT Flat Deck',
    vehiclePlate: 'NZR441',
    rating: 4.88,
    totalTrips: 920,
    status: 'online_idle',
    currentLocation: { x: 49, y: 32, area: 'Queen Street CBD' },
    heading: 120,
    todayEarnings: 320.0,
    walletBalance: 960.5,
    acceptanceRate: 96,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  },
  {
    id: 'drv-103',
    name: 'James Wilson',
    phone: '+64 27 655 4910',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'box_truck_2t',
    vehicleName: 'Isuzu Elf 2.5T Box + Dhollandia Tail-Lift',
    vehiclePlate: 'ELF719',
    rating: 4.95,
    totalTrips: 1480,
    status: 'online_idle',
    currentLocation: { x: 67, y: 52, area: 'East Tāmaki' },
    heading: 260,
    todayEarnings: 450.0,
    walletBalance: 1420.0,
    acceptanceRate: 97,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  },
  {
    id: 'drv-104',
    name: 'Sophie Patel',
    phone: '+64 21 334 7720',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'courier',
    vehicleName: 'Hyundai Ioniq EV Courier',
    vehiclePlate: 'EVQ801',
    rating: 4.96,
    totalTrips: 760,
    status: 'online_idle',
    currentLocation: { x: 46, y: 26, area: 'CBD Waterfront' },
    heading: 90,
    todayEarnings: 195.0,
    walletBalance: 610.0,
    acceptanceRate: 99,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  },
  {
    id: 'drv-105',
    name: 'Craig Morrison',
    phone: '+64 21 902 4431',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'heavy_truck_5t',
    vehicleName: 'Fuso Canter 5-Tonne Curtainsider',
    vehiclePlate: 'HVI558',
    rating: 4.84,
    totalTrips: 680,
    status: 'online_idle',
    currentLocation: { x: 56, y: 74, area: 'Airport Freight' },
    heading: 180,
    todayEarnings: 580.0,
    walletBalance: 1850.0,
    acceptanceRate: 93,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  },
  {
    id: 'drv-106',
    name: 'Moana & Dave (Kiwi Relocations)',
    phone: '+64 22 710 3982',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'packers_movers',
    vehicleName: 'Hino 300 Furniture Truck + 2 Helpers',
    vehiclePlate: 'MVE204',
    rating: 4.98,
    totalTrips: 540,
    status: 'online_idle',
    currentLocation: { x: 26, y: 35, area: 'Avondale' },
    heading: 300,
    todayEarnings: 720.0,
    walletBalance: 2450.0,
    acceptanceRate: 99,
    kycStatus: 'approved',
    documents: { drivingLicense: true, vehicleCof: true, vehicleRego: true, goodsInsurance: true }
  }
];

export const GOODS_TYPES = [
  { id: 'cartons', label: 'Carton Boxes & Retail Parcels', icon: 'Package' },
  { id: 'tradie', label: 'Tradie Supplies & Timber / Hardware', icon: 'Wrench' },
  { id: 'furniture', label: 'Furniture (Bed, Lounge Suite, Table)', icon: 'Armchair' },
  { id: 'whiteware', label: 'Whiteware (Fridge, Washing Machine, Dryer)', icon: 'Tv' },
  { id: 'pallets', label: 'Commercial CHEP Pallets & Freight', icon: 'Truck' },
  { id: 'urgent', label: 'Urgent Documents / Legal Pack', icon: 'FileText' },
  { id: 'fragile', label: 'Glassware & Delicate Items', icon: 'AlertTriangle' }
];
