import { useState, useEffect } from 'react';

interface DataModeConfig {
  useLiveData: boolean;
  dataSource: string;
  lastSync?: string;
}

// Global data mode configuration
const DEFAULT_CONFIG: DataModeConfig = {
  useLiveData: true,
  dataSource: "Government APIs",
  lastSync: new Date().toISOString()
};

export function useDataMode() {
  const [config, setConfig] = useState<DataModeConfig>(DEFAULT_CONFIG);

  // Check if we should use live data based on environment
  useEffect(() => {
    const isProduction = import.meta.env.MODE === 'production';
    const forceDemo = import.meta.env.VITE_FORCE_DEMO_DATA === 'true';
    
    setConfig(prev => ({
      ...prev,
      useLiveData: isProduction && !forceDemo,
      dataSource: isProduction ? "Parliament of Canada APIs" : "Demo Data Sources"
    }));
  }, []);

  const toggleDataMode = () => {
    setConfig(prev => ({
      ...prev,
      useLiveData: !prev.useLiveData,
      lastSync: prev.useLiveData ? undefined : new Date().toISOString()
    }));
  };

  return {
    ...config,
    toggleDataMode,
    isDemo: !config.useLiveData
  };
}

// Utility function to get data with fallback
export function getDataWithFallback<T>(liveData: T | null, demoData: T, useLiveData: boolean): T {
  if (!useLiveData) return demoData;
  return liveData || demoData;
}