import jwt from "jsonwebtoken";
import { getUserByUsername } from "../models/userModel.js";

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ تحقق من كلمة المرور بدون تشفير
    if (password !== user.Password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ تحقق من صلاحية الأدمن
    if (!user.IsAdmin) {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // ✅ إنشاء التوكن
    const token = jwt.sign(
      { userId: user.UserID, username: user.Username, isAdmin: user.IsAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "حدث خطأ غير متوقع" });
  }
}
