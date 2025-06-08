import cron from 'node-cron';
import { comprehensiveGovernmentScraper } from './comprehensiveGovernmentScraper';
import { revolutionaryNewsAggregator } from './revolutionaryNewsAggregator';
import { comprehensiveLegalDatabase } from './comprehensiveLegalDatabase';
import { comprehensiveAnalytics } from './comprehensiveAnalytics';
import { realTimeMonitoring } from './realTimeMonitoring';

/**
 * Master Data Orchestration System
 * Coordinates all data collection, analysis, and monitoring systems
 */
export class MasterDataOrchestrator {
  private isRunning = false;
  private lastUpdate: Date | null = null;
  private systemHealth = {
    governmentScraper: 'idle',
    newsAggregator: 'idle',
    legalDatabase: 'ready',
    analytics: 'idle',
    monitoring: 'active'
  };

  /**
   * Initialize comprehensive data collection systems
   */
  async initializeAllSystems(): Promise<void> {
    console.log('🚀 Initializing Master Data Orchestration System...');
    
    try {
      // Schedule continuous data collection
      this.scheduleDataCollection();
      
      // Start real-time monitoring
      await this.startRealTimeMonitoring();
      
      // Initial comprehensive data population
      await this.performInitialDataPopulation();
      
      console.log('✅ Master Data Orchestration System initialized successfully');
      this.isRunning = true;
      
    } catch (error) {
      console.error('❌ Failed to initialize Master Data Orchestration System:', error);
      throw error;
    }
  }

  /**
   * Schedule automated data collection from all sources
   */
  private scheduleDataCollection(): void {
    // Government data scraping - Every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      console.log('📊 Starting scheduled government data scraping...');
      try {
        this.systemHealth.governmentScraper = 'running';
        await comprehensiveGovernmentScraper.performComprehensiveScraping();
        this.systemHealth.governmentScraper = 'completed';
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('Government scraping error:', error);
        this.systemHealth.governmentScraper = 'error';
      }
    });

    // News aggregation - Every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      console.log('📰 Starting scheduled news aggregation...');
      try {
        this.systemHealth.newsAggregator = 'running';
        await revolutionaryNewsAggregator.performComprehensiveAggregation();
        this.systemHealth.newsAggregator = 'completed';
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('News aggregation error:', error);
        this.systemHealth.newsAggregator = 'error';
      }
    });

    // Analytics generation - Every hour
    cron.schedule('0 * * * *', async () => {
      console.log('📈 Starting scheduled analytics generation...');
      try {
        this.systemHealth.analytics = 'running';
        await comprehensiveAnalytics.generateComprehensiveAnalytics();
        this.systemHealth.analytics = 'completed';
      } catch (error) {
        console.error('Analytics generation error:', error);
        this.systemHealth.analytics = 'error';
      }
    });

    // System health monitoring - Every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        await realTimeMonitoring.collectMetrics();
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    });

    console.log('📅 Automated data collection schedules configured');
  }

  /**
   * Start real-time monitoring systems
   */
  private async startRealTimeMonitoring(): Promise<void> {
    try {
      this.systemHealth.monitoring = 'active';
      
      // Start continuous monitoring
      setInterval(async () => {
        try {
          await realTimeMonitoring.collectMetrics();
        } catch (error) {
          console.error('Real-time monitoring error:', error);
        }
      }, 300000); // Every 5 minutes
      
      console.log('🔍 Real-time monitoring system active');
    } catch (error) {
      console.error('Failed to start real-time monitoring:', error);
      this.systemHealth.monitoring = 'error';
    }
  }

  /**
   * Perform initial comprehensive data population
   */
  private async performInitialDataPopulation(): Promise<void> {
    console.log('🏗️ Starting initial comprehensive data population...');
    
    try {
      // Step 1: Build legal database foundation
      console.log('⚖️ Building legal database...');
      await comprehensiveLegalDatabase.buildComprehensiveLegalDatabase();
      
      // Step 2: Initial government data scraping
      console.log('🏛️ Performing initial government data scraping...');
      this.systemHealth.governmentScraper = 'running';
      await comprehensiveGovernmentScraper.performComprehensiveScraping();
      this.systemHealth.governmentScraper = 'completed';
      
      // Step 3: Initial news aggregation
      console.log('📰 Performing initial news aggregation...');
      this.systemHealth.newsAggregator = 'running';
      await revolutionaryNewsAggregator.performComprehensiveAggregation();
      this.systemHealth.newsAggregator = 'completed';
      
      // Step 4: Generate initial analytics
      console.log('📊 Generating initial analytics...');
      this.systemHealth.analytics = 'running';
      await comprehensiveAnalytics.generateComprehensiveAnalytics();
      this.systemHealth.analytics = 'completed';
      
      this.lastUpdate = new Date();
      console.log('✅ Initial data population completed successfully');
      
    } catch (error) {
      console.error('❌ Initial data population failed:', error);
      throw error;
    }
  }

  /**
   * Force comprehensive data refresh
   */
  async forceDataRefresh(): Promise<void> {
    console.log('🔄 Forcing comprehensive data refresh...');
    
    try {
      // Run all data collection systems
      await Promise.all([
        comprehensiveGovernmentScraper.performComprehensiveScraping(),
        revolutionaryNewsAggregator.performComprehensiveAggregation(),
        comprehensiveAnalytics.generateComprehensiveAnalytics()
      ]);
      
      this.lastUpdate = new Date();
      console.log('✅ Comprehensive data refresh completed');
      
    } catch (error) {
      console.error('❌ Data refresh failed:', error);
      throw error;
    }
  }

  /**
   * Get system status and health metrics
   */
  getSystemStatus(): any {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      systemHealth: this.systemHealth,
      uptime: this.isRunning ? Date.now() - (this.lastUpdate?.getTime() || Date.now()) : 0,
      activeSystems: Object.values(this.systemHealth).filter(status => status === 'active' || status === 'running').length,
      totalSystems: Object.keys(this.systemHealth).length
    };
  }

  /**
   * Emergency system shutdown
   */
  async emergencyShutdown(): Promise<void> {
    console.log('🚨 Emergency system shutdown initiated...');
    
    this.isRunning = false;
    this.systemHealth = {
      governmentScraper: 'stopped',
      newsAggregator: 'stopped',
      legalDatabase: 'stopped',
      analytics: 'stopped',
      monitoring: 'stopped'
    };
    
    console.log('🛑 Emergency shutdown completed');
  }

  /**
   * System restart
   */
  async restartSystems(): Promise<void> {
    console.log('🔄 Restarting all systems...');
    
    await this.emergencyShutdown();
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    await this.initializeAllSystems();
    
    console.log('✅ System restart completed');
  }
}

export const masterDataOrchestrator = new MasterDataOrchestrator();