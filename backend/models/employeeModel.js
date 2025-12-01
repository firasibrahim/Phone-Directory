import { poolPromise } from "../config/db.js";

export async function getAllEmployees() {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Employees");
  return result.recordset;
}

export async function addEmployee(employee) {
  const pool = await poolPromise;
  const { FullName, RoleEmployee, DepartmentOrBranch, PhoneNumber } = employee;
  await pool
    .request()

    .input("RoleEmployee", RoleEmployee)
    .input("DepartmentOrBranch", DepartmentOrBranch)
    .input("PhoneNumber", PhoneNumber)
    .query(
      "INSERT INTO Employees (RoleEmployee, DepartmentOrBranch, PhoneNumber) VALUES (@RoleEmployee, @DepartmentOrBranch, @PhoneNumber)"
    );
}

// تحديث بيانات موظف
export async function updateEmployee(id, employee) {
  const pool = await poolPromise;
  const { FullName, RoleEmployee, DepartmentOrBranch, PhoneNumber } = employee;
  await pool
    .request()
    .input("EmployeeID", id)
    .input("RoleEmployee", RoleEmployee)
    .input("DepartmentOrBranch", DepartmentOrBranch)
    .input("PhoneNumber", PhoneNumber).query(`UPDATE Employees 
            SET RoleEmployee=@RoleEmployee, DepartmentOrBranch=@DepartmentOrBranch, PhoneNumber=@PhoneNumber 
            WHERE EmployeeID=@EmployeeID`);
}

// حذف موظف
export async function deleteEmployee(id) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("EmployeeID", id)
    .query("DELETE FROM Employees WHERE EmployeeID=@EmployeeID");
}
