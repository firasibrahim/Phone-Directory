import {
  getAllEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} from "../models/employeeModel.js";

export async function getEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createEmployee(req, res) {
  try {
    await addEmployee(req.body);
    res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function editEmployee(req, res) {
  try {
    const { id } = req.params;
    await updateEmployee(id, req.body);
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeEmployee(req, res) {
  try {
    const { id } = req.params;
    await deleteEmployee(id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
