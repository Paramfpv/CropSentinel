import { MOCK_ALERTS, MOCK_NDVI, MOCK_INTERVENTION } from '../constants/mockData';

// Delay helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── DEMO FARMS ───────────────────────────────────────────────────────────────
// 3 polished demo farms for hackathon judging.
// All crop_type values map to existing assets: wheat | rice | corn | sugarcane
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_FARMS = [
  {
    id: 1,
    name: 'Punjab Wheat Farm',
    crop_type: 'wheat',
    farm_health_score: 86,
    ndvi: 0.74,
    weather_risk: 0.18,
    soil_moisture: 42,
    market_risk: 0.22,
    zone_type: 'healthy',
    status: 'Crop health excellent — optimal moisture and NDVI. No intervention required.',
    recommendation: {
      action: 'Continue current irrigation schedule',
      estimated_cost: 0,
      yield_loss_risk: 0,
    },
  },
  {
    id: 2,
    name: 'Kaveri Delta Rice Farm',
    crop_type: 'rice',
    farm_health_score: 63,
    ndvi: 0.48,
    weather_risk: 0.52,
    soil_moisture: 28,
    market_risk: 0.35,
    zone_type: 'moderate',
    status: 'Moderate water stress detected — increase irrigation frequency.',
    recommendation: {
      action: 'Increase irrigation by 20% over next 5 days',
      estimated_cost: 520,
      yield_loss_risk: 9500,
    },
  },
  {
    id: 3,
    name: 'Marathwada Sugarcane Farm',
    crop_type: 'sugarcane',
    farm_health_score: 41,
    ndvi: 0.22,
    weather_risk: 0.78,
    soil_moisture: 11,
    market_risk: 0.61,
    zone_type: 'drought',
    status: 'Severe drought stress — immediate irrigation required to prevent yield loss.',
    recommendation: {
      action: 'Irrigate within 24 hours — critical moisture deficit',
      estimated_cost: 1400,
      yield_loss_risk: 52000,
    },
  },
];

// Active demo farm index (0 = healthy, 1 = moderate, 2 = high-risk)
// For hackathon demo: cycle through farms or start with high-risk for impact
const ACTIVE_FARM_INDEX = 2;

export const fetchDashboard = async () => {
  await delay(600);
  const farm = DEMO_FARMS[ACTIVE_FARM_INDEX];
  return {
    farm: {
      id: farm.id,
      name: farm.name,
      crop_type: farm.crop_type,
    },
    farm_health_score: farm.farm_health_score,
    ndvi: farm.ndvi,
    weather_risk: farm.weather_risk,
    soil_moisture: farm.soil_moisture,
    market_risk: farm.market_risk,
    last_updated: new Date().toISOString(),
    recommendation: farm.recommendation,
  };
};

export const fetchAlerts = async () => {
  await delay(600);
  return [
    {
      id: 1,
      message: 'Irrigate within 24 hours — critical moisture deficit',
      timestamp: new Date().toISOString(),
      status: 'sent',
    },
    {
      id: 2,
      message: 'Increase irrigation by 20% over next 5 days',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'sent',
    },
  ];
};

export const fetchAgentStatus = async () => {
  await delay(400);
  return {
    satellite: 'completed',
    weather: 'completed',
    soil: 'completed',
    market: 'completed',
    intervention: 'completed',
    alert: 'completed',
  };
};

export const runAnalysis = async () => {
  await delay(800);
  return {
    status: 'started',
  };
};

// Legacy compatibility exports
export const getDashboard = fetchDashboard;
export const getAlerts = fetchAlerts;
export const getAgentStatus = fetchAgentStatus;
export const getIntervention = async () => {
  await delay(500);
  return MOCK_INTERVENTION;
};
export const getNdviHistory = async () => {
  await delay(500);
  return MOCK_NDVI;
};
export const getMarketHistory = async () => {
  await delay(500);
  return [
    { day: 'Mon', price: 6200 },
    { day: 'Tue', price: 6250 },
    { day: 'Wed', price: 6300 },
    { day: 'Thu', price: 6150 },
    { day: 'Fri', price: 6400 },
    { day: 'Sat', price: 6350 },
    { day: 'Sun', price: 6500 },
  ];
};
