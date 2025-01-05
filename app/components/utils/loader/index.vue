<template>
  <div v-if="loading" class="flex items-center justify-center mt-2 space-x-2">
    <span class="sr-only">Loading...</span>
    <div v-for="n in numberCount" :key="n" class="w-3 h-3 bg-white rounded animate-bounce"
      :style="{ animationDelay: `-${(numberCount - n) * 0.15}s` }"
    ></div>
  </div>
  <span v-else>{{ label }}</span>
</template>

<script setup lang="ts">

defineProps({
  numberCount: {
    type: Number,
    default: 5,
  },
  label: {
    type: String,
    default: "Loading...",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});


</script>