import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { useLogistics } from '../../context/LogisticsContext';
import { VehicleOption } from '../../types/logistics';

interface RNDriverDutyProps {
  onGoToTrip?: () => void;
}

export function RNDriverDutyScreen({ onGoToTrip }: RNDriverDutyProps) {
  const { currentDriver, toggleDriverOnline, driverIncomingOrder, acceptIncomingOrder, rejectIncomingOrder } = useLogistics();
  const isOnline = currentDriver.status !== 'offline';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Native Header */}
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: currentDriver.photoUrl }} style={styles.avatar} />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{currentDriver.name}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proText}>NZ PRO</Text>
              </View>
            </View>
            <Text style={styles.driverSub}>
              {currentDriver.vehiclePlate} · ★ {currentDriver.rating}
            </Text>
          </View>
        </View>
      </View>

      {/* Duty Toggle Card (React Native View & TouchableOpacity) */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10b981' : '#64748b' }]} />
          <View style={styles.statusTextContainer}>
            <Text style={styles.cardTitle}>{isOnline ? 'DUTY ONLINE' : 'DUTY OFFLINE'}</Text>
            <Text style={styles.cardSub}>
              {isOnline ? 'Receiving local city dispatch pings' : 'You are currently hidden from dispatch'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.dutyBtn, { backgroundColor: isOnline ? '#ef4444' : '#10b981' }]}
          onPress={() => toggleDriverOnline(currentDriver.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.dutyBtnText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
        </TouchableOpacity>
      </View>

      {/* Incoming Order Card (Native Dispatch Chime) */}
      {driverIncomingOrder && driverIncomingOrder.status === 'searching' && (
        <View style={styles.incomingOrderCard}>
          <View style={styles.incomingHeader}>
            <Text style={styles.incomingTitle}>⚡ NEW NZ DISPATCH REQUEST</Text>
            <Text style={styles.countdownBadge}>30s</Text>
          </View>

          <View style={styles.earningBox}>
            <Text style={styles.earningLabel}>Guaranteed Net Earnings</Text>
            <Text style={styles.earningAmount}>
              ${driverIncomingOrder.fare.driverEarnings.toFixed(2)} NZD
            </Text>
          </View>

          <View style={styles.routeBox}>
            <Text style={styles.routePoint}>📍 Pickup: {driverIncomingOrder.pickup.name}</Text>
            <Text style={styles.routePoint}>🏁 Drop: {driverIncomingOrder.drop.name}</Text>
            <Text style={styles.routeDistance}>{driverIncomingOrder.fare.distanceKm} km · {driverIncomingOrder.vehicleName}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => rejectIncomingOrder(driverIncomingOrder.id)}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => acceptIncomingOrder(driverIncomingOrder.id)}
            >
              <Text style={styles.acceptText}>Accept Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Earnings Summary Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today's Earnings</Text>
          <Text style={styles.statValue}>${currentDriver.todayEarnings.toFixed(2)}</Text>
          <Text style={styles.statSub}>{currentDriver.totalTrips} completed trips</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Acceptance Rate</Text>
          <Text style={[styles.statValue, { color: '#38bdf8' }]}>{currentDriver.acceptanceRate}%</Text>
          <Text style={styles.statSub}>Bonus eligible</Text>
        </View>
      </View>

      {/* NZTA Waka Kotahi Compliance Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Waka Kotahi (NZTA) Compliance</Text>
        <View style={styles.complianceRow}>
          <Text style={styles.complianceItem}>✓ Class 1/2 Licence Valid</Text>
          <Text style={styles.complianceItem}>✓ Current COF Inspection</Text>
          <Text style={styles.complianceItem}>✓ NZTA Rego Active</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// React Native StyleSheet Definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e17'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2c45'
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#10b981'
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 6
  },
  proBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  proText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34d399'
  },
  driverSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  card: {
    backgroundColor: '#0f1827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e2c45'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10
  },
  statusTextContainer: {
    flex: 1
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  cardSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  dutyBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dutyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  incomingOrderCard: {
    backgroundColor: '#0f244a',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2563eb'
  },
  incomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  incomingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60a5fa'
  },
  countdownBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fbbf24',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  earningBox: {
    backgroundColor: '#090e17',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e2c45'
  },
  earningLabel: {
    fontSize: 11,
    color: '#94a3b8'
  },
  earningAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34d399',
    marginTop: 2
  },
  routeBox: {
    marginBottom: 14
  },
  routePoint: {
    fontSize: 13,
    color: '#ffffff',
    marginBottom: 4
  },
  routeDistance: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600',
    marginTop: 4
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center'
  },
  declineText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8'
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center'
  },
  acceptText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f1827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e2c45'
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34d399',
    marginVertical: 4
  },
  statSub: {
    fontSize: 11,
    color: '#64748b'
  },
  complianceRow: {
    marginTop: 10,
    gap: 6
  },
  complianceItem: {
    fontSize: 12,
    color: '#94a3b8'
  }
});
