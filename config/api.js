import Constants from 'expo-constants'; 

const debuggerHost = Constants.expoConfig?.hostUri;

let ipAddress = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

if (ipAddress === 'localhost') {
  ipAddress = '10.0.2.2'; 
}

export const API_BASE_URL = `https://bf94xw0s-5297.asse.devtunnels.ms`;

console.log("[CONFIG] API Base URL:", API_BASE_URL);