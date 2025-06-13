import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupLocalAuth(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'civicos-local-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Allow HTTP for local dev
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user || null);
    } catch (error) {
      done(error);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error" });
        }
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      });
    })(req, res, next);
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      civicLevel: user.civicLevel,
      trustScore: user.trustScore
    });
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Change password route
  app.post("/api/auth/change-password", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user as any;

    try {
      // Get current user with password
      const [currentUser] = await db.select().from(users).where(eq(users.id, user.id));
      
      if (!currentUser || !currentUser.password) {
        return res.status(400).json({ message: "User not found" });
      }

      // Verify current password
      const isCurrentValid = await comparePasswords(currentPassword, currentUser.password);
      if (!isCurrentValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await db.update(users)
        .set({ 
          password: hashedNewPassword,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
}

// Create your user account
export async function createUserAccount() {
  const email = "jordan@iron-oak.ca";
  const password = "password123";
  
  try {
    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      console.log("User account already exists");
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user account
    await db.insert(users).values({
      id: "jordan-iron-oak",
      email: email,
      firstName: "Jordan",
      lastName: "",
      password: hashedPassword,
      civicLevel: "Administrator",
      trustScore: "100.00",
      isVerified: true,
      verificationLevel: "enhanced",
      civicPoints: 1000,
      currentLevel: 10,
      achievementTier: "platinum",
      engagementLevel: "champion",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("User account created successfully:");
    console.log("Email: jordan@iron-oak.ca");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error creating user account:", error);
  }
}