<template>
  <div class="stretch-guide-container">
    <div class="stretch-guide-card">
      <div class="stretch-guide-content">
        <h1 class="stretch-guide-title">ストレッチガイド</h1>

        <div class="stretch-info">
          <img src="/public/stretch1-1.jpg" alt="" />
          <h2 class="stretch-name">{{ currentStretch.name }}</h2>
          <p class="stretch-description">{{ currentStretch.description }}</p>

          <div class="progress-container">
            <div class="progress-labels">
              <span>進捗</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>

          <div class="button-container">
            <button
              @click="toggleStretch"
              :class="['action-button', isActive ? 'pause' : 'start']"
            >
              {{ isActive ? "一時停止" : "開始" }}
            </button>
            <button @click="resetStretch" class="action-button reset">
              リセット
            </button>
          </div>
        </div>

        <button @click="nextStretch" class="next-stretch-button">
          次のストレッチ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

defineOptions({
  name: 'User',
});

const stretches = reactive([
  {
    name: "肩回しストレッチ",
    description: "肩を大きく前後に回して、肩周りの筋肉をほぐします。",
  },
  {
    name: "首のストレッチ",
    description: "首をゆっくりと左右に傾けて、首の筋肉をストレッチします。",
  },
  {
    name: "腰のストレッチ",
    description: "腰を左右にひねって、腰回りの筋肉をストレッチします。",
  },
]);

const currentStretchIndex = ref(0);
const currentStretch = reactive(stretches[currentStretchIndex.value]);
const progress = ref(0);
const isActive = ref(false);
let intervalId = null;

const toggleStretch = () => {
  if (!isActive.value) {
    isActive.value = true;
    intervalId = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 1;
      } else {
        clearInterval(intervalId);
        isActive.value = false;
      }
    }, 100); // 10秒で完了するペース
  } else {
    clearInterval(intervalId);
    isActive.value = false;
  }
};

const resetStretch = () => {
  clearInterval(intervalId);
  progress.value = 0;
  isActive.value = false;
};

const nextStretch = () => {
  resetStretch();
  currentStretchIndex.value =
    (currentStretchIndex.value + 1) % stretches.length;
  Object.assign(currentStretch, stretches[currentStretchIndex.value]);
};
</script>

<style scoped>
:root {
  --color-purple-100: #f3e8ff;
  --color-purple-500: #8b5cf6;
  --color-purple-600: #7c3aed;
  --color-purple-700: #6d28d9;
  --color-green-500: #10b981;
  --color-green-600: #059669;
  --color-yellow-500: #f59e0b;
  --color-yellow-600: #d97706;
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;
  --color-gray-50: #f9fafb;
  --color-gray-600: #4b5563;
  --color-gray-800: #1f2937;
}

.stretch-guide-container {
  min-height: 100vh;
  background-color: #fff1f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.stretch-guide-card {
  width: 100%;
  max-width: 28rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.stretch-guide-content {
  padding: 1.5rem;
}

.stretch-guide-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-purple-600);
  margin-bottom: 1rem;
}

.stretch-info {
  background-color: var(--color-gray-50);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.stretch-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
}

.stretch-description {
  color: var(--color-gray-600);
  margin-bottom: 1rem;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 0.25rem;
}

.progress-bar {
  background-color: white;
  border-radius: 9999px;
  color: #6d28d9;
  border-color: #8b5cf6;
  height: 1rem;
}

.progress-fill {
  background-color: #6d28d9;
  border-radius: 9999px;
  border-color: #8b5cf6;
  height: 100%;
  transition: width 300ms ease-in-out;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.action-button {
  padding: 0.5rem 1rem;
  color: #6d28d9;
  border-color: rgba(124, 58, 237, 0.9);
  background-color: #7c3aed;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 200ms;
}

.action-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.5);
}

.action-button.start {
  background-color: var(--color-green-500);
}

.action-button.start:hover {
  background-color: var(--color-green-600);
}

.action-button.pause {
  background-color: var(--color-yellow-500);
}

.action-button.pause:hover {
  background-color: var(--color-yellow-600);
}

.action-button.reset {
  background-color: var(--color-red-500);
}

.action-button.reset:hover {
  background-color: var(--color-red-600);
}

.next-stretch-button {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #6d28d9;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 200ms;
}

.next-stretch-button:hover {
  background-color: var(--color-purple-700);
}

.next-stretch-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.5);
}
</style>
