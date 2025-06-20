import { Router } from "express";
import { db } from "./db";
import { notifications } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import preferencesRouter from "./routes/preferences";

const router = Router();

// Mount preferences routes
router.use('/preferences', preferencesRouter);

// Get notifications - no auth required for demo
router.get("/", async (req: any, res) => {
  try {
    const userId = '42199639'; // Demo user ID
    console.log(`Fetching notifications for user: ${userId}`);
    
    const result = await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    
    console.log(`Found ${result.length} notifications`);
    res.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
});

// Mark as read
router.patch("/:id/read", async (req: any, res) => {
  try {
    const userId = '42199639'; // Demo user ID
    const notificationId = parseInt(req.params.id);
    
    console.log(`Marking notification ${notificationId} as read`);
    
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
});

// Delete notification
router.delete("/:id", async (req: any, res) => {
  try {
    const userId = '42199639'; // Demo user ID
    const notificationId = parseInt(req.params.id);
    
    console.log(`Deleting notification ${notificationId}`);
    
    await db.delete(notifications)
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
});

// Clear all notifications
router.delete("/", async (req: any, res) => {
  try {
    const userId = '42199639'; // Demo user ID
    
    console.log(`Clearing all notifications for user ${userId}`);
    
    await db.delete(notifications)
      .where(eq(notifications.userId, userId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Failed to clear notifications", error: error.message });
  }
});

export default router;