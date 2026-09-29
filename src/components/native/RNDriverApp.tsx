import React, { useState, useEffect } from 'react';
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
import { sound } from '../../utils/audio';

export function RNDriverApp() {
  const {
    currentDriver,
    toggleDriverOnline,
    driverIncomingOrder,
    acceptIncomingOrder,
    rejectIncomingOrder,
    orders,
    advanceOrderStage,
    completeDelivery,
    liveTelemetry,
    liveTheme,
    liveTrafficTicker,
    theme
  } = useLogistics();

  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'duty' | 'earnings' | 'compliance'>('duty');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>('Sam Callaghan');
  const [signedConfirmed, setSignedConfirmed] = useState<boolean>(false);

  const isOnline = currentDriver.status !== 'offline';

  // Active assigned order for this driver
  const activeTrip = orders.find(
    (o) =>
      o.driverId === currentDriver.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.status !== 'searching'
  );

  const handleVerifyOtp = () => {
    if (!activeTrip) return;
    if (enteredOtp.trim() === activeTrip.otp) {
      sound.playSuccessChime();
      setOtpError(false);
      advanceOrderStage(activeTrip.id);
    } else {
      sound.playDispatchPing();
      setOtpError(true);
    }
  };

  const handleFinishDelivery = () => {
    if (!activeTrip) return;
    sound.playSuccessChime();
    completeDelivery(activeTrip.id, {
      recipientName: receiverName || 'Sam Callaghan',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg>e-POD</svg>',
      completedAt: new Date().toLocaleTimeString(),
      podPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    });
    setSignedConfirmed(false);
  };

  return (
    <View style={[styles.container, isLight && { backgroundColor: '#f8fafc' }]}>
      {/* React Native Native Status Header */}
      <View style={[styles.nativeCarrierBar, isLight && { backgroundColor: '#ffffff', borderBottomColor: '#e2e8f0' }]}>
        <View style={styles.carrierLeft}>
          <Text style={[styles.carrierText, isLight && { color: '#0284c7' }]}>Spark 5G NZ</Text>
          <View style={styles.liveIndicatorBadge}>
            <View style={[styles.liveLedDot, !isOnline && { backgroundColor: '#64748b' }]} />
            <Text style={[styles.liveLedText, !isOnline && { color: '#94a3b8' }]}>
              {isOnline ? 'LIVE RADAR' : 'STANDBY'}
            </Text>
          </View>
        </View>
        <Text style={[styles.nativeClockText, isLight && { color: '#0f172a' }]}>{liveTelemetry.nzTimeStr.slice(0, 8)}</Text>
        <View style={styles.carrierRight}>
          <Text style={styles.telemetrySatelliteText}>🛰️ RTK-FIX</Text>
          <Text style={[styles.batteryText, isLight && { color: '#64748b' }]}>96%</Text>
        </View>
      </View>

      {/* Top React Native Driver Bar */}
      <View style={[styles.appBar, isLight && { backgroundColor: '#ffffff', borderBottomColor: '#e2e8f0' }]}>
        <View style={styles.driverInfoRow}>
          <Image
            source={{ uri: currentDriver.photoUrl }}
            style={styles.driverAvatar}
          />
          <View>
            <View style={styles.driverNameRow}>
              <Text style={[styles.driverName, isLight && { color: '#0f172a' }]}>{currentDriver.name}</Text>
              <View style={styles.rnBadge}>
                <Text style={styles.rnBadgeText}>RN PARTNER</Text>
              </View>
            </View>
            <Text style={styles.driverSub}>
              {currentDriver.vehiclePlate} · ★ {currentDriver.rating} · Class 1/2 HT
            </Text>
          </View>
        </View>

        {/* Right: Duty Status Pill */}
        <TouchableOpacity
          style={[styles.dutyPill, isOnline ? styles.dutyPillOnline : styles.dutyPillOffline]}
          onPress={() => toggleDriverOnline(currentDriver.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.dutyDot, isOnline ? styles.dutyDotOnline : styles.dutyDotOffline]} />
          <Text style={styles.dutyPillText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'duty' && styles.tabButtonActive]}
          onPress={() => setActiveTab('duty')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'duty' && styles.tabTextActive]}>
            Active Duty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'earnings' && styles.tabButtonActive]}
          onPress={() => setActiveTab('earnings')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.tabTextActive]}>
            Wallet (${currentDriver.todayEarnings.toFixed(2)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'compliance' && styles.tabButtonActive]}
          onPress={() => setActiveTab('compliance')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'compliance' && styles.tabTextActive]}>
            NZTA Waka Kotahi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Content */}
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        {activeTab === 'duty' && (
          <View>
            {/* Incoming Dispatch Request Modal/Card (React Native Ping) */}
            {driverIncomingOrder && driverIncomingOrder.status === 'searching' && (
              <View style={styles.incomingCard}>
                <View style={styles.incomingHeader}>
                  <Text style={styles.incomingTitle}>⚡ NEW NZ DISPATCH REQUEST</Text>
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerText}>30s</Text>
                  </View>
                </View>

                <View style={styles.earningBox}>
                  <Text style={styles.earningLabel}>Guaranteed Net Driver Payout</Text>
                  <Text style={styles.earningAmount}>
                    ${driverIncomingOrder.fare.driverEarnings.toFixed(2)} NZD
                  </Text>
                  <Text style={styles.earningSub}>80% Platform Split · Paid to NZ Bank</Text>
                </View>

                <View style={styles.routeBox}>
                  <Text style={styles.routePoint}>📍 Pickup: {driverIncomingOrder.pickup.name}</Text>
                  <Text style={styles.routePoint}>🏁 Drop: {driverIncomingOrder.drop.name}</Text>
                  <Text style={styles.routeDistance}>
                    {driverIncomingOrder.fare.distanceKm} km · {driverIncomingOrder.vehicleName}
                  </Text>
                </View>

                <View style={styles.incomingBtnRow}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => rejectIncomingOrder(driverIncomingOrder.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => acceptIncomingOrder(driverIncomingOrder.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acceptBtnText}>Accept Trip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Active Ongoing Trip View */}
            {activeTrip ? (
              <View style={styles.sectionCard}>
                <View style={styles.tripHeaderRow}>
                  <Text style={styles.tripTitle}>Active Trip · {activeTrip.trackingNumber}</Text>
                  <Text style={styles.tripEarnings}>
                    +${activeTrip.fare.driverEarnings.toFixed(2)} NZD
                  </Text>
                </View>

                <View style={styles.stepProgressContainer}>
                  <View style={styles.stepPillActive}>
                    <Text style={styles.stepPillText}>
                      STAGE: {activeTrip.status.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                {/* Customer Contact */}
                <View style={styles.customerBox}>
                  <View>
                    <Text style={styles.customerName}>{activeTrip.customerName}</Text>
                    <Text style={styles.customerPhone}>{activeTrip.customerPhone}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => Alert.alert('Calling Customer', `Dialing ${activeTrip.customerPhone}`)}
                  >
                    <Text style={styles.callBtnText}>📞 Call</Text>
                  </TouchableOpacity>
                </View>

                {/* Status-specific interactive action buttons */}
                {activeTrip.status === 'driver_assigned' && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionPrompt}>Drive to pickup location</Text>
                    <Text style={styles.actionAddress}>{activeTrip.pickup.name}</Text>
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => advanceOrderStage(activeTrip.id)}
                    >
                      <Text style={styles.primaryActionText}>CONFIRM ARRIVAL AT PICKUP ➔</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTrip.status === 'arrived_pickup' && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionPrompt}>Customer Handover Verification</Text>
                    <Text style={styles.actionSub}>Ask customer for the 4-digit Move OTP code</Text>
                    <View style={styles.otpInputRow}>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="Enter 4-digit OTP"
                        placeholderTextColor="#64748b"
                        value={enteredOtp}
                        onChangeText={setEnteredOtp}
                        keyboardType="number-pad"
                        maxLength={4}
                      />
                      <TouchableOpacity
                        style={styles.verifyOtpBtn}
                        onPress={handleVerifyOtp}
                      >
                        <Text style={styles.verifyOtpText}>VERIFY & LOAD</Text>
                      </TouchableOpacity>
                    </View>
                    {otpError && (
                      <Text style={styles.otpErrorText}>
                        Incorrect OTP code. Try {activeTrip.otp} (Test code).
                      </Text>
                    )}
                  </View>
                )}

                {activeTrip.status === 'in_transit' && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionPrompt}>Transporting Cargo in Transit</Text>
                    <Text style={styles.actionAddress}>Destination: {activeTrip.drop.name}</Text>

                    {/* Live Speedometer & Turn Guidance HUD */}
                    <View style={styles.speedometerCard}>
                      <View style={styles.speedRow}>
                        <View style={styles.speedBox}>
                          <Text style={styles.speedVal}>52</Text>
                          <Text style={styles.speedUnit}>KM/H</Text>
                        </View>
                        <View style={styles.speedLimitBox}>
                          <Text style={styles.speedLimitLabel}>LIMIT</Text>
                          <Text style={styles.speedLimitVal}>50</Text>
                        </View>
                        <View style={styles.navTurnBox}>
                          <Text style={styles.navTurnDist}>In 250m</Text>
                          <Text style={styles.navTurnInst}>Turn left on Great South Rd</Text>
                        </View>
                      </View>
                      <View style={styles.liveRoadTagRow}>
                        <Text style={styles.liveRoadTag}>SH1 Southbound · Flow: Normal</Text>
                        <Text style={styles.liveGpsTag}>GPS: RTK-FIX ±0.12m</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => advanceOrderStage(activeTrip.id)}
                    >
                      <Text style={styles.primaryActionText}>CONFIRM ARRIVAL AT DROP-OFF ➔</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTrip.status === 'arrived_drop' && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionPrompt}>e-POD Electronic Proof of Delivery</Text>
                    <Text style={styles.actionSub}>Collect recipient confirmation</Text>

                    <TextInput
                      style={styles.textInput}
                      placeholder="Receiver Full Name"
                      placeholderTextColor="#64748b"
                      value={receiverName}
                      onChangeText={setReceiverName}
                    />

                    <TouchableOpacity
                      style={[
                        styles.signToggleBtn,
                        signedConfirmed && styles.signToggleBtnActive
                      ]}
                      onPress={() => setSignedConfirmed(!signedConfirmed)}
                    >
                      <Text style={styles.signToggleText}>
                        {signedConfirmed ? '✓ Digital e-POD Signature Captured' : 'Tap to Capture Recipient Signature'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.primaryActionBtn,
                        { backgroundColor: '#10b981', marginTop: 10 }
                      ]}
                      onPress={handleFinishDelivery}
                    >
                      <Text style={styles.primaryActionText}>
                        COMPLETE DELIVERY & COLLECT PAYMENT
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              /* Idle / Standby View */
              <View style={styles.sectionCard}>
                <View style={styles.standbyHeader}>
                  <View style={[styles.radarCircle, isOnline ? styles.radarOnline : styles.radarOffline]} />
                  <View>
                    <Text style={styles.standbyTitle}>
                      {isOnline ? 'RADAR ACTIVE · SEARCHING FOR TRIPS' : 'DRIVER OFFLINE'}
                    </Text>
                    <Text style={styles.standbySub}>
                      {isOnline
                        ? 'Positioned near urban industrial freight hubs in New Zealand'
                        : 'Go online to receive high-paying delivery dispatches'}
                    </Text>
                  </View>
                </View>

                {/* Live Surge Banner */}
                {isOnline && (
                  <View style={styles.liveSurgeBanner}>
                    <Text style={styles.liveSurgeTitle}>⚡ LIVE SURGE +$4.50 ACTIVE</Text>
                    <Text style={styles.liveSurgeSub}>
                      High freight demand in {currentDriver.currentLocation.area} · 80% direct driver payout
                    </Text>
                  </View>
                )}

                {/* Today's KPI quick tiles */}
                <View style={styles.kpiRow}>
                  <View style={styles.kpiBox}>
                    <Text style={styles.kpiLabel}>Today's Trips</Text>
                    <Text style={styles.kpiValue}>{currentDriver.totalTrips}</Text>
                  </View>
                  <View style={styles.kpiBox}>
                    <Text style={styles.kpiLabel}>Today Net</Text>
                    <Text style={[styles.kpiValue, { color: '#38bdf8' }]}>
                      ${currentDriver.todayEarnings.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.kpiBox}>
                    <Text style={styles.kpiLabel}>Accept Rate</Text>
                    <Text style={[styles.kpiValue, { color: '#10b981' }]}>
                      {currentDriver.acceptanceRate}%
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 2: EARNINGS & WALLET */}
        {activeTab === 'earnings' && (
          <View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>New Zealand Partner Wallet</Text>
              <View style={styles.bigBalanceBox}>
                <Text style={styles.bigBalanceLabel}>Available Payout Balance</Text>
                <Text style={styles.bigBalanceAmount}>
                  ${currentDriver.todayEarnings.toFixed(2)} NZD
                </Text>
                <Text style={styles.bigBalanceSub}>Direct credit to ANZ / ASB / BNZ account</Text>
              </View>

              <TouchableOpacity
                style={styles.payoutBtn}
                onPress={() => {
                  sound.playSuccessChime();
                  Alert.alert('Payout Triggered', 'Funds transferred to your registered NZ bank account via direct credit.');
                }}
              >
                <Text style={styles.payoutBtnText}>INSTANT WITHDRAW TO NZ BANK</Text>
              </TouchableOpacity>

              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Trip Earnings History</Text>
              {orders.filter((o) => o.driverId === currentDriver.id).length === 0 ? (
                <Text style={styles.cardSub}>No completed trips today yet.</Text>
              ) : (
                orders
                  .filter((o) => o.driverId === currentDriver.id)
                  .map((o) => (
                    <View key={o.id} style={styles.earningItem}>
                      <View>
                        <Text style={styles.earningItemTitle}>{o.trackingNumber}</Text>
                        <Text style={styles.earningItemRoute}>
                          {o.pickup.name} ➔ {o.drop.name}
                        </Text>
                      </View>
                      <Text style={styles.earningItemAmount}>
                        +${o.fare.driverEarnings.toFixed(2)}
                      </Text>
                    </View>
                  ))
              )}
            </View>
          </View>
        )}

        {/* TAB 3: NZTA COMPLIANCE */}
        {activeTab === 'compliance' && (
          <View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Waka Kotahi (NZTA) Driver Verification</Text>
              <Text style={styles.cardSub}>
                All Move New Zealand drivers are pre-verified according to New Zealand Land Transport regulations.
              </Text>

              <View style={styles.complianceItemBox}>
                <View style={styles.complianceHeader}>
                  <Text style={styles.complianceName}>New Zealand Driver Licence</Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.complianceDetail}>
                  Licence Type: Class 1 / Class 2 Heavy Trade (HT) · Exp: 2028
                </Text>
              </View>

              <View style={styles.complianceItemBox}>
                <View style={styles.complianceHeader}>
                  <Text style={styles.complianceName}>Certificate of Fitness (COF)</Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.complianceDetail}>
                  Commercial Vehicle Inspection: Passed · Next due: Nov 2026
                </Text>
              </View>

              <View style={styles.complianceItemBox}>
                <View style={styles.complianceHeader}>
                  <Text style={styles.complianceName}>NZ Transport Services Licence (TSL)</Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.complianceDetail}>
                  Commercial Goods Transport Endorsement: Active
                </Text>
              </View>
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
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#10b981'
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  driverName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  rnBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  rnBadgeText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '700'
  },
  driverSub: {
    color: '#94a3b8',
    fontSize: 10
  },
  dutyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6
  },
  dutyPillOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981'
  },
  dutyPillOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  dutyDotOnline: {
    backgroundColor: '#10b981'
  },
  dutyDotOffline: {
    backgroundColor: '#ef4444'
  },
  dutyPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0b1322',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabButtonActive: {
    borderBottomColor: '#10b981'
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
  scrollContent: {
    flex: 1
  },
  scrollInner: {
    padding: 14,
    paddingBottom: 40
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
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
  incomingCard: {
    backgroundColor: '#0a1d37',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#2563eb'
  },
  incomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  incomingTitle: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '800'
  },
  timerBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  timerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800'
  },
  earningBox: {
    backgroundColor: '#172554',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  earningLabel: {
    color: '#93c5fd',
    fontSize: 10,
    fontWeight: '600'
  },
  earningAmount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginVertical: 2
  },
  earningSub: {
    color: '#bfdbfe',
    fontSize: 10
  },
  routeBox: {
    backgroundColor: '#090e17',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  routePoint: {
    color: '#ffffff',
    fontSize: 11,
    marginBottom: 4
  },
  routeDistance: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4
  },
  incomingBtnRow: {
    flexDirection: 'row',
    gap: 10
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  declineBtnText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700'
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  acceptBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  tripHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tripTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  tripEarnings: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800'
  },
  stepProgressContainer: {
    marginBottom: 10
  },
  stepPillActive: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  stepPillText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700'
  },
  customerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  customerName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  customerPhone: {
    color: '#94a3b8',
    fontSize: 10
  },
  callBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  actionCard: {
    backgroundColor: '#090e17',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  actionPrompt: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  actionAddress: {
    color: '#38bdf8',
    fontSize: 12,
    marginVertical: 4
  },
  actionSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 8
  },
  primaryActionBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  otpInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6
  },
  otpInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  verifyOtpBtn: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  verifyOtpText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  otpErrorText: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 4
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
    marginVertical: 6
  },
  signToggleBtn: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 6
  },
  signToggleBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981'
  },
  signToggleText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600'
  },
  standbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  radarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  radarOnline: {
    backgroundColor: '#10b981'
  },
  radarOffline: {
    backgroundColor: '#64748b'
  },
  standbyTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  standbySub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8
  },
  kpiBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  kpiLabel: {
    color: '#94a3b8',
    fontSize: 10
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2
  },
  bigBalanceBox: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8
  },
  bigBalanceLabel: {
    color: '#94a3b8',
    fontSize: 11
  },
  bigBalanceAmount: {
    color: '#38bdf8',
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 4
  },
  bigBalanceSub: {
    color: '#64748b',
    fontSize: 10
  },
  payoutBtn: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8
  },
  payoutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  earningItemTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  earningItemRoute: {
    color: '#94a3b8',
    fontSize: 10
  },
  earningItemAmount: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '800'
  },
  complianceItemBox: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  complianceName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '800'
  },
  complianceDetail: {
    color: '#94a3b8',
    fontSize: 11
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
  speedometerCard: {
    backgroundColor: '#030d1b',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#0284c7'
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  speedBox: {
    alignItems: 'center',
    backgroundColor: '#061a34',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8'
  },
  speedVal: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
    lineHeight: 24
  },
  speedUnit: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: '800'
  },
  speedLimitBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ef4444'
  },
  speedLimitLabel: {
    color: '#000000',
    fontSize: 7,
    fontWeight: '900'
  },
  speedLimitVal: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18
  },
  navTurnBox: {
    flex: 1,
    paddingLeft: 6
  },
  navTurnDist: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800'
  },
  navTurnInst: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600'
  },
  liveRoadTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#0f2744',
    paddingTop: 8,
    marginTop: 8
  },
  liveRoadTag: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '700'
  },
  liveGpsTag: {
    color: '#94a3b8',
    fontSize: 9,
    fontFamily: 'monospace'
  },
  liveSurgeBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)'
  },
  liveSurgeTitle: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '800'
  },
  liveSurgeSub: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 2
  }
});
