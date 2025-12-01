<template>
  <nav class="flex items-center justify-end px-4 py-2 navbar-style">
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <span class="font-sans font-bold text-lg text-gray-700"
        >مصرف الصحارى</span
      >
      <img src="../assets/logo.png" class="w-8 h-8 object-contain logo-size" />
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar-style {
  position: fixed; /* يجعل العنصر ثابت */
  top: 0; /* يثبته في أعلى الصفحة */
  left: 0;
  width: 100%; /* يمتد على عرض الصفحة */
  z-index: 50; /* حتى يكون فوق باقي العناصر */
  margin-bottom: 50px;
  background: linear-gradient(
    90deg,
    rgba(230, 230, 230, 0.5) 100%,
    rgba(240, 240, 240, 0.6) 50%,
    rgba(255, 255, 255, 0.7) 0%
  );
  backdrop-filter: blur(10px); /* تأثير الزجاج */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.logo-size {
  max-width: 80px;
  width: 30px;
  height: 30px;
}
</style>
