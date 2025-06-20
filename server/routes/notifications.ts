import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { createInsertSchema } from "drizzle-zod";
import { notifications, userNotificationPreferences } from "@shared/schema";

const router = Router();

console.log("Notifications router loaded");

// Validation schemas
const createNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const updatePreferencesSchema = createInsertSchema(userNotificationPreferences).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Get user's notifications
router.get("/", async (req: any, res) => {
  try {
    // Simple auth check - use session userId or default to demo
    const userId = req.session?.userId || 'demo';
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(`Fetching notifications for user: ${userId}`);
    const notifications = await storage.getUserNotifications(userId);
    console.log(`Found ${notifications.length} notifications`);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch("/:id/read", async (req: any, res) => {
  try {
    const userId = req.session?.userId || 'demo';
    const notificationId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    console.log(`Marking notification ${notificationId} as read for user ${userId}`);
    await storage.markNotificationAsRead(notificationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// Delete notification (soft delete)
router.delete("/:id", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const notificationId = parseInt(req.params.id);
    
    await storage.deleteNotification(notificationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

// Clear all notifications for user
router.delete("/", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    await storage.clearAllNotifications(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
});

// Get user notification preferences
router.get("/preferences", async (req: any, res) => {
  try {
    const userId = req.session?.userId || 'demo';
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const preferences = await storage.getUserNotificationPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    res.status(500).json({ message: "Failed to fetch notification preferences" });
  }
});

// Update user notification preferences
router.put("/preferences", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = updatePreferencesSchema.parse(req.body);
    
    const preferences = await storage.updateUserNotificationPreferences(userId, validatedData);
    res.json(preferences);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update notification preferences" });
  }
});

// Create notification (internal use)
router.post("/", isAuthenticated, async (req: any, res) => {
  try {
    const validatedData = createNotificationSchema.parse(req.body);
    const notification = await storage.createNotification(validatedData);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create notification" });
  }
});

console.log("Notifications router routes registered");

export default router;