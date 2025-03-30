import dotenv from "dotenv";
dotenv.config(); // explicitly load env vars

import { db } from "../db";
import { users } from "../db/schema";

async function seed() {
  await db.insert(users).values({
    id: "test-user-1",
    email: "testuser@example.com",
    password: "hashed_password_here", // Replace with proper hashed password if required
  });

  console.log("✅ Seeded test user.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  });
