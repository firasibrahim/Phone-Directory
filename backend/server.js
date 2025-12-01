import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeesRoutes from "./routes/employees.js";
import authRoutes from "./routes/auth.js";
import { poolPromise } from "./config/db.js"; // استدعاء الاتصال الثابت

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// تحقق من الاتصال بقاعدة البيانات
poolPromise
  .then(() => console.log("✅ Database connection ready"))
  .catch((err) => console.error("❌ Database connection error:", err));

// نقطة اختبار
app.get("/", (req, res) => res.send("✅ Backend is running 🚀"));

// المسارات
app.use("/api/employees", employeesRoutes);
app.use("/api/auth", authRoutes);

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
