import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { useLogistics } from '../../context/LogisticsContext';
import { CITY_HUBS } from '../../data/mockData';
import { VehicleCategoryId, MapPoint } from '../../types/logistics';
import { sound } from '../../utils/audio';

export function RNCustomerApp() {
  const {
    currentCity,
    setCurrentCity,
    vehicleOptions,
    calculateFare,
    createBooking,
    activeOrder,
    orders,
    advanceOrderStage,
    loadQuickDemoOrder,
    liveTelemetry,
    liveTheme,
    liveTrafficTicker,
    theme
  } = useLogistics();

  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'book' | 'packers' | 'tracking' | 'history'>('book');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategoryId>('cargo_van');
  const [pickup, setPickup] = useState<MapPoint>(currentCity.popularLandmarks[0]);
  const [drop, setDrop] = useState<MapPoint>(currentCity.popularLandmarks[1]);
  const [helperCount, setHelperCount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'poli' | 'cash'>('card');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  // Packers & Movers state
  const [moveType, setMoveType] = useState<string>('2_bedroom');
  const [boxesCount, setBoxesCount] = useState<number>(10);
  const [furnitureItems, setFurnitureItems] = useState<{ [key: string]: number }>({
    sofa: 1,
    bed: 2,
    dining: 1,
    fridge: 1,
    washer: 1
  });

  // Calculate live fare using exact MapPoints
  const fareBreakdown = calculateFare(
    selectedVehicle,
    pickup,
    drop,
    helperCount,
    promoDiscount
  );

  const selectedVehicleObj = vehicleOptions.find((v) => v.id === selectedVehicle) || vehicleOptions[0];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'KIWIFREIGHT' || promoCode.trim().toUpperCase() === 'KIWI10') {
      setPromoDiscount(15);
      setPromoApplied(true);
      sound.playSuccessChime();
    } else {
      setPromoDiscount(5);
      setPromoApplied(true);
      sound.playSuccessChime();
    }
  };

  const handleCreateBooking = () => {
    sound.playDispatchPing();
    createBooking({
      vehicleType: selectedVehicle,
      pickup,
      drop,
      goodsType: `${selectedVehicleObj.name} Freight Dispatch`,
      helperCount,
      paymentMethod
    });
    setActiveTab('tracking');
  };

  return (
    <View style={[styles.container, isLight && { backgroundColor: '#f8fafc' }]}>
      {/* React Native Carrier & Telemetry Status Bar */}
      <View style={[styles.nativeCarrierBar, isLight && { backgroundColor: '#ffffff', borderBottomColor: '#e2e8f0' }]}>
        <View style={styles.carrierLeft}>
          <Text style={[styles.carrierText, isLight && { color: '#0284c7' }]}>Spark 5G NZ</Text>
          <View style={styles.liveIndicatorBadge}>
            <View style={styles.liveLedDot} />
            <Text style={styles.liveLedText}>LIVE</Text>
          </View>
        </View>
        <Text style={[styles.nativeClockText, isLight && { color: '#0f172a' }]}>{liveTelemetry.nzTimeStr.slice(0, 8)}</Text>
        <View style={styles.carrierRight}>
          <Text style={styles.telemetrySatelliteText}>🛰️ 14 SATS</Text>
          <Text style={[styles.batteryText, isLight && { color: '#64748b' }]}>98%</Text>
        </View>
      </View>

      {/* Top React Native App Bar */}
      <View style={[styles.appBar, isLight && { backgroundColor: '#ffffff', borderBottomColor: '#e2e8f0' }]}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={[styles.brandTitle, isLight && { color: '#0f172a' }]}>MOVE</Text>
              <View style={styles.rnBadge}>
                <Text style={styles.rnBadgeText}>REACT NATIVE</Text>
              </View>
            </View>
            <Text style={styles.citySubtitle}>{currentCity.name}, New Zealand</Text>
          </View>
        </View>

        {/* Right: Wallet Balance */}
        <View style={styles.walletBox}>
          <Text style={styles.walletLabel}>NZD Wallet</Text>
          <Text style={styles.walletValue}>$142.50</Text>
        </View>
      </View>

      {/* Live Advisory Strip */}
      <View style={styles.liveAdvisoryStrip}>
        <Text style={styles.liveAdvisoryText}>
          🟢 LIVE DISPATCH: 18 Drivers patrolling {currentCity.name} · SH1 Flow Normal
        </Text>
      </View>

      {/* Navigation Sub-Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'book' && styles.tabButtonActive]}
          onPress={() => setActiveTab('book')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'book' && styles.tabTextActive]}>
            Book Freight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'packers' && styles.tabButtonActive]}
          onPress={() => setActiveTab('packers')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'packers' && styles.tabTextActive]}>
            House Relocation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'tracking' && styles.tabButtonActive]}
          onPress={() => setActiveTab('tracking')}
          activeOpacity={0.7}
        >
          <View style={styles.trackingTabWrap}>
            <Text style={[styles.tabText, activeTab === 'tracking' && styles.tabTextActive]}>
              Live Tracking
            </Text>
            {activeOrder && <View style={styles.livePulseDot} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content Views */}
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        {/* TAB 1: BOOK FREIGHT */}
        {activeTab === 'book' && (
          <View>
            {/* Quick Demo Pre-seed Button */}
            <TouchableOpacity
              style={styles.quickFillBanner}
              onPress={loadQuickDemoOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.quickFillText}>⚡ Quick Demo: Pre-fill Auckland Sample Order</Text>
            </TouchableOpacity>

            {/* City Hub Switcher Chips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Select Operating Territory</Text>
              <View style={styles.chipsRow}>
                {CITY_HUBS.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.cityChip,
                      currentCity.id === city.id && styles.cityChipActive
                    ]}
                    onPress={() => {
                      setCurrentCity(city);
                      setPickup(city.popularLandmarks[0]);
                      setDrop(city.popularLandmarks[1]);
                    }}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        currentCity.id === city.id && styles.cityChipTextActive
                      ]}
                    >
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Address Selection Card */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Pickup & Drop Addresses</Text>

              {/* Pickup Input */}
              <View style={styles.addressBox}>
                <View style={[styles.addressIndicator, { backgroundColor: '#10b981' }]} />
                <View style={styles.addressInputWrap}>
                  <Text style={styles.addressLabel}>PICKUP LOCATION</Text>
                  <Text style={styles.addressValueText}>{pickup.name}</Text>
                  <Text style={styles.addressSubText}>{pickup.address}</Text>
                </View>
              </View>

              {/* Drop Input */}
              <View style={[styles.addressBox, { marginTop: 10 }]}>
                <View style={[styles.addressIndicator, { backgroundColor: '#ef4444' }]} />
                <View style={styles.addressInputWrap}>
                  <Text style={styles.addressLabel}>DELIVERY DESTINATION</Text>
                  <Text style={styles.addressValueText}>{drop.name}</Text>
                  <Text style={styles.addressSubText}>{drop.address}</Text>
                </View>
              </View>

              {/* Quick Landmark Hotspots */}
              <Text style={styles.hotspotTitle}>Quick Hubs in {currentCity.name}:</Text>
              <View style={styles.chipsRow}>
                {currentCity.popularLandmarks.slice(0, 4).map((landmark, idx) => (
                  <TouchableOpacity
                    key={landmark.name}
                    style={styles.landmarkChip}
                    onPress={() => {
                      if (idx % 2 === 0) {
                        setPickup(landmark);
                      } else {
                        setDrop(landmark);
                      }
                    }}
                  >
                    <Text style={styles.landmarkChipText}>{landmark.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vehicle Fleet Selector */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionTitle}>NZ Logistics Fleet</Text>
                <Text style={styles.distanceBadge}>{fareBreakdown.distanceKm} km trip</Text>
              </View>

              {vehicleOptions.map((vehicle) => {
                const isSelected = selectedVehicle === vehicle.id;
                const vFare = calculateFare(
                  vehicle.id,
                  pickup,
                  drop,
                  helperCount,
                  promoDiscount
                );

                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
                    onPress={() => setSelectedVehicle(vehicle.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.vehicleRow}>
                      <View style={styles.vehicleIconContainer}>
                        <Text style={styles.vehicleIconEmoji}>
                          {vehicle.id === 'courier' ? '🚗' : vehicle.id === 'cargo_van' ? '🚐' : vehicle.id === 'ute_flatdeck' ? '🛻' : '🚚'}
                        </Text>
                      </View>

                      <View style={styles.vehicleInfo}>
                        <View style={styles.vehicleNameRow}>
                          <Text style={styles.vehicleName}>{vehicle.name}</Text>
                          {isSelected && (
                            <View style={styles.activeCheck}>
                              <Text style={styles.activeCheckText}>SELECTED</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.vehicleSub}>{vehicle.subTitle}</Text>
                        <View style={styles.specChipsRow}>
                          <Text style={styles.specChip}>Max {vehicle.capacityKg} kg</Text>
                          <Text style={styles.specChip}>{vehicle.dimensions}</Text>
                          <Text style={styles.specChip}>ETA {vehicle.etaMins}m</Text>
                        </View>
                      </View>

                      <View style={styles.vehiclePriceBox}>
                        <Text style={styles.vehiclePrice}>${vFare.totalFare.toFixed(2)}</Text>
                        <Text style={styles.gstTag}>incl. 15% GST</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add-ons & Transit Protection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Transit Extras & NZ Coverage</Text>

              {/* Helper */}
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setHelperCount(helperCount > 0 ? 0 : 1)}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.toggleTitle}>Driver Loading Assistant (+1 Helper)</Text>
                  <Text style={styles.toggleSub}>Driver assists with lifting & ground transport</Text>
                </View>
                <View style={[styles.toggleCheckbox, helperCount > 0 && styles.toggleCheckboxActive]}>
                  {helperCount > 0 && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>

            {/* Promo Code & Discounts */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Promotions & Vouchers</Text>
              <View style={styles.promoRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Enter KIWIFREIGHT or KIWI10"
                  placeholderTextColor="#64748b"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyPromo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyBtnText}>{promoApplied ? 'APPLIED' : 'APPLY'}</Text>
                </TouchableOpacity>
              </View>
              {promoApplied && (
                <Text style={styles.promoSuccessText}>
                  ✓ NZD Promo Applied! You saved ${promoDiscount.toFixed(2)}
                </Text>
              )}
            </View>

            {/* Payment Method Selector */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>NZ Payment Method</Text>
              <View style={styles.paymentMethodRow}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'card' && styles.paymentOptionActive
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <Text style={styles.paymentOptionTitle}>💳 Card</Text>
                  <Text style={styles.paymentOptionSub}>Visa / Mastercard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'apple_pay' && styles.paymentOptionActive
                  ]}
                  onPress={() => setPaymentMethod('apple_pay')}
                >
                  <Text style={styles.paymentOptionTitle}> Apple Pay</Text>
                  <Text style={styles.paymentOptionSub}>1-Tap Express</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'poli' && styles.paymentOptionActive
                  ]}
                  onPress={() => setPaymentMethod('poli')}
                >
                  <Text style={styles.paymentOptionTitle}>🏦 POLi Pay</Text>
                  <Text style={styles.paymentOptionSub}>Direct NZ Bank</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Breakdown Summary */}
            <View style={styles.fareSummaryCard}>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Base + Distance ({fareBreakdown.distanceKm} km)</Text>
                <Text style={styles.fareValue}>
                  ${(fareBreakdown.baseFare + fareBreakdown.distanceFare).toFixed(2)}
                </Text>
              </View>
              {fareBreakdown.helperFare > 0 && (
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Driver Helper Fee</Text>
                  <Text style={styles.fareValue}>${fareBreakdown.helperFare.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>NZ GST (15%)</Text>
                <Text style={styles.fareValue}>${fareBreakdown.gstTax.toFixed(2)}</Text>
              </View>
              {fareBreakdown.discount > 0 && (
                <View style={styles.fareRow}>
                  <Text style={[styles.fareLabel, { color: '#10b981' }]}>Discount Voucher</Text>
                  <Text style={[styles.fareValue, { color: '#10b981' }]}>
                    -${fareBreakdown.discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total Payable (NZD)</Text>
                  <Text style={styles.totalSub}>GST Inclusive · No hidden fees</Text>
                </View>
                <Text style={styles.totalAmount}>${fareBreakdown.totalFare.toFixed(2)}</Text>
              </View>
            </View>

            {/* Submit Booking CTA */}
            <TouchableOpacity
              style={styles.bookCtaBtn}
              onPress={handleCreateBooking}
              activeOpacity={0.8}
            >
              <Text style={styles.bookCtaText}>
                BOOK NOW · ${fareBreakdown.totalFare.toFixed(2)} NZD
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 2: PACKERS & MOVERS */}
        {activeTab === 'packers' && (
          <View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Kiwi Relocations & House Shifting</Text>
              <Text style={styles.cardSub}>
                Full-service home and commercial shifting across New Zealand with packing, loading, and transit protection.
              </Text>

              <Text style={[styles.addressLabel, { marginTop: 14 }]}>HOME SIZE CONFIGURATION</Text>
              <View style={styles.chipsRow}>
                {[
                  { id: '1_bedroom', label: '1 Bed Flat / Studio' },
                  { id: '2_bedroom', label: '2 Bedroom Home' },
                  { id: '3_bedroom', label: '3 Bedroom Villa' },
                  { id: '4_bedroom', label: '4+ Bed Family Home' }
                ].map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.cityChip,
                      moveType === size.id && styles.cityChipActive
                    ]}
                    onPress={() => setMoveType(size.id)}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        moveType === size.id && styles.cityChipTextActive
                      ]}
                    >
                      {size.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Major Items Counter */}
              <Text style={[styles.addressLabel, { marginTop: 14 }]}>INVENTORY ESTIMATE</Text>
              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Heavy Moving Boxes</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setBoxesCount(Math.max(0, boxesCount - 5))}
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{boxesCount}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setBoxesCount(boxesCount + 5)}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Beds & Mattresses</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() =>
                      setFurnitureItems({ ...furnitureItems, bed: Math.max(0, (furnitureItems.bed || 0) - 1) })
                    }
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{furnitureItems.bed || 0}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() =>
                      setFurnitureItems({ ...furnitureItems, bed: (furnitureItems.bed || 0) + 1 })
                    }
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Sofas & Lounge Sets</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() =>
                      setFurnitureItems({ ...furnitureItems, sofa: Math.max(0, (furnitureItems.sofa || 0) - 1) })
                    }
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{furnitureItems.sofa || 0}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() =>
                      setFurnitureItems({ ...furnitureItems, sofa: (furnitureItems.sofa || 0) + 1 })
                    }
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Estimate Box */}
              <View style={styles.estimateBanner}>
                <View>
                  <Text style={styles.estimateLabel}>Estimated Move Cost (Auckland Metro)</Text>
                  <Text style={styles.estimateSub}>Includes 2 dedicated movers & 2T Box Truck</Text>
                </View>
                <Text style={styles.estimatePrice}>$385.00 NZD</Text>
              </View>

              <TouchableOpacity
                style={styles.bookCtaBtn}
                onPress={() => {
                  sound.playSuccessChime();
                  Alert.alert('Move Reserved', 'Our New Zealand relocation coordinator will contact you to confirm packing materials.');
                }}
              >
                <Text style={styles.bookCtaText}>SCHEDULE PACKERS & MOVERS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: LIVE TRACKING */}
        {activeTab === 'tracking' && (
          <View>
            {activeOrder ? (
              <View>
                {/* Active Tracking Header Banner */}
                <View style={styles.trackingHeaderCard}>
                  <View style={styles.orderIdRow}>
                    <Text style={styles.orderNumber}>{activeOrder.trackingNumber}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>
                        {activeOrder.status.toUpperCase().replace('_', ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* 4-digit Delivery Handover OTP */}
                  <View style={styles.otpBanner}>
                    <View>
                      <Text style={styles.otpLabel}>Delivery Verification OTP</Text>
                      <Text style={styles.otpSub}>Share with driver at pickup</Text>
                    </View>
                    <View style={styles.otpPill}>
                      <Text style={styles.otpCode}>{activeOrder.otp}</Text>
                    </View>
                  </View>

                  {/* Driver Profile */}
                  <View style={styles.driverProfileBox}>
                    <Image
                      source={{ uri: activeOrder.driverPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' }}
                      style={styles.driverAvatar}
                    />
                    <View style={styles.driverTextDetails}>
                      <Text style={styles.driverName}>{activeOrder.driverName || 'Wiremu Kingi'}</Text>
                      <Text style={styles.driverPlate}>
                        {activeOrder.driverVehiclePlate || 'KWT892'} · {activeOrder.vehicleName}
                      </Text>
                      <Text style={styles.driverComplianceBadge}>✓ Class 1/2 NZTA Approved</Text>
                    </View>
                  </View>

                  {/* Live Transit Telemetry HUD Card */}
                  <View style={styles.liveTelemetryCard}>
                    <View style={styles.liveTelemetryHead}>
                      <View style={styles.liveIndicatorBadge}>
                        <View style={styles.liveLedDot} />
                        <Text style={styles.liveLedText}>LIVE RADAR TELEMETRY</Text>
                      </View>
                      <Text style={styles.liveTelemetrySat}>14 Sats Locked</Text>
                    </View>
                    <View style={styles.liveTelemetryGrid}>
                      <View style={styles.liveTelemetryItem}>
                        <Text style={styles.liveTelemetryLabel}>Transit Speed</Text>
                        <Text style={styles.liveTelemetryVal}>52 km/h</Text>
                      </View>
                      <View style={styles.liveTelemetryItem}>
                        <Text style={styles.liveTelemetryLabel}>Heading</Text>
                        <Text style={styles.liveTelemetryVal}>142° SE (SH1)</Text>
                      </View>
                      <View style={styles.liveTelemetryItem}>
                        <Text style={styles.liveTelemetryLabel}>GPS Latency</Text>
                        <Text style={styles.liveTelemetryVal}>{liveTelemetry.latencyMs}ms RTK</Text>
                      </View>
                      <View style={styles.liveTelemetryItem}>
                        <Text style={styles.liveTelemetryLabel}>Arrival ETA</Text>
                        <Text style={styles.liveTelemetryVal}>~{activeOrder.estimatedArrivalMins} mins</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Route Information */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Delivery Route Details</Text>
                  <View style={styles.routeItem}>
                    <Text style={styles.routeDotGreen}>●</Text>
                    <View style={styles.routeTextWrap}>
                      <Text style={styles.routePointTitle}>Pickup Location</Text>
                      <Text style={styles.routePointName}>{activeOrder.pickup.name}</Text>
                    </View>
                  </View>

                  <View style={[styles.routeItem, { marginTop: 12 }]}>
                    <Text style={styles.routeDotRed}>●</Text>
                    <View style={styles.routeTextWrap}>
                      <Text style={styles.routePointTitle}>Destination</Text>
                      <Text style={styles.routePointName}>{activeOrder.drop.name}</Text>
                    </View>
                  </View>
                </View>

                {/* Stage Progression & Simulator Controls */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Trip Simulator & Advance Stage</Text>
                  <Text style={styles.cardSub}>
                    Test the delivery lifecycle in real-time. Advance through driver arrival, pickup, and delivery.
                  </Text>

                  <TouchableOpacity
                    style={styles.advanceStageBtn}
                    onPress={() => advanceOrderStage(activeOrder.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.advanceStageText}>
                      Advance to Next Stage ➔
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.noOrderBox}>
                <Text style={styles.noOrderIcon}>📦</Text>
                <Text style={styles.noOrderTitle}>No Active Delivery Order</Text>
                <Text style={styles.noOrderSub}>
                  You don't have an active trip currently in progress. Create a booking to start live tracking.
                </Text>
                <TouchableOpacity
                  style={[styles.bookCtaBtn, { marginTop: 16 }]}
                  onPress={() => setActiveTab('book')}
                >
                  <Text style={styles.bookCtaText}>CREATE NEW BOOKING</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* TAB 4: TRIP HISTORY */}
        {activeTab === 'history' && (
          <View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Past Delivery Trips & GST Invoices</Text>
              {orders.length === 0 ? (
                <Text style={styles.cardSub}>No trip history yet.</Text>
              ) : (
                orders.map((o) => (
                  <View key={o.id} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTracking}>{o.trackingNumber}</Text>
                      <Text style={styles.historyPrice}>${o.fare.totalFare.toFixed(2)} NZD</Text>
                    </View>
                    <Text style={styles.historyRoute}>
                      {o.pickup.name} ➔ {o.drop.name}
                    </Text>
                    <View style={styles.historyFooter}>
                      <Text style={styles.historyStatus}>
                        {o.status.toUpperCase().replace('_', ' ')}
                      </Text>
                      <Text style={styles.historyGst}>Incl. 15% NZ GST</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e17'
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14
  },
  rnBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)'
  },
  rnBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '700'
  },
  citySubtitle: {
    color: '#94a3b8',
    fontSize: 11
  },
  walletBox: {
    alignItems: 'flex-end',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  walletLabel: {
    color: '#94a3b8',
    fontSize: 10
  },
  walletValue: {
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: 12
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0b1322',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabButtonActive: {
    borderBottomColor: '#2563eb'
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700'
  },
  trackingTabWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981'
  },
  scrollContent: {
    flex: 1
  },
  scrollInner: {
    padding: 14,
    paddingBottom: 40
  },
  quickFillBanner: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center'
  },
  quickFillText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  cardSub: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155'
  },
  cityChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6'
  },
  cityChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  cityChipTextActive: {
    color: '#ffffff',
    fontWeight: '700'
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090e17',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  addressIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10
  },
  addressInputWrap: {
    flex: 1
  },
  addressLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 2
  },
  addressValueText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  addressSubText: {
    color: '#94a3b8',
    fontSize: 10
  },
  textInput: {
    color: '#ffffff',
    fontSize: 12,
    paddingVertical: 2
  },
  hotspotTitle: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4
  },
  landmarkChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  landmarkChipText: {
    color: '#cbd5e1',
    fontSize: 10
  },
  distanceBadge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700'
  },
  vehicleCard: {
    backgroundColor: '#0b1322',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  vehicleCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)'
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vehicleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  vehicleIconEmoji: {
    fontSize: 22
  },
  vehicleInfo: {
    flex: 1
  },
  vehicleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  vehicleName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  activeCheck: {
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  activeCheckText: {
    color: '#60a5fa',
    fontSize: 8,
    fontWeight: '800'
  },
  vehicleSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1
  },
  specChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4
  },
  specChip: {
    color: '#64748b',
    fontSize: 9,
    backgroundColor: '#1e293b',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  vehiclePriceBox: {
    alignItems: 'flex-end',
    marginLeft: 8
  },
  vehiclePrice: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  gstTag: {
    color: '#64748b',
    fontSize: 8
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0b1322',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  toggleTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  toggleSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2
  },
  toggleCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleCheckboxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb'
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8
  },
  applyBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  promoSuccessText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6
  },
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8
  },
  paymentOption: {
    flex: 1,
    backgroundColor: '#0b1322',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  paymentOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)'
  },
  paymentOptionTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  paymentOptionSub: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2
  },
  fareSummaryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  fareLabel: {
    color: '#94a3b8',
    fontSize: 11
  },
  fareValue: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 8
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  totalSub: {
    color: '#64748b',
    fontSize: 9
  },
  totalAmount: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '900'
  },
  bookCtaBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  bookCtaText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  counterLabel: {
    color: '#e2e8f0',
    fontSize: 12
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  counterValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center'
  },
  estimateBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginVertical: 14
  },
  estimateLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  estimateSub: {
    color: '#94a3b8',
    fontSize: 9
  },
  estimatePrice: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '800'
  },
  trackingHeaderCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderNumber: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  statusBadgeText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '800'
  },
  otpBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8
  },
  otpLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  otpSub: {
    color: '#94a3b8',
    fontSize: 9
  },
  otpPill: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  otpCode: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2
  },
  driverProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#38bdf8'
  },
  driverTextDetails: {
    flex: 1
  },
  driverName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  driverPlate: {
    color: '#94a3b8',
    fontSize: 11
  },
  driverComplianceBadge: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  routeDotGreen: {
    color: '#10b981',
    fontSize: 16,
    marginRight: 8
  },
  routeDotRed: {
    color: '#ef4444',
    fontSize: 16,
    marginRight: 8
  },
  routeTextWrap: {
    flex: 1
  },
  routePointTitle: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700'
  },
  routePointName: {
    color: '#ffffff',
    fontSize: 12
  },
  advanceStageBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10
  },
  advanceStageText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  noOrderBox: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  noOrderIcon: {
    fontSize: 40,
    marginBottom: 10
  },
  noOrderTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6
  },
  noOrderSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18
  },
  historyCard: {
    backgroundColor: '#0b1322',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  historyTracking: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  historyPrice: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 12
  },
  historyRoute: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 6
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 6
  },
  historyStatus: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '700'
  },
  historyGst: {
    color: '#64748b',
    fontSize: 9
  },
  nativeCarrierBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#050c18',
    borderBottomWidth: 1,
    borderBottomColor: '#102238'
  },
  carrierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  carrierText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700'
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 4
  },
  liveLedDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#10b981'
  },
  liveLedText: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  nativeClockText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace'
  },
  carrierRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  telemetrySatelliteText: {
    color: '#38bdf8',
    fontSize: 9,
    fontFamily: 'monospace'
  },
  batteryText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700'
  },
  liveAdvisoryStrip: {
    backgroundColor: '#091827',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#172e4a'
  },
  liveAdvisoryText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center'
  },
  liveTelemetryCard: {
    backgroundColor: '#061324',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0284c7'
  },
  liveTelemetryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  liveTelemetrySat: {
    color: '#38bdf8',
    fontSize: 9,
    fontFamily: 'monospace'
  },
  liveTelemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  liveTelemetryItem: {
    alignItems: 'center'
  },
  liveTelemetryLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  liveTelemetryVal: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: 2
  }
});
