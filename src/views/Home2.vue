<template>
  <div class="stretch-guide-container">
    <div class="stretch-guide-card">
      <button class="logout-button" @click="logout">ログアウト</button>
      <div class="stretch-guide-content">
        <h1 class="app-title">ゆるトレ</h1>
        <button class="action-button start" @click="startStretch">ストレッチを開始する</button>
        <button class="action-button reset" @click="viewMyStretch">自分の活動記録を見る</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const startStretch = () => {
  router.push("/stretch");
};

const viewMyStretch = () => {
  router.push("/mystretch");
};

const logout = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('userId');
  router.push('/login'); // ログインページにリダイレクト
};
</script>

<style scoped>
.stretch-guide-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff0f5; /* 柔らかいピンク色（ラベンダーブラッシュ） */
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.stretch-guide-card {
  width: 100%;
  max-width: 28rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative; /* ログアウトボタンを絶対位置にするために必要 */
}

.stretch-guide-content {
  padding: 1.5rem;
}

.app-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c3aed; /* 紫色 */
  text-align: center;
  margin-bottom: 1.5rem;
}

.action-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: white;
  background-color: #7c3aed; /* 紫色 */
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: background-color 200ms;
  border: none;
  cursor: pointer;
}

.action-button.start {
  background-color: #10b981; /* 緑色 */
}

.action-button.start:hover {
  background-color: #059669; /* 濃い緑色 */
}

.action-button.reset {
  background-color: #ef4444; /* 赤色 */
}

.action-button.reset:hover {
  background-color: #dc2626; /* 濃い赤色 */
}

/* スマートフォン用スタイル */
@media (max-width: 600px) {
  .stretch-guide-card {
    max-width: 90%;
  }

  .stretch-guide-content {
    padding: 1rem;
  }

  .app-title {
    font-size: 1.75rem;
  }

  .action-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}

/* ログアウトボタンのスタイル */
.logout-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef4444; /* 赤色 */
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626; /* 濃い赤色 */
}
</style>
