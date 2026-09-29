import { MapPoint } from '../types/logistics';

export interface RouteCalculation {
  distanceKm: number;
  durationMins: number;
  waypoints: Array<{ x: number; y: number }>;
}

export const geoApi = {
  /**
   * Calculate real geographical distance in km between two MapPoints
   * (Uses scaled projection calibrated to urban hub coordinates)
   */
  calculateDistance(pickup: MapPoint, drop: MapPoint): number {
    const dx = drop.x - pickup.x;
    const dy = drop.y - pickup.y;
    // Scaled factor: 100% of urban map width represents approx 35km urban zone
    const rawDist = Math.sqrt(dx * dx + dy * dy);
    const distanceKm = Math.max(1.8, Math.round((rawDist * 0.38) * 10) / 10);
    return distanceKm;
  },

  /**
   * Estimate travel duration in minutes based on distance and urban traffic factor
   */
  estimateDuration(distanceKm: number, vehicleBaseEta: number = 5): number {
    // Average urban velocity: approx 32 km/h with traffic lights
    const driveTimeMins = Math.round((distanceKm / 32) * 60);
    return Math.max(vehicleBaseEta, vehicleBaseEta + driveTimeMins);
  },

  /**
   * Generate interpolated navigation waypoints along realistic road grid paths
   */
  generateRouteWaypoints(pickup: MapPoint, drop: MapPoint, segments: number = 8): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    points.push({ x: pickup.x, y: pickup.y });

    // Generate intermediate dog-leg turns simulating urban grid roads
    const midX = pickup.x + (drop.x - pickup.x) * 0.45;
    const midY = pickup.y + (drop.y - pickup.y) * 0.55;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      // Quadratic bezier path through road vertex
      const invT = 1 - t;
      const x = Math.round(invT * invT * pickup.x + 2 * invT * t * midX + t * t * drop.x);
      const y = Math.round(invT * invT * pickup.y + 2 * invT * t * midY + t * t * drop.y);
      points.push({ x, y });
    }

    points.push({ x: drop.x, y: drop.y });
    return points;
  },

  /**
   * Calculate complete navigation route
   */
  getRoute(pickup: MapPoint, drop: MapPoint, vehicleEta: number = 5): RouteCalculation {
    const distanceKm = this.calculateDistance(pickup, drop);
    const durationMins = this.estimateDuration(distanceKm, vehicleEta);
    const waypoints = this.generateRouteWaypoints(pickup, drop);

    return {
      distanceKm,
      durationMins,
      waypoints,
    };
  },

  calculateDistanceKm(pickup: MapPoint, drop: MapPoint): number {
    return this.calculateDistance(pickup, drop);
  },

  generateRoutePoints(start: MapPoint, end: MapPoint): Array<{ x: number; y: number }> {
    return this.generateRouteWaypoints(start, end, 25);
  },
};

