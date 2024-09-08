<template>
  <div class="container">
    <div class="card">
      <h1 class="title">ほっこりケア・フィット</h1>
      <h2 class="subtitle">{{ isLogin ? 'ログイン' : '新規登録' }}</h2>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group" v-if="!isLogin">
          <label for="username" class="label">ユーザー名</label>
          <input type="text" id="username" v-model="username" class="input" required>
        </div>
        <div class="form-group">
          <label for="email" class="label">メールアドレス</label>
          <input type="email" id="email" v-model="email" class="input" required>
        </div>
        <div class="form-group">
          <label for="password" class="label">パスワード</label>
          <input type="password" id="password" v-model="password" class="input" required>
        </div>
        <button type="submit" class="submit-button">
          {{ isLogin ? 'ログイン' : '新規登録' }}
        </button>
      </form>
      <button @click="toggleAuthMode" class="toggle-button">
        {{ isLogin ? '新規登録はこちらから' : 'ログインはこちらから' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLogin = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  username.value = ''
  email.value = ''
  password.value = ''
}

const handleSubmit = () => {
  if (isLogin.value) {
    console.log('ログイン処理:', { email: email.value, password: password.value })
  } else {
    console.log('新規登録処理:', { username: username.value, email: email.value, password: password.value })
  }
  // ここに実際の認証処理を追加してください
}
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
  margin-bottom: 1rem;
  text-align: center;
  color: #8a2be2;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form {
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

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.submit-button {
  width: 100%;
  background-color: #8a2be2;
  color: white;
  padding: 0.75rem;
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

.toggle-button {
  width: 100%;
  background-color: transparent;
  color: #8a2be2;
  padding: 0.5rem;
  border: 1px solid #8a2be2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.toggle-button:hover {
  background-color: #8a2be2;
  color: white;
}
</style>