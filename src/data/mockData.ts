import { CityHub, DriverPartner, VehicleOption } from '../types/logistics';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'courier',
    name: 'Metro Courier (Car / EV)',
    subTitle: 'Express Doorstep Courier & Small Parcels',
    tagline: 'Best for urgent documents, retail orders, electronics, keys',
    capacityKg: 35,
    dimensions: '50cm x 50cm x 50cm boot parcel',
    baseFare: 16.5,
    baseKm: 3,
    perKmRate: 2.2,
    helperFee: 0,
    etaMins: 4,
    iconType: 'courier',
    popularFor: 'Fastest urban delivery in CBD'
  },
  {
    id: 'cargo_van',
    name: 'Cargo Van (Toyota HiAce)',
    subTitle: 'New Zealand\'s #1 Choice for Urban Freight',
    tagline: 'Ideal for 15-20 cartons, small appliances, trades supplies',
    capacityKg: 1000,
    dimensions: '3.0m (L) x 1.6m (W) x 1.4m (H)',
    baseFare: 45.0,
    baseKm: 4,
    perKmRate: 3.4,
    helperFee: 35.0,
    etaMins: 6,
    iconType: 'van',
    popularFor: 'E-commerce, wholesale & store deliveries'
  },
  {
    id: 'ute_flatdeck',
    name: 'Flat Deck Ute (Hilux / Ranger)',
    subTitle: 'Open Wellside & Flat Deck 1-Tonne Carrier',
    tagline: 'Plywood, landscaping, timber, surfboards, whiteware appliances',
    capacityKg: 1100,
    dimensions: '2.4m (L) x 1.8m (W) flat open tray',
    baseFare: 55.0,
    baseKm: 4,
    perKmRate: 3.8,
    helperFee: 40.0,
    etaMins: 7,
    iconType: 'ute',
    popularFor: 'Building materials, tradies & hardware'
  },
  {
    id: 'box_truck_2t',
    name: '2-Tonne Box Truck + Tail Lift',
    subTitle: 'Enclosed Pantech Truck with Hydraulic Lift',
    tagline: 'Palletized commercial cargo, beds, bulky sofas, store stock',
    capacityKg: 2200,
    dimensions: '4.2m (L) x 2.1m (W) x 2.2m (H)',
    baseFare: 89.0,
    baseKm: 5,
    perKmRate: 4.6,
    helperFee: 50.0,
    etaMins: 10,
    iconType: 'truck',
    popularFor: 'Heavy retail & multi-pallet transport'
  },
  {
    id: 'heavy_truck_5t',
    name: '5-Tonne Freight Truck (Curtainsider)',
    subTitle: 'Heavy Commercial Inter-Suburban Hauler',
    tagline: 'Up to 10 standard CHEP pallets, machinery, industrial orders',
    capacityKg: 5000,
    dimensions: '6.5m (L) x 2.4m (W) x 2.4m (H)',
    baseFare: 145.0,
    baseKm: 5,
    perKmRate: 6.2,
    helperFee: 65.0,
    etaMins: 15,
    iconType: 'heavy',
    popularFor: 'Factory, warehouse and distribution'
  },
  {
    id: 'packers_movers',
    name: 'Kiwi House Relocations',
    subTitle: 'Full Home & Apartment Moving with 2 Movers',
    tagline: 'Moving blankets, straps, tail-lift truck, disassembly & care',
    capacityKg: 2500,
    dimensions: 'Enclosed Truck + 2 Professional Movers',
    baseFare: 195.0,
    baseKm: 5,
    perKmRate: 5.5,
    helperFee: 80.0,
    etaMins: 18,
    iconType: 'movers',
    popularFor: 'Stress-free home & flat shifting'
  }
];

export const CITY_HUBS: CityHub[] = [
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
