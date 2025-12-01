import express from "express";
import {
  getEmployees,
  createEmployee,
  editEmployee,
  removeEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", createEmployee);

router.put("/:id", editEmployee); // تعديل موظف
router.delete("/:id", removeEmployee); // حذف موظف

export default router;
