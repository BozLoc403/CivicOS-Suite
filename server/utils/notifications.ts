import { storage } from "../storage";
import type { InsertNotification } from "@shared/schema";

/**
 * Helper functions for creating notifications
 */

export async function createPetitionNotification(
  userId: string, 
  petitionId: number, 
  title: string, 
  message: string
): Promise<void> {
  await storage.createNotification({
    userId,
    type: "petition",
    title,
    message,
    sourceModule: `Petition #${petitionId}`,
    sourceId: petitionId.toString(),
  });
}

export async function createBillNotification(
  userId: string, 
  billId: number, 
  title: string, 
  message: string
): Promise<void> {
  await storage.createNotification({
    userId,
    type: "bill",
    title,
    message,
    sourceModule: `Bill #${billId}`,
    sourceId: billId.toString(),
  });
}

export async function createSystemNotification(
  userId: string, 
  title: string, 
  message: string
): Promise<void> {
  await storage.createNotification({
    userId,
    type: "system",
    title,
    message,
    sourceModule: "System",
  });
}

export async function createFOINotification(
  userId: string, 
  requestId: string, 
  title: string, 
  message: string
): Promise<void> {
  await storage.createNotification({
    userId,
    type: "foi",
    title,
    message,
    sourceModule: `FOI Request #${requestId}`,
    sourceId: requestId,
  });
}