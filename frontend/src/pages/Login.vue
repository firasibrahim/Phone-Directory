<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30"
  >
    <div
      class="rounded-xl p-6 w-96"
      style="
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      "
    >
      <h3 class="text-lg font-semibold mb-4 text-gray-800 text-center">
        تسجيل دخول المسؤول
      </h3>

      <div class="space-y-3">
        <!-- اسم المستخدم -->
        <input
          v-model="username"
          placeholder="اسم المستخدم"
          class="w-full border rounded px-3 py-2 bg-white/50 text-right"
        />
        <p v-if="errors.username" class="text-red-500 text-sm">
          {{ errors.username }}
        </p>

        <!-- كلمة المرور مع أيقونة العين -->
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="كلمة المرور"
            class="w-full border rounded px-3 py-2 bg-white/50 pl-10 text-right"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 left-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            <component
              :is="showPassword ? EyeSlashIcon : EyeIcon"
              class="w-5 h-5"
            />
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </p>

        <!-- رسالة خطأ عامة -->
        <p v-if="errorMessage" class="text-red-500 text-center text-sm">
          {{ errorMessage }}
        </p>
      </div>

      <div class="flex justify-end mt-4">
        <button
          @click="login"
          class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 w-full"
        >
          دخول
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const errors = ref({ username: "", password: "" });
const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function login() {
  // ✅ التحقق من الحقول
  errors.value.username = username.value.trim() ? "" : "اسم المستخدم مطلوب";
  errors.value.password = password.value.trim() ? "" : "كلمة المرور مطلوبة";

  if (errors.value.username || errors.value.password) return;

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    // ✅ حفظ التوكن مع وقت الانتهاء
    const token = response.data.token;
    const expirationTime = Date.now() + 30 * 60 * 1000; // 30 دقيقة
    localStorage.setItem("adminToken", token);
    localStorage.setItem("tokenExpiry", expirationTime);

    router.push("/admin");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage.value = "كلمة المرور غير صحيحة";
      } else if (error.response.status === 403) {
        errorMessage.value = "ليس لديك صلاحية الدخول كمسؤول";
      } else if (error.response.status === 404) {
        errorMessage.value = "المستخدم غير موجود";
      } else {
        errorMessage.value = "حدث خطأ غير متوقع";
        console.error("Login error", error);
      }
    } else {
      errorMessage.value = "تعذر الاتصال بالخادم";
    }
  }
}
</script>
