import type { Express, RequestHandler } from "express";

/**
 * Demo authentication for local development
 * Bypasses Replit auth when running locally
 */
export function setupDemoAuth(app: Express) {
  // Demo user session
  const demoUser = {
    id: "demo-user",
    email: "demo@civicos.local",
    firstName: "Demo",
    lastName: "User",
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Demo authentication routes
  app.get('/api/auth/user', (req, res) => {
    res.json(demoUser);
  });

  app.get('/api/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    res.redirect('/');
  });
}

// Demo middleware that always authenticates
export const demoAuth: RequestHandler = (req, res, next) => {
  // Simulate authenticated user
  (req as any).user = {
    claims: {
      sub: "demo-user",
      email: "demo@civicos.local",
      first_name: "Demo",
      last_name: "User"
    }
  };
  next();
};