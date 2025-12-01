<template>
  <div
    class="bg-gradient-to-b from-gray-50 to-white shadow-xl rounded-lg p-6 mt-14"
    style="
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 6px rgba(0, 0, 0, 0.05);
    "
  >
    <transition name="fade">
      <div
        v-if="showNotification"
        class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        {{ notificationMessage }}
      </div>
    </transition>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="font-sans text-xl font-semibold">دليل الهاتف</h2>
      <div class="flex gap-2">
        <!-- Export Button -->
        <button
          @click="exportData"
          class="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border shadow-sm text-sm"
        >
          <ArrowDownTrayIcon class="font-sans w-4 h-4" /> تصدير
        </button>
        <!-- Add Button -->
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 shadow-sm text-sm"
        >
          <PlusIcon class="w-4 h-4" /> إضافة
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="flex justify-between mb-4">
      <!-- Filters -->

      <div class="flex gap-4 relative">
        <div class="relative">
          <button
            @click="resetFilters"
            class="px-4 py-2 border rounded bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            عرض الكل
          </button>
        </div>
        <!-- زر الفروع -->

        <div class="relative">
          <button
            @click="toggleDropdown('branches')"
            :disabled="selectedDepartment !== 'اختر الإدارة'"
            :class="[
              'px-4 py-2 border rounded flex items-center gap-2',
              selectedDepartment !== 'اختر الإدارة'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100',
            ]"
          >
            {{ selectedBranch }}

            <ChevronDownIcon class="w-4 h-4" />
          </button>
          <ul
            v-if="showDropdown === 'branches'"
            class="absolute right-0 mt-2 w-40 max-h-48 overflow-auto bg-white border rounded shadow-lg z-50 text-sm"
          >
            <li
              v-for="branch in branches"
              :key="branch"
              @click="selectBranch(branch)"
              class="px-3 py-1 hover:bg-gray-200 cursor-pointer text-right"
            >
              {{ branch }}
            </li>
          </ul>
        </div>

        <!-- زر الإدارات -->
        <div class="relative">
          <button
            @click="toggleDropdown('departments')"
            :disabled="selectedBranch !== 'اختر الفرع'"
            :class="[
              'px-4 py-2 border rounded flex items-center gap-2',
              selectedBranch !== 'اختر الفرع'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100',
            ]"
          >
            {{ selectedDepartment }}
            <ChevronDownIcon class="w-4 h-4" />
          </button>
          <ul
            v-if="showDropdown === 'departments'"
            class="absolute right-0 mt-2 w-40 max-h-48 overflow-auto bg-white border rounded shadow-lg z-50 text-sm"
          >
            <li
              v-for="dept in departments"
              :key="dept"
              @click="selectDepartment(dept)"
              class="px-3 py-1 hover:bg-gray-200 cursor-pointer text-right"
            >
              {{ dept }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-4 relative w-1/3">
        <input
          type="text"
          placeholder="...بحث عن موظف"
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-right"
          v-model="searchQuery"
        />
        <MagnifyingGlassIcon
          class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl">
      <table class="min-w-full border border-gray-200 rounded-lg text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-center">الاجراءات</th>
            <th class="px-4 py-2 text-center">رقم الهاتف</th>
            <th class="px-4 py-2 text-center">الإدارة / الفرع</th>
            <th class="px-4 py-2 text-center">الصفة</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="employee in paginatedEmployees"
            :key="employee.EmployeeID"
            class="border-t border-gray-100 hover:bg-gray-50"
          >
            <td class="px-4 py-2 text-center">
              <div class="flex justify-center gap-2">
                <!-- Edit -->
                <button
                  @click="openEditModal(employee)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm"
                  title="تعديل"
                >
                  <PencilIcon class="w-4 h-4 text-zinc-500" />
                </button>
                <!-- Delete -->

                <button
                  @click="openDeleteModal(employee.EmployeeID)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm"
                  title="حذف"
                >
                  <TrashIcon class="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </td>
            <td class="font-sans px-4 py-2 text-center">
              {{ employee.PhoneNumber }}
            </td>
            <td class="font-sans px-4 py-2 text-center">
              {{ employee.DepartmentOrBranch }}
            </td>
            <td class="font-sans px-4 py-2 text-center">
              {{ employee.RoleEmployee }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30"
    >
      <div
        class="rounded-xl p-6 w-96 text-right"
        style="
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        "
      >
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          {{ modalTitle }}
        </h3>
        <div class="space-y-3">
          <input
            v-model="form.RoleEmployee"
            @blur="
              touched.RoleEmployee = true;
              validateField('RoleEmployee');
            "
            placeholder="الصفة"
            :class="[
              'w-full border rounded px-3 py-2 bg-white/50',
              errors.RoleEmployee
                ? 'border-red-500'
                : 'border-gray-300 text-right',
            ]"
          />
          <p v-if="errors.RoleEmployee" class="text-red-500 text-sm mt-0">
            {{ errors.RoleEmployee }}
          </p>

          <input
            v-model="form.DepartmentOrBranch"
            @blur="
              touched.DepartmentOrBranch = true;
              validateField('DepartmentOrBranch');
            "
            placeholder="الإدارة / الفرع"
            :class="[
              'w-full border rounded px-3 py-2 bg-white/50',
              errors.DepartmentOrBranch
                ? 'border-red-500'
                : 'border-gray-300 text-right',
            ]"
          />
          <p v-if="errors.DepartmentOrBranch" class="text-red-500 text-sm mt-0">
            {{ errors.DepartmentOrBranch }}
          </p>

          <input
            v-model="form.PhoneNumber"
            @blur="
              touched.PhoneNumber = true;
              validateField('PhoneNumber');
            "
            placeholder="رقم الهاتف"
            :class="[
              'w-full border rounded px-3 py-2 bg-white/50',
              errors.PhoneNumber
                ? 'border-red-500'
                : 'border-gray-300 text-right',
            ]"
          />
          <p v-if="errors.PhoneNumber" class="text-red-500 text-sm mt-0">
            {{ errors.PhoneNumber }}
          </p>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            @click="saveEmployee"
            :disabled="!isFormValid"
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>

    <!--modal add branch-->
    <!-- مودال إضافة فرع أو إدارة -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30"
    >
      <div class="rounded-xl p-6 w-96 text-right bg-white shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          إضافة {{ addType === "branch" ? "فرع" : "إدارة" }} جديدة
        </h3>
        <input
          v-model="newItemName"
          placeholder="أدخل الاسم"
          class="w-full border rounded px-3 py-2 mb-4"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="hideAddModal"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            @click="saveNewItem"
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>

    <!--delete modal-->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 text-right">
          تأكيد الحذف
        </h3>
        <p class="text-gray-600 mb-6 text-right">هل أنت متأكد من حذف</p>
        <div class="flex justify-end gap-2">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-500"
          >
            حذف
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        السابق
      </button>
      <span>صفحة {{ currentPage }} من {{ totalPages }}</span>
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from "vue";
import axios from "axios";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/solid";

