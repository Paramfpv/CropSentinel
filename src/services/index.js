import * as api from './api';
import * as mockApi from './mockApi';
import { USE_MOCK_DATA } from '../config/environment';
import { demoState } from '../config/demoState';

const wrapService = (funcName) => {
  return async (...args) => {
    const isDemo = demoState.get().isDemoMode;
    if (USE_MOCK_DATA || isDemo) {
      return mockApi[funcName](...args);
    }
    try {
      return await api[funcName](...args);
    } catch (error) {
      console.warn(`API call ${funcName} failed, falling back to mock:`, error);
      return mockApi[funcName](...args);
    }
  };
};

export const login = wrapService('login');
export const fetchFarms = wrapService('fetchFarms');
export const createFarm = wrapService('createFarm');
export const updateFarm = wrapService('updateFarm');
export const deleteFarm = wrapService('deleteFarm');
export const getFarmHistory = wrapService('getFarmHistory');
export const postAnalyze = wrapService('postAnalyze');
export const submitIntervention = wrapService('submitIntervention');

export const fetchDashboard = wrapService('fetchDashboard');
export const fetchAlerts = wrapService('fetchAlerts');
export const fetchAgentStatus = wrapService('fetchAgentStatus');
export const runAnalysis = wrapService('runAnalysis');

// Legacy compatibility wrappers
export const getDashboard = wrapService('getDashboard');
export const getAlerts = wrapService('getAlerts');
export const getAgentStatus = wrapService('getAgentStatus');
export const getIntervention = wrapService('getIntervention');
export const getNdviHistory = wrapService('getNdviHistory');
export const getMarketHistory = wrapService('getMarketHistory');
