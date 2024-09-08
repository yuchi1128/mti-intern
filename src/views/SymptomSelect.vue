<template>
  <div class="container">
    <div class="card">
      <h1 class="title">ほっこりケア・フィット</h1>
      <h2 class="subtitle">健康管理</h2>
      <div class="form-group">
        <label for="bodyIssue" class="label"> 体の不調はなんですか？ </label>
        <select id="bodyIssue" v-model="bodyIssue" class="select">
          <option value="" disabled selected>選択してください</option>
          <option v-for="issue in bodyIssues" :key="issue" :value="issue">
            {{ issue }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label class="label"> その度合いはどのくらいですか？ </label>
        <div class="severity-buttons">
          <button
            v-for="level in 5"
            :key="level"
            @click="severityLevel = level"
            :class="['severity-button', { active: severityLevel === level }]"
          >
            {{ level }}
          </button>
        </div>
      </div>
      <button class="submit-button" @click="submitForm">
        ストレッチを始める
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

// フォームの状態を管理する変数
const bodyIssue = ref("");
const severityLevel = ref(0);

// 症状の選択肢
const bodyIssues = ["肩こり", "腰痛", "頭痛", "疲労感", "不眠"];

// フォーム送信の非同期処理
const submitForm = async () => {
  if (!bodyIssue.value || severityLevel.value === 0) {
    alert("すべての項目を入力してください");
    return;
  }

  // ローカルストレージからtokenを取得
  const token = localStorage.getItem("token");
  if (!token) {
    alert("トークンが見つかりません");
    return;
  }

  const userId = localStorage.getItem("user_id");
  if (!userId) {
    alert("ユーザーIDが見つかりません");
    return;
  }

  const SymptomDetails = [{
    Symptom: bodyIssue.value,
    Severity: severityLevel.value,
  }];


 const payload = {
   "user_id": "userId",
   "SymptomDetails": "SymptomDetails", 
   };


  try {
    const response = await fetch(
      `https://os21ehqa5l.execute-api.ap-northeast-1.amazonaws.com/user/symptoms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("エラーが発生しました。");
    }
    router.push('/stretch') 

    const data = await response.json();
    console.log("成功:", data);
    alert("送信が完了しました");
  } catch (error) {
    console.error("送信エラー:", error);
    alert("送信に失敗しました");
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff0f5;
}

.card {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 24rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #8a2be2;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.severity-buttons {
  display: flex;
  justify-content: space-between;
}

.severity-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background-color: #e2e8f0;
  color: #4a5568;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.severity-button.active {
  background-color: #8a2be2;
  color: white;
}

.submit-button {
  width: 100%;
  background-color: #8a2be2;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #7a1fd6;
}
</style>