const employees = ref([]);
const currentPage = ref(1);
const rowsPerPage = 15;
const searchQuery = ref("");

// ✅ جلب البيانات
onMounted(async () => {
  const response = await axios.get("http://localhost:5000/api/employees");
  employees.value = response.data;
});

// ✅ البحث على جميع البيانات

const filteredEmployees = computed(() => {
  const q = searchQuery.value.toLowerCase();

  return employees.value.filter((emp) => {
    const matchesSearch =
      emp.RoleEmployee.toLowerCase().includes(q) ||
      emp.DepartmentOrBranch.toLowerCase().includes(q) ||
      emp.PhoneNumber.includes(q);

    const matchesBranch =
      selectedBranch.value !== "اختر الفرع"
        ? emp.DepartmentOrBranch.includes(selectedBranch.value)
        : true;

    const matchesDepartment =
      selectedDepartment.value !== "اختر الإدارة"
        ? emp.DepartmentOrBranch.includes(selectedDepartment.value)
        : true;

    return matchesSearch && matchesBranch && matchesDepartment;
  });
});

// ✅ التصفية مع الصفحات
const totalPages = computed(() =>
  Math.ceil(filteredEmployees.value.length / rowsPerPage)
);
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  return filteredEmployees.value.slice(start, start + rowsPerPage);
});

