import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDataSync } from "./dataSync";
import { initializeNewsAnalysis } from "./newsAnalyzer";
import { comprehensiveNewsAnalyzer } from "./comprehensiveNewsAnalyzer";
import { realTimeMonitoring } from "./realTimeMonitoring";
import { confirmedAPIs } from "./confirmedAPIs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Initialize automatic government data sync
    initializeDataSync();
    
    // Local authentication removed - using Replit Auth
    
    // Initialize confirmed government API data enhancement
    async function initializeConfirmedAPIs() {
      console.log("Initializing confirmed Canadian government APIs...");
      
      // Statistics Canada and Open Government API enhancement
      setInterval(async () => {
        try {
          await confirmedAPIs.enhanceDataWithConfirmedAPIs();
        } catch (error) {
          console.error("Government API enhancement error:", error);
        }
      }, 12 * 60 * 60 * 1000); // Every 12 hours
      
      // Initial enhancement
      setTimeout(() => {
        confirmedAPIs.enhanceDataWithConfirmedAPIs();
      }, 60000); // 1 minute delay to let scraping start first
    }
    
    // Initialize politician data enhancement
    async function initializePoliticianEnhancement() {
      console.log("Starting politician data enhancement...");
      try {
        const { politicianDataEnhancer } = await import('./politicianDataEnhancer');
        setTimeout(async () => {
          await politicianDataEnhancer.enhanceAllPoliticians();
          const stats = await politicianDataEnhancer.getEnhancementStats();
          console.log(`Politician enhancement completed: ${stats.withConstituency}/${stats.total} politicians now have constituency data (${stats.completionRate}%)`);
        }, 120000); // 2 minute delay to let initial data load
      } catch (error) {
        console.error('Error enhancing politician data:', error);
      }
    }
    
    initializeConfirmedAPIs();
    initializePoliticianEnhancement();
    
    // Initialize daily news analysis and propaganda detection
    initializeNewsAnalysis();
    
    // Start comprehensive Canadian news analysis
    console.log("Starting comprehensive Canadian news analysis system...");
    comprehensiveNewsAnalyzer.performComprehensiveAnalysis().catch(error => {
      console.error("Error in comprehensive news analysis:", error);
    });

    // Schedule regular comprehensive news analysis (every 2 hours)
    setInterval(() => {
      comprehensiveNewsAnalyzer.performComprehensiveAnalysis().catch(error => {
        console.error("Error in scheduled news analysis:", error);
      });
    }, 2 * 60 * 60 * 1000); // 2 hours
    
    // Start real-time platform monitoring
    realTimeMonitoring.startMonitoring();
    
    // Initialize comprehensive legal database
    setTimeout(() => {
      // Legal data populator removed during cleanup
    }, 5000);
    
    // Populate forum with civic discussions (disabled to prevent duplicates)
    // setTimeout(() => {
    //   forumPopulator.populateInitialDiscussions().catch(console.error);
    // }, 8000);
  });
})();
