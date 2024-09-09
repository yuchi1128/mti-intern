<template>
    <div class="container">
      <div class="card">
        <h1 class="title">{{ stretchData.title }}</h1>
        <div class="stretch-content">
          <img :src="stretchData.imageUrl" :alt="stretchData.title" class="stretch-image">
          <div class="instructions">
            <p v-for="(instruction, index) in stretchData.stretchContext" :key="index">
              {{ index + 1 }}. {{ instruction }}
            </p>
          </div>
          <div class="timer-display">{{ formatTime(currentTime) }}</div>
          <div class="set-display">
            <span v-for="(dot, index) in 4" :key="index" 
                  :class="['set-dot', { 'active': index < currentSet }]"></span>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(currentTime / 10) * 100}%` }"></div>
            </div>
          </div>
          <div class="button-group">
            <button @click="toggleStretch" class="button action-button">
              {{ isActive ? '停止' : '開始' }}
            </button>
            <button @click="resetStretch" class="button reset-button">リセット</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const currentTime = ref(0);
  const currentSet = ref(0);
  const isActive = ref(false);
  let timer;
  const stretchData = ref({
    title: '',
    imageUrl: '',
    instructions: []
  });
  
  const formatTime = (time) => {
    const seconds = time % 60;
    return `00:${seconds.toString().padStart(2, '0')}`;
  };
  
  const fetchStretchData = async () => {
    try {
      const response = await fetch('https://os21ehqa5l.execute-api.ap-northeast-1.amazonaws.com/user/stretchcontent?Stretch_id=yotu-01&Severity=3');
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        stretchData.value = data.items[0];
      }
    } catch (error) {
      console.error('Error fetching stretch data:', error);
    }
  };
  
  const toggleStretch = () => {
    if (isActive.value) {
      clearInterval(timer);
      isActive.value = false;
    } else {
      isActive.value = true;
      startTimer();
    }
  };
  
  const startTimer = () => {
    timer = setInterval(() => {
      if (currentTime.value < 10) {
        currentTime.value++;
      } else {
        currentTime.value = 0;
        if (currentSet.value < 4) {
          currentSet.value++;
        } else {
          clearInterval(timer);
          isActive.value = false;
          return;
        }
      }
    }, 1000);
  };
  
  const resetStretch = () => {
    clearInterval(timer);
    currentTime.value = 0;
    currentSet.value = 0;
    isActive.value = false;
  };
  
  onMounted(() => {
    fetchStretchData();
  });
  
  onUnmounted(() => {
    clearInterval(timer);
  });
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0e6ff;
  }
  
  .card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(138, 43, 226, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 500px;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #6a0dad;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .stretch-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stretch-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  
  .instructions {
    text-align: left;
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    line-height: 1.4;
    margin-right:0.5rem;
    margin-left:0.5rem;
  }
  
  .timer-display {
    font-size: 2.5rem;
    font-weight: bold;
    color: #6a0dad;
    margin-bottom: 0.5rem;
    padding-top:30px;
    padding-bottom:20px
  }
  
  .set-display {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .set-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #e6d8ff;
    margin: 0 5px;
    transition: background-color 0.3s ease;
  }
  
  .set-dot.active {
    background-color: #6a0dad;
  }
  
  .progress-container {
    width: 90%;
    margin-bottom: 1.5rem;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #e0d0ff;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #5600e8;
    transition: width 1s linear;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom:2rem
  }
  
  .button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    margin:0px 2rem;
  }
  
  .button:active {
    transform: scale(0.98);
  }
  
  .action-button {
    background-color: #8a2be2;
    color: white;
  }
  
  .action-button:hover {
    background-color: #7a1fd6;
  }
  
  .reset-button {
    background-color: #f0e6ff;
    color: #6a0dad;
  }
  
  .reset-button:hover {
    background-color: #e6d8ff;
  }
  </style>