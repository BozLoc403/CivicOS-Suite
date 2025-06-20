import { storage } from "./storage";

// Create sample notifications for testing
async function createSampleNotifications() {
  const userId = "demo"; // Demo user ID
  
  try {
    console.log("Creating sample notifications...");
    
    // Create test notifications
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

    await storage.createNotification({
      userId,
      type: "foi",
      title: "FOI Request Response",
      message: "Your Freedom of Information request #2024-001 has been processed",
      sourceModule: "FOI Request #2024-001",
      sourceId: "2024-001",
      priority: "medium"
    });

    console.log("Sample notifications created successfully!");
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}

// Only run if called directly
if (require.main === module) {
  createSampleNotifications().then(() => process.exit(0));
}

export { createSampleNotifications };