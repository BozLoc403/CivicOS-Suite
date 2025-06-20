import { Router } from "express";

const router = Router();

// Get notification preferences - return defaults for demo
router.get("/", async (req: any, res) => {
  const defaultPreferences = {
    id: 1,
    userId: '42199639',
    petitionAlerts: true,
    billUpdates: true,
    foiResponses: true,
    systemNews: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.json(defaultPreferences);
});

// Update notification preferences
router.put("/", async (req: any, res) => {
  // For demo, just return the submitted preferences
  const updatedPreferences = {
    id: 1,
    userId: '42199639',
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(updatedPreferences);
});

export default router;