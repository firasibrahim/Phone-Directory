import { poolPromise } from "../config/db.js";

// جلب المستخدم حسب اسم المستخدم
export async function getUserByUsername(username) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("Username", username)
    .query("SELECT * FROM Users WHERE Username=@Username");
  return result.recordset[0];
}

// إضافة مستخدم جديد (للاستخدام عند الحاجة)
export async function addUser(user) {
  const pool = await poolPromise;
  const { Username, Password, IsAdmin } = user;
  await pool
    .request()
    .input("Username", Username)
    .input("Password", Password)
    .input("IsAdmin", IsAdmin)
    .query(
      "INSERT INTO Users (Username, Password, IsAdmin) VALUES (@Username, @Password, @IsAdmin)"
    );
}
