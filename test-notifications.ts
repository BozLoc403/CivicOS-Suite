import { storage } from "./server/storage";

// Test script to create sample notifications
async function createTestNotifications() {
  const userId = "demo"; // Demo user ID
  
  // Create some test notifications
  await storage.createNotification({
    userId,
    type: "bill",
    title: "Bill C-11 Update",
    message: "Online Streaming Act has passed second reading in Parliament",
    sourceModule: "Bill C-11",
    sourceId: "1",
    priority: "high"
  });

  await storage.createNotification({
    userId,
    type: "petition",
    title: "Petition Milestone",
    message: "Climate Action petition has reached 10,000 signatures",
    sourceModule: "Petition #123",
    sourceId: "123",
    priority: "medium"
  });

  await storage.createNotification({
    userId,
    type: "system",
    title: "Data Update Complete",
    message: "Weekly sync of government data completed - 342 MPs updated",
    sourceModule: "System",
    priority: "low"
  });

  console.log("Test notifications created successfully!");
}

createTestNotifications().catch(console.error);