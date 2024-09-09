<template>
  <div class="container">
    <header class="header">
      <h1>更年期ストレッチサポート</h1>
    </header>
    <main class="main-content">
      <section class="recommended-stretch">
        <h2>今日のおすすめストレッチ</h2>
        <div class="stretch-card">
          <div class="stretch-details">
            <h3>{{ recommendedStretch.name }}</h3>
            <p>{{ recommendedStretch.description }}</p>
            <button @click="startStretch" class="start-button" >ストレッチを始める</button>
          </div>
        </div>
      </section>
      <section class="symptom-based-stretch">
        <h2>改善したい症状から始める</h2>
        <p>症状や深刻度に応じて、適切なストレッチを行うことができます。あなたの状態に合わせたストレッチプランを提案します。</p>
        <button @click="goToSymptomPage" class="start-button">症状別ストレッチを探す</button>
      </section>
      <section class="past-stretches">
        <h2>最近のストレッチ記録</h2>
        <div v-if="recentStretches.length > 0" class="stretch-list">
          <div v-for="stretch in recentStretches" :key="stretch.date" class="past-stretch-item">
            <div class="past-stretch-date">{{ formatDate(stretch.date) }}</div>
            <div class="past-stretch-content">
              <h4>{{ stretch.name }}</h4>
              <p><strong>感想:</strong> {{ stretch.impression }}</p>
              <p><strong>疲労改善度:</strong> {{ stretch.fatigueImprovement }}/5</p>
            </div>
          </div>
        </div>
        <p v-else>まだストレッチの記録がありません。今日から始めましょう！</p>
      </section>
      <section class="stretch-calendar">
        <h2>ストレッチカレンダー</h2>
        <div class="calendar">
          <div class="calendar-header">
            <button @click="previousMonth" class="calendar-nav">&lt;</button>
            <h3>{{ currentMonthYear }}</h3>
            <button @click="nextMonth" class="calendar-nav">&gt;</button>
          </div>
          <div class="calendar-days">
            <div v-for="day in ['日', '月', '火', '水', '木', '金', '土']" :key="day" class="calendar-day-header">{{ day }}</div>
            <div v-for="day in calendarDays" :key="day.date" 
                 :class="['calendar-day', { 'has-stretch': day.hasStretch, 'other-month': day.otherMonth }]">
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const recommendedStretch = ref({
  name: '肩こり解消ストレッチ',
  description: '肩と首の緊張をほぐし、血行を促進するストレッチです。デスクワークの合間にもおすすめです。',
  image: '/placeholder.svg?height=200&width=200'
});

const allStretches = ref([
  { date: new Date(2023, 4, 15), name: '腰痛改善ストレッチ', impression: 'とても効果を感じました。腰の張りが和らぎました。', fatigueImprovement: 4 },
  { date: new Date(2023, 4, 14), name: '肩こり解消ストレッチ', impression: '肩の凝りがだいぶ軽くなりました。毎日続けたいです。', fatigueImprovement: 5 },
  { date: new Date(2023, 4, 13), name: '全身リラックスストレッチ', impression: '全身の疲れが取れた感じがします。', fatigueImprovement: 4 },
  { date: new Date(2023, 4, 10), name: '足のむくみ解消ストレッチ', impression: '足の軽さが違います。続けていきたいです。', fatigueImprovement: 5 },
]);

const recentStretches = computed(() => {
  return allStretches.value.slice(0, 3);
});

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ja-JP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const startStretch = () => {
  router.push('/login') 
  console.log('ストレッチを開始します');
};

const goToSymptomPage = () => {
  router.push('/login') 
  console.log('症状別ストレッチページに遷移します');
  // ここに症状別ストレッチページへの遷移ロジックを追加
};

// カレンダー関連の状態と関数
const currentDate = ref(new Date());

const currentMonthYear = computed(() => {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long' }).format(currentDate.value);
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  const startDay = firstDay.getDay();
  const endDate = lastDay.getDate();

  for (let i = 0; i < 42; i++) {
    const date = new Date(year, month, i - startDay + 1);
    days.push({
      date: date,
      hasStretch: allStretches.value.some(stretch => 
        stretch.date.getFullYear() === date.getFullYear() &&
        stretch.date.getMonth() === date.getMonth() &&
        stretch.date.getDate() === date.getDate()
      ),
      otherMonth: date.getMonth() !== month
    });
  }

  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color:#EFE5FF;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #5600e8;
  font-size: 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.recommended-stretch, .symptom-based-stretch, .past-stretches, .stretch-calendar {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #5600e8;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.stretch-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stretch-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.stretch-details {
  flex: 1;
}

.stretch-details h3 {
  color: #333;
  margin-bottom: 10px;
}

.start-button {
  background-color: #5600e8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #4a00d1;
}

.symptom-based-stretch p {
  margin-bottom: 15px;
  line-height: 1.5;
}

.stretch-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.past-stretch-item {
  border: 1px solid #e0d0ff;
  border-radius: 5px;
  padding: 15px;
}

.past-stretch-date {
  font-weight: bold;
  color: #5600e8;
  margin-bottom: 5px;
}

.past-stretch-content h4 {
  color: #333;
  margin-bottom: 5px;
}

.calendar {
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-nav {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #5600e8;
  cursor: pointer;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day-header {
  text-align: center;
  font-weight: bold;
  color: #5600e8;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0d0ff;
  border-radius: 5px;
}

.calendar-day.has-stretch {
  background-color: #e0d0ff;
  color: #5600e8;
  font-weight: bold;
}

.calendar-day.other-month {
  color: #ccc;
}

@media (max-width: 600px) {
  .stretch-card {
    flex-direction: column;
    text-align: center;
  }

  .stretch-image {
    width: 100%;
    max-width: 200px;
    height: auto;
  }

  .calendar-days {
    font-size: 0.8rem;
  }
}
</style>