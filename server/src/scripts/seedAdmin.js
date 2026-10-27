import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tatva_nutrition';

const ADMIN_NAME = process.env.ADMIN_NAME || 'TATVA Administrator';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@tatvanutrition.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@Tatva2026!';

export const seedAdmin = async () => {
  try {
    console.log(`[Admin Seed] Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);

    let admin = await User.findOne({ email: ADMIN_EMAIL });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    if (admin) {
      admin.role = 'admin';
      admin.name = ADMIN_NAME;
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log(`[Admin Seed] Updated existing user ${ADMIN_EMAIL} to role: admin.`);
    } else {
      admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash,
        role: 'admin',
      });
      console.log(`[Admin Seed] Successfully created new administrator: ${ADMIN_EMAIL}`);
    }

    console.log(`[Admin Seed] Admin Email: ${ADMIN_EMAIL}`);
    console.log(`[Admin Seed] Admin Role: ${admin.role}`);
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('[Admin Seed Error]:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    return false;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedAdmin.js')) {
  seedAdmin().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