// ✅ إعادة الصفحة للأولى عند البحث
watch(searchQuery, () => {
  currentPage.value = 1;
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

// ✅ تصدير البيانات
function exportData() {
  const csvContent =
    "\uFEFF" +
    employees.value
      .map(
        (emp) =>
          `${emp.RoleEmployee},${emp.DepartmentOrBranch},"${emp.PhoneNumber}"`
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "employees.csv";
  link.click();
}

const showModal = ref(false);
const modalTitle = ref("");
const form = ref({
  RoleEmployee: "",
  DepartmentOrBranch: "",
  PhoneNumber: "",
});
let editId = null;

const showNotification = ref(false);
const notificationMessage = ref("");

function openAddModal() {
  modalTitle.value = "إضافة موظف";
  form.value = {
    RoleEmployee: "",
    DepartmentOrBranch: "",
    PhoneNumber: "",
  };
  editId = null;
  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openEditModal(emp) {
  modalTitle.value = "تعديل موظف";
  form.value = { ...emp };
  editId = emp.EmployeeID;
  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });
  showModal.value = true;
}

async function saveEmployee() {
  if (!validateForm()) return;

  try {
    if (editId) {
      await axios.put(
        `http://localhost:5000/api/employees/${editId}`,
        form.value
      );
      notificationMessage.value = "تم تعديل الموظف بنجاح";
    } else {
      await axios.post("http://localhost:5000/api/employees", form.value);
      console.log(form.value);
      notificationMessage.value = "تم إضافة الموظف بنجاح";
    }

    const response = await axios.get("http://localhost:5000/api/employees");
    employees.value = response.data;

    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);

    showModal.value = false;
    console.log("Das ist hier");
  } catch (error) {
    console.error("Error saving employee:", error);
    notificationMessage.value = "حدث خطأ أثناء الحفظ";
    showNotification.value = true;
    console.log("Das ist hier");
    setTimeout(() => (showNotification.value = false), 3000);
  }
}

//delete
const showDeleteModal = ref(false);
const deleteId = ref(null);

function openDeleteModal(id) {
  deleteId.value = id;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

async function confirmDelete() {
  try {
    await axios.delete(`http://localhost:5000/api/employees/${deleteId.value}`);
    employees.value = employees.value.filter(
      (emp) => emp.EmployeeID !== deleteId.value
    );

    notificationMessage.value = "تم حذف الموظف بنجاح";
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  } catch (error) {
    console.error("Error deleting employee:", error);
    notificationMessage.value = "حدث خطأ أثناء الحذف";
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  } finally {
    closeDeleteModal();
  }
}

// ✅ إضافة كائن لتخزين الأخطاء
const errors = reactive({
  RoleEmployee: "",
  DepartmentOrBranch: "",
  PhoneNumber: "",
});

//touched
const touched = reactive({
  RoleEmployee: false,
  DepartmentOrBranch: false,
  PhoneNumber: false,
});

const isFormValid = computed(() => {
  return (
    !errors.RoleEmployee && !errors.DepartmentOrBranch && !errors.PhoneNumber
  );
});

// ✅ دالة التحقق من صحة النموذج
function validateForm() {
  let isValid = true;
  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
  const numberRegex = /^[0-9]+$/;

  // الاسم
  // if (!form.value.FullName.trim()) {
  //   errors.FullName = "الاسم مطلوب";
  //   isValid = false;
  // } else if (!nameRegex.test(form.value.FullName)) {
  //   errors.FullName = "الاسم يجب أن يحتوي على حروف فقط";
  //   isValid = false;
  // } else {
  //   errors.FullName = "";
  // }

  // الصفة
  if (!form.value.RoleEmployee.trim()) {
    errors.RoleEmployee = "الصفة مطلوبة";
    isValid = false;
  } else if (!nameRegex.test(form.value.RoleEmployee)) {
    errors.RoleEmployee = "الصفة يجب أن تحتوي على حروف فقط";
    isValid = false;
  } else {
    errors.RoleEmployee = "";
  }

  // الإدارة / الفرع
  if (!form.value.DepartmentOrBranch.trim()) {
    errors.DepartmentOrBranch = "الإدارة / الفرع مطلوبة";
    isValid = false;
  } else if (!nameRegex.test(form.value.DepartmentOrBranch)) {
    errors.DepartmentOrBranch = "الإدارة / الفرع يجب أن تحتوي على حروف فقط";
    isValid = false;
  } else {
    errors.DepartmentOrBranch = "";
  }

  // رقم الهاتف
  if (!form.value.PhoneNumber.trim()) {
    errors.PhoneNumber = "رقم الهاتف مطلوب";
    isValid = false;
  } else if (!numberRegex.test(form.value.PhoneNumber)) {
    errors.PhoneNumber = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
    isValid = false;
  } else {
    errors.PhoneNumber = "";
  }

  return isValid;
}

// ✅ التحقق من الحقول أثناء الكتابة
// watch(
//   () => form.value.FullName,
//   () => {
//     if (touched.FullName) validateField("FullName");
//   }
// );
watch(
  () => form.value.RoleEmployee,
  () => {
    if (touched.RoleEmployee) validateField("RoleEmployee");
  }
);
watch(
  () => form.value.DepartmentOrBranch,
  () => {
    if (touched.DepartmentOrBranch) validateField("DepartmentOrBranch");
  }
);
watch(
  () => form.value.PhoneNumber,
  () => {
    if (touched.PhoneNumber) validateField("PhoneNumber");
  }
);

function validateField(field) {
  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
  const numberRegex = /^[0-9]+$/;

  switch (field) {
    case "RoleEmployee":
      if (!form.value.RoleEmployee.trim()) {
        errors.RoleEmployee = "الصفة مطلوبة";
      } else if (!nameRegex.test(form.value.RoleEmployee)) {
        errors.RoleEmployee = "الصفة يجب أن تحتوي على حروف فقط";
      } else {
        errors.RoleEmployee = "";
      }
      break;

    case "DepartmentOrBranch":
      if (!form.value.DepartmentOrBranch.trim()) {
        errors.DepartmentOrBranch = "الإدارة / الفرع مطلوبة";
      } else if (!nameRegex.test(form.value.DepartmentOrBranch)) {
        errors.DepartmentOrBranch = "الإدارة / الفرع يجب أن تحتوي على حروف فقط";
      } else {
        errors.DepartmentOrBranch = "";
      }
      break;

    case "PhoneNumber":
      if (!form.value.PhoneNumber.trim()) {
        errors.PhoneNumber = "رقم الهاتف مطلوب";
      } else if (!numberRegex.test(form.value.PhoneNumber)) {
        errors.PhoneNumber = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
      } else {
        errors.PhoneNumber = "";
      }
      break;
  }
}

//dropdown list
const selectedBranch = ref("اختر الفرع"); // القيمة الافتراضية
const selectedDepartment = ref("اختر الإدارة"); // القيمة الافتراضية
const showDropdown = ref(null);
const addType = ref("");
const newItemName = ref("");
const isAddModalOpen = ref(false);

const disableBranch = computed(
  () => selectedDepartment.value !== "اختر الإدارة"
);
const disableDepartment = computed(() => selectedBranch.value !== "اختر الفرع");

const branches = ref([
  "اختر الفرع",
  "فرع طرابلس",
  "فرع بنغازي",
  "فرع مصراتة",
  "فرع سبها",
  "فرع البيضاء",
  "فرع غريان",
  "فرع زوارة",
  "فرع سرت",
  "فرع درنة",
  "فرع طبرق",
]);

const departments = ref([
  "اختر الإدارة",
  "إدارة تقنية المعلومات",
  "إدارة الموارد البشرية",
  "إدارة المالية",
  "إدارة العمليات",
  "إدارة التسويق",
  "إدارة المخاطر",
  "إدارة أمن المعلومات",
]);

//add branch department function

function openAddBranchModal(type) {
  addType.value = type;
  newItemName.value = "";
  isAddModalOpen.value = true;
}

function hideAddModal() {
  isAddModalOpen.value = false;
  console.log(isAddModalOpen.value, "Scheiße");
}

//add new branch & department

function saveNewItem() {
  if (!newItemName.value.trim()) {
    alert("يرجى إدخال الاسم");
    return;
  }
  if (addType.value === "branch") {
    branches.value.push(newItemName.value);
  } else if (addType.value === "department") {
    departments.value.push(newItemName.value);
    console.log(newItemName.value, "Hallo");
  }
  hideAddModal();
}

function toggleDropdown(type) {
  showDropdown.value = showDropdown.value === type ? null : type;
}

function selectBranch(branch) {
  if (branch === "" || branch === "اختر الفرع") {
    //reset filter
    selectedBranch.value = "اختر الفرع";
    form.DepartmentOrBranch = ""; //cleare the form field
    console.log("reset filter");
  } else {
    //Normal selection
    selectedBranch.value = branch;
    form.DepartmentOrBranch = branch;
    console.log("تم اختيار الفرع", branch);
  }
  showDropdown.value = null; // Close dropdown
  // selectBranch.value = branch;
  // form.DepartmentOrBranch = branch; // حفط في نموذج
  // console.log("تم اختيار الفرع:", branch);
  // showDropdown.value = null;
}

function selectDepartment(dept) {
  if (dept === "" || dept === "اختر الإدارة") {
    //reset filter
    selectedDepartment.value = "اختر الإدارة";
    form.DepartmentOrBranch = ""; //cleare the form field
    console.log("clear selection");
  } else {
    // Normal selection
    selectedDepartment.value = dept;
    form.DepartmentOrBranch = dept;
    console.log("تم اختياؤ الادارة", dept);
  }
  showDropdown.value = null; // Close dropdown
  // selectedDepartment.value = dept;
  // form.DepartmentOrBranch = dept;
  // console.log("تم اختيار الإدارة:", dept);
  // showDropdown.value = null;
}

//resrtFilter

function resetFilters() {
  selectedBranch.value = "اختر الفرع";
  selectedDepartment.value = "اختر الإدارة";
  searchQuery.value = "";
  currentPage.value = 1; // Reset to first page
}

// ✅ إغلاق القائمة عند الضغط خارجها
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
      showDropdown.value = null;
    }
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button:disabled {
  opacity: 0.6;
  background-color: #e5e7eb; /* Tailwind gray-200 */
  color: #9ca3af; /* Tailwind gray-400 */
  cursor: not-allowed;
}
</style>
