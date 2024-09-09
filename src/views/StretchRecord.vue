<template>
  <div class="container">
    <div class="card">
      <h1 class="title">今日の振り返り</h1>
      <form @submit.prevent="submitForm" class="reflection-form">
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">お悩み</span>
            <span class="info-value">{{ concern }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ストレッチ内容</span>
            <span class="info-value">{{ stretchContent }}</span>
          </div>
        </div>

        <div class="question">
          <p>疲労感は改善されましたか？</p>
          <div class="rating">
            <label v-for="n in 5" :key="`fatigue-${n}`">
              <input type="radio" v-model="fatigueImprovement" :value="n" />
              {{ n }}
            </label>
          </div>
          <div class="scale-description">
            <span>1: 全く改善されなかった、5: とても改善された</span>
          </div>
        </div>

        <div class="question">
          <label for="impression">今日の感想（任意）</label>
          <textarea
            id="impression"
            v-model="impression"
            rows="4"
            placeholder="今日の体調や活動について、感じたことを自由に書いてください。"
          ></textarea>
        </div>

        <button type="submit" class="submit-button">記録を保存</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const concern = ref('腰痛');
const stretchContent = ref('腰のストレッチ');
const fatigueImprovement = ref(null);
const impression = ref('');

const submitForm = () => {
  console.log({
    concern: concern.value,
    stretchContent: stretchContent.value,
    fatigueImprovement: fatigueImprovement.value,
    impression: impression.value
  });
  // 送信後の処理（例：確認メッセージの表示、フォームのリセットなど）
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0e6ff;
  padding: 1rem;
}

.card {
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 8px 16px rgba(98, 0, 238, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 380px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #5600e8;
  text-align: center;
  margin-bottom: 1.5rem;
}

.reflection-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid #e0d0ff;
  padding-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-weight: 600;
  color: #5600e8;
  font-size: 1rem;
  min-width: 120px;
}

.info-value {
  font-weight: 500;
  color: #333;
  padding: 0.5rem 0;
  flex-grow: 1;
  font-size: 1rem;
}

.question {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question p {
  font-weight: 700;
  color: #333;
}

.rating {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.rating label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.rating input[type="radio"] {
  margin-bottom: 0.25rem;
}

.scale-description {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 0.25rem;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0d0ff;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
}

.submit-button {
  background-color: #5600e8;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-button:hover {
  background-color: #4a00d1;
}

.submit-button:active {
  transform: scale(0.98);
}
</style>