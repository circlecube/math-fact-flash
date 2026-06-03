<template>
  <main>
    <div class="container">
      <div class="card" :data-card="cardstate" :class="state" :data-errors="errors"
        :data-valids="valids" :data-answers="answer_count">

        <figure class="front">
          <button id="cog" class="top left gray" @click="flipcard()" title="Options">
            <i class="fas fa-gear"></i>
          </button>

          <div class="term term1" v-text="active_val"></div>
          <div class="operand" v-text="operation"></div>
          <div class="term term2" v-text="passive_val"></div>

          <div class="answers" :data-state="state" :data-mode="mode">
            <div
              class="answer"
              v-for="(answer, i) in answers"
              :key="i"
              :class="answer.state"
              v-text="answer.value"
              @click="mode !== 'test' || (state === 'on' && answer.state === 'on') ? checkAnswer(i) : null"
              :data-color="answer_color"
              :data-iscorrect="answer.iscorrect"
              :data-incorrect="!answer.iscorrect"
            ></div>
          </div>
        </figure>

        <figure class="back">
          <button id="close" class="top left red" @click="flipcard()" title="Close">
            <i class="fas fa-times"></i>
          </button>
          <button id="ok" class="top right green" @click="reset()" title="OK">
            <i class="fas fa-check"></i>
          </button>
          <button id="logs" class="bottom left lblue" :class="{ dblue: displaylogs }"
            @click="displaylog()" title="View Log">
            <i class="fas fa-list"></i>
          </button>

          <div class="title"></div>

          <div class="option term term1" :class="{ hide: displaylogs }">
            <label><span>Top: </span>
              <select id="term1select" v-model="actives" @change="setRanges()">
                <optgroup label="Single Value">
                  <option value="0-0">0</option>
                  <option value="1-1">1</option>
                  <option value="2-2">2</option>
                  <option value="3-3">3</option>
                  <option value="4-4">4</option>
                  <option value="5-5">5</option>
                  <option value="6-6">6</option>
                  <option value="7-7">7</option>
                  <option value="8-8">8</option>
                  <option value="9-9">9</option>
                  <option value="10-10">10</option>
                  <option value="11-11">11</option>
                  <option value="12-12">12</option>
                </optgroup>
                <optgroup label="Range of Values">
                  <option value="0-10">0-10</option>
                  <option value="0-12">0-12</option>
                  <option value="0-20">0-20</option>
                  <option value="10-20">10-20</option>
                  <option value="0-50">0-50</option>
                  <option value="0-100">0-100</option>
                </optgroup>
              </select>
            </label>
          </div>

          <div class="option operand" :class="{ hide: displaylogs }">
            <label><span>Operation: </span>
              <select id="operationselect" v-model="operation" @change="setDefaultRanges()">
                <option value="+">&nbsp;+&nbsp;</option>
                <option value="-">&nbsp;-&nbsp;</option>
                <option value="×">&nbsp;×&nbsp;</option>
                <option value="÷">&nbsp;÷&nbsp;</option>
              </select>
            </label>
          </div>

          <div class="option term term2" :class="{ hide: displaylogs }">
            <label><span>Bottom: </span>
              <select id="term2select" v-model="passives" @change="setRanges()">
                <optgroup label="Single Value">
                  <option value="0-0">0</option>
                  <option value="1-1">1</option>
                  <option value="2-2">2</option>
                  <option value="3-3">3</option>
                  <option value="4-4">4</option>
                  <option value="5-5">5</option>
                  <option value="6-6">6</option>
                  <option value="7-7">7</option>
                  <option value="8-8">8</option>
                  <option value="9-9">9</option>
                  <option value="10-10">10</option>
                  <option value="11-11">11</option>
                  <option value="12-12">12</option>
                </optgroup>
                <optgroup label="Range of Values">
                  <option value="0-10">0-10</option>
                  <option value="0-12">0-12</option>
                  <option value="0-20">0-20</option>
                  <option value="10-20">10-20</option>
                  <option value="0-50">0-50</option>
                  <option value="0-100">0-100</option>
                </optgroup>
              </select>
            </label>
          </div>

          <div class="appoptions" :class="{ hide: displaylogs }">
            <div class="option mode">
              <label><span>Mode: </span>
                <select id="modeselect" v-model="mode">
                  <option value="practice">Practice Mode</option>
                  <option value="test">Test Mode</option>
                  <option value="timer">Timer Mode</option>
                </select>
                <button class="info" @click="toggleinfomode()" title="?">
                  <i class="fas fa-info"></i>
                </button>
                <dl class="infomode" v-if="infomode">
                  <dt>Practice Mode</dt>
                  <dd>Play will continue forever. This is for practicing.</dd>
                  <dt>Test Mode</dt>
                  <dd>Set a certian number of cards and receive a score.</dd>
                  <dt>Timer Mode</dt>
                  <dd>Set a timer and answer as many cards to receive a score.</dd>
                </dl>
              </label>
            </div>
            <div class="option number" v-if="mode === 'test'">
              <label><span>Number of Cards: </span>
                <select id="testnumberselect" v-model.number="total_cards">
                  <option value="5">5 cards</option>
                  <option value="10">10 cards</option>
                  <option value="20">20 cards</option>
                  <option value="25">25 cards</option>
                  <option value="50">50 cards</option>
                  <option value="100">100 cards</option>
                </select>
              </label>
            </div>
            <div class="option timer" v-if="mode === 'timer'">
              <label><span>Time Limit: </span>
                <select id="timernumberselect" v-model.number="timer_timeout">
                  <option value="10">10 seconds</option>
                  <option value="20">20 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="120">2 minutes</option>
                  <option value="180">3 minutes</option>
                </select>
              </label>
            </div>
          </div>

          <div class="log" :class="{ hide: !displaylogs }">
            <h4>Activity Log
              <button id="delete_logs" class="info" @click="clearlog()" title="Clear Log">
                <i class="fas fa-trash"></i>
              </button>
            </h4>
            <table class="log">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Duration</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, idx) in logs" :key="idx">
                  <td class="operation">[{{ log.terms_active }}] {{ log.operation }} [{{ log.terms_passive }}]</td>
                  <td class="total">{{ log.correct }}/{{ log.total }}</td>
                  <td class="duration">{{ log.duration }} sec</td>
                  <td class="time">{{ relativeTime(log.time) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </figure>
      </div>
    </div>

    <span class="progressgrade" v-text="grade"></span>
    <TransitionGroup tag="div" name="progressbar" class="progressbar" :data-total="total_cards">
      <span
        class="bar"
        v-for="record in progressrecord"
        :key="record.count"
        :class="record.state"
        :data-total="total_cards"
        :data-count="record.count"
        :style="progresswidthcss()"
      ></span>
    </TransitionGroup>
  </main>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      cardstate: 'back',
      state: 'on',
      mode: 'timer',
      range_answer: 6,
      active_val: '',
      passive_val: '',
      actives: '0-10',
      passives: '0-10',
      active_min: 0,
      active_max: 10,
      passive_min: 0,
      passive_max: 10,
      operation: '+',
      operationlabel: {
        '+': 'Addition',
        '-': 'Subtraction',
        '×': 'Multiplication',
        '÷': 'Division',
      },
      errors: 0,
      valids: 0,
      answer_count: 0,
      answer_color: 0,
      total_cards: 100,
      current_card: 0,
      answers: [],
      progressrecord: [],
      allow_negative: false,
      timer_current: 0,
      timer_timeout: 30,
      starttime: 0,
      duration: 0,
      logs: localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : [],
      displaylogs: false,
      infomode: false,
      autopilot: false,
      autopilot_timeout: null,
      autopilot_delay: 400,
      card_timeout: null,
      card_delay: 500,
    }
  },

  computed: {
    grade() {
      const average = Math.round((this.valids / this.answer_count) * 100)
      return isNaN(average) ? 0 : average
    },
  },

  watch: {
    logs(val) {
      localStorage.setItem('logs', JSON.stringify(val))
    },
  },

  mounted() {
    this.reset()
  },

  methods: {
    relativeTime(time) {
      const diff = (new Date(time).getTime() - Date.now()) / 1000
      const abs = Math.abs(diff)
      const fmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
      if (abs < 60) return fmt.format(Math.round(diff), 'second')
      if (abs < 3600) return fmt.format(Math.round(diff / 60), 'minute')
      if (abs < 86400) return fmt.format(Math.round(diff / 3600), 'hour')
      return fmt.format(Math.round(diff / 86400), 'day')
    },

    answerforme() {
      const correct = this.getAnswer()
      for (let i = 0; i < 4; i++) {
        if (this.answers[i].value === correct) {
          this.checkAnswer(i)
        }
      }
    },

    badAnswer() {
      // placeholder for max errors logic
    },

    checkAnswer(i) {
      const correct = this.getAnswer()
      this.answer_count++

      switch (this.mode) {
        case 'practice':
          if (this.answers[i].value === correct) {
            this.valids++
            this.state = 'valid'
            this.answers[i].state = 'valid'
            this.card_timeout = setTimeout(this.newCard, this.card_delay)
          } else {
            this.errors++
            this.state = 'error'
            this.answers[i].state = 'error'
            this.badAnswer()
          }
          this.current_card++
          this.progressrecord.push({ state: this.state, count: this.answer_count })
          break

        case 'timer':
          if (this.answers[i].value === correct) {
            this.valids++
            this.state = 'valid'
            this.answers[i].state = 'valid'
          } else {
            this.errors++
            this.state = 'error'
            this.answers[i].state = 'error'
          }
          this.current_card++
          this.progressrecord.push({ state: this.state, count: this.answer_count })
          this.card_timeout = setTimeout(this.newCard, this.card_delay)
          break

        case 'test':
          if (this.answers[i].value === correct) {
            this.valids++
            this.state = 'valid'
            this.answers[i].state = 'valid'
          } else {
            this.errors++
            this.state = 'error'
            this.answers[i].state = 'error'
          }
          this.current_card--
          this.progressrecord.push({ state: this.state, count: this.answer_count })
          this.card_timeout = setTimeout(this.newCard, this.card_delay)
          if (this.current_card > 0 && this.autopilot) {
            this.autopilot_timeout = setTimeout(this.answerforme, this.card_delay + this.autopilot_delay)
          }
          break
      }
    },

    clearlog() {
      this.logs = []
    },

    displaylog(show) {
      if (typeof show === 'undefined') { show = !this.displaylogs }
      this.displaylogs = show
    },

    flipcard() {
      if (this.cardstate === 'front') {
        this.cardstate = 'back'
      } else {
        this.cardstate = 'front'
        this.displaylogs = false
      }
      if (this.state === 'off') {
        this.reset()
      }
    },

    getAnswer() {
      switch (this.operation) {
        case '+': return this.active_val + this.passive_val
        case '-': return this.active_val - this.passive_val
        case '×': return this.active_val * this.passive_val
        case '÷': return this.active_val / this.passive_val
        default:  return this.active_val + this.passive_val
      }
    },

    getRandomValues() {
      if (this.operation !== '÷') {
        this.active_val = Math.round(Math.random() * (this.active_max - this.active_min)) + this.active_min
        this.passive_val = Math.round(Math.random() * (this.passive_max - this.passive_min)) + this.passive_min
      } else {
        this.active_val = Math.round(Math.random() * (this.active_max - this.active_min)) + this.active_min
        this.passive_val = Math.round(Math.random() * (this.passive_max - this.passive_min)) + this.passive_min
        if (this.passive_val === 0) { this.passive_val = 1 }
        this.active_val = this.active_val * this.passive_val
      }
      this.randomize_answers()
    },

    getReport() {
      this.endtime = new Date()
      this.duration = Math.round((this.endtime - this.starttime) / 1000)

      let terms_active = this.actives
      let terms_passive = this.passives
      if (this.active_max === this.active_min) { terms_active = this.active_max }
      if (this.passive_max === this.passive_min) { terms_passive = this.passive_max }

      const log = {
        grade: this.grade,
        correct: this.valids,
        total: this.mode === 'timer' ? this.current_card : this.total_cards,
        operationlabel: this.operationlabel[this.operation],
        operation: this.operation,
        terms_active,
        terms_passive,
        duration: this.duration,
        time: new Date(),
      }
      this.logs.unshift(log)
      this.flipcard()
      this.displaylog(true)
    },

    newCard() {
      console.log(this.mode, this.state, this.current_card)
      switch (this.mode) {
        case 'practice':
          this.getRandomValues()
          this.state = 'on'
          break
        case 'timer':
          this.timer_current = new Date()
          this.duration = Math.round((this.timer_current - this.starttime) / 1000)
          if (this.duration < this.timer_timeout) {
            this.getRandomValues()
            this.state = 'on'
          } else {
            this.getReport()
            this.state = 'off'
          }
          break
        case 'test':
          if (this.current_card <= 0) {
            this.getReport()
            this.state = 'off'
          } else {
            this.getRandomValues()
            this.state = 'on'
          }
          break
      }
      this.answer_color = this.randomNumber(8)
    },

    progresswidthcss() {
      switch (this.mode) {
        case 'practice':
          return 'width:' + (100 / this.current_card) + '%;'
        case 'timer':
          return 'width:' + (this.duration / this.timer_timeout / this.current_card) * 100 + '%;'
        case 'test':
          return 'width:' + (100 / this.total_cards) + '%;'
      }
    },

    random(answers, distance) {
      let num = Math.round(Math.random() * distance * 2) - distance
      num += answers[0].value
      if (!this.allow_negative && num < 0) { num *= -1 }
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].value === num) {
          return this.random(answers, distance)
        }
      }
      return num
    },

    randomize_answers() {
      this.answers = []
      const correct = this.getAnswer()
      this.answers.push({ value: correct, state: 'on', iscorrect: true })
      while (this.answers.length < 4) {
        this.answers.push({
          value: this.random(this.answers, this.range_answer),
          state: 'on',
          iscorrect: false,
        })
      }
      this.answers.sort(() => 0.5 - Math.random())
    },

    randomNumber(x = 10) {
      return Math.floor(Math.random() * x) + 1
    },

    reset() {
      this.state = 'on'
      this.flipcard()
      this.errors = 0
      this.valids = 0
      this.answer_count = 0
      this.answer_color = this.randomNumber(8)
      switch (this.mode) {
        case 'practice':
        case 'timer':
          this.current_card = 0
          break
        case 'test':
          this.current_card = this.total_cards
          break
      }
      this.progressrecord = []
      this.starttime = new Date()
      this.getRandomValues()
    },

    setDefaultRanges() {
      switch (this.operation) {
        case '+':
          this.actives = '0-10'; this.passives = '0-10'
          break
        case '-':
          this.actives = '10-20'; this.passives = '0-10'
          break
        case '×':
        case '÷':
          this.actives = '0-12'; this.passives = '0-12'
          break
      }
      this.setRanges()
    },

    setRanges() {
      let vals = this.actives.split('-')
      this.active_min = parseInt(vals[0])
      this.active_max = parseInt(vals[1])
      vals = this.passives.split('-')
      this.passive_min = parseInt(vals[0])
      this.passive_max = parseInt(vals[1])
    },

    toggleinfomode() {
      this.infomode = !this.infomode
    },
  },
}
</script>
