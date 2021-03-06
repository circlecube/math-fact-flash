/*

ROADMAP:
Add settings to localstorage
Add new modes
Add currency

*/

//app

var app = new Vue({
		el: '#app',
		data: {
			cardstate: 'back', // front, back/flipped
			state: 'on',	// valid, error, on, end
			mode: 'timer',	// 'practice' - answer until correct. 
							// 'stack' - only one answer per question (limited question)
							// 'streak' - go until you get a wrong answer - grade is total correct
							// 'timer' - race the clock and answer as many as you can in a set time
			range_answer: 6,
			active_val: '',
			passive_val: '',
			actives: '0-10',
			passives: '0-10',
			active_min: 0,
			active_max: 10,
			passive_min: 0,
			passive_max: 10,
			operation: '+', // '-', '×', '÷'
			operationlabel: {
				'+': 'Addition',
				'-': 'Subtraction',
				'×': 'Multiplication',
				'÷': 'Division'
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
			// max_errors_allowed: 5,
			// pause_allowed: false,
			// fractions: false,
			// decimals: false,
			// init_timeout: 10000,
			timer_current: 0,
			timer_timeout: 30,	// to add a timer option
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
		},

		methods: {

			answerforme(){
				var correct = this.getAnswer();

				//
				for ( var i = 0; i < 4; i++ ) {
					if ( this.answers[i].value === correct ) {
						this.checkAnswer(i);
					}
				}

			},

			badAnswer(){
				if ( this.errors > this.max_errors_allowed ) {
					// this.state = 'end';
				}
			},

			checkAnswer(i){
				// console.log('checkAnswer() called');

				// get correct answer
				var correct = this.getAnswer();
				// console.log(i, this.answers[i].value, this.state, correct);

				this.answer_count++;

				//if practice mode
				switch ( this.mode ) {
					case 'practice':
						// correct - load new card
						if ( this.answers[i].value === correct ) {
							// alert('correct!');
							this.valids++;
							this.state = 'valid';
							this.answers[i].state = 'valid';
							this.card_timeout = setTimeout(this.newCard, this.card_delay);
						}
						else { // incorrect - wait for correct			 
							this.errors++;
							this.state = 'error';
							this.answers[i].state = 'error';
							this.badAnswer();
							// alert('nope! ' + this.errors + ' incorrect.');
						}

						this.current_card++;

						//update progress
						this.progressrecord.push({
							state:	this.state,
							count:	this.answer_count
						});

						break;
					case 'timer':
						// record correct answer
						if ( this.answers[i].value === correct ) {
							this.valids++;
							this.state = 'valid';
							this.answers[i].state = 'valid';
						} else { //record incorrect answer
							this.errors++;
							this.state = 'error';
							this.answers[i].state = 'error';
						}
						this.current_card++;

						//update progress
						this.progressrecord.push({
							state:	this.state,
							count:	this.answer_count
						});

						// load new card
						this.card_timeout = setTimeout(this.newCard, this.card_delay);

						break;
					case 'test':
						// record correct answer
						if ( this.answers[i].value === correct ) {
							this.valids++;
							this.state = 'valid';
							this.answers[i].state = 'valid';
						} else { //record incorrect answer
							this.errors++;
							this.state = 'error';
							this.answers[i].state = 'error';
						}
						// console.table( this.answers );

						this.current_card--;

						//update progress
						this.progressrecord.push({
							state:	this.state,
							count:	this.answer_count
						});
						// console.table( this.progressrecord );
						
						// load new card
						this.card_timeout = setTimeout(this.newCard, this.card_delay);

						//automate answers
						if ( this.current_card > 0 && this.autopilot ) {
							this.autopilot_timeout = setTimeout(this.answerforme, this.card_delay + this.autopilot_delay);
						}
						// console.log('next card timeout called');
						break;
					default:
						// nothing here
				}
 
			},

			clearlog(){
				this.logs = [];
				// localStorage.setItem('logs', []);
			},

			displaylog(show){
				if (typeof show === 'undefined') { show = !this.displaylogs; }
				this.displaylogs = show;
			},

			flipcard(){
				// console.log('flipcard');
				if (this.cardstate === 'front') { 
					this.cardstate = 'back';
				} else {
					this.cardstate = 'front';
					this.displaylogs = false;
				}

				if (this.state === 'off'){
					this.reset();
				}
			},

			getAnswer(){
				//based on operation, calculate the correct answer
				switch(this.operation){
					case '+':
						return this.active_val + this.passive_val;
					case '-':
						return this.active_val - this.passive_val;
					case '×':
						return this.active_val * this.passive_val;
					case '÷':
						return this.active_val / this.passive_val;
					default:
						return this.active_val + this.passive_val;
				}
			},

			getRandomValues(){
				// console.log('getRandomValues() called');
				if ( this.operation != '÷') { //addition subtraction and multiplication
					this.active_val = Math.round( Math.random() * ( this.active_max - this.active_min ) ) + this.active_min;
					this.passive_val = Math.round( Math.random() * ( this.passive_max - this.passive_min ) ) + this.passive_min;
				} 
				/*
					for division - flip multiplication formula around
					use same 0-12 vals
					active becomes answer
					passive stays same
					answer(quotient) becomes active val to be displayed on card correctly
				*/
				else { //division only
					this.active_val = Math.round( Math.random() * ( this.active_max - this.active_min ) ) + this.active_min;
					this.passive_val = Math.round( Math.random() * ( this.passive_max - this.passive_min ) ) + this.passive_min;
					//correct for divide zero
					if ( this.passive_val === 0) {
						this.passive_val = 1;
					}
					this.active_val = this.active_val * this.passive_val;
				}
				// console.log('random values', this.active_val, this.passive_val);
				this.randomize_answers();
			},

			getReport(){
				this.endtime = new Date();
				this.duration = moment(this.endtime).diff(moment(this.starttime), 'seconds');

				var terms_active = this.actives;
				var terms_passive = this.passives;
				if ( this.active_max === this.active_min ) {
					terms_active = this.active_max;
				}
				if ( this.passive_max === this.passive_min ) {
					terms_passive = this.passive_max;
				}

				var log = {
					grade: this.grade,
					correct: this.valids,
					total: this.mode === 'timer' ? this.current_card : this.total_cards,
					operationlabel: this.operationlabel[this.operation],
					operation: this.operation,
					terms_active: terms_active,
					terms_passive: terms_passive,
					duration: this.duration,
					time: new Date(),
				};
				// alert(log.operation +'('+ log.total +') '+ log.grade +'% '+ log.duration + 's');
				this.logs.unshift(log);
				// localStorage.setItem('logs', this.logs);

				this.flipcard();
				this.displaylog(true);
			},

			newCard(){
				// console.log('newCard() called');
				console.log(this.mode, this.state, this.current_card);
				// console.table( this.answers );
				//if practice mode
				switch ( this.mode ) {
					case 'practice':
						//reset the values
						this.getRandomValues();
						this.state = 'on';
						break;
					case 'timer':
						// if still time
						this.timer_current = new Date();
						this.duration = moment(this.timer_current).diff(moment(this.starttime), 'seconds');
						if ( this.duration < this.timer_timeout ) {
							this.getRandomValues();
							this.state = 'on';
						} else {
							this.getReport();
							this.state = 'off';
						}
						break;
					case 'test':
						// if cards are out
						if ( this.current_card <= 0 ) {
							this.getReport();
							this.state = 'off';
						} else {
							//reset the values
							this.getRandomValues();
							this.state = 'on';
						}
						break;
					default:
						// nothing here
				}
				
				this.answer_color = this.randomNumber(8);
			},

			progresswidthcss( total ){
				switch ( this.mode ) {
					case 'practice':
						return 'width:' + ( 100 / this.current_card ) + '%;';
					case 'timer':
						console.log( this.duration, this.timer_timeout );
						return 'width:' + ( this.duration / this.timer_timeout / this.current_card ) * 100 + '%;';
					case 'test':
						return 'width:' + ( 100 / this.total_cards ) + '%;';
					default:
						// nothing here
				}
			},

			random(answers, distance) {
				// return Math.round(Math.random()*this.range_answer[1]+this.range_answer[0]);

				// correct answer will always be the first index of answers
				// distance meaning be the range +/- that the answer can be from the center (correct answer)
				// get random number of distance
				var num = Math.round( Math.random() * distance * 2 ) - distance;
				// center number is the origin
				// offset for correct
				num += answers[0].value;
				// make sure the answer checks if `allow_negative`
				if ( !this.allow_negative && num < 0 ) {
					// if negative get another
					//return this.random(answers, distance);
					num *= -1; //make it positive
				}
				// make sure the answer is unique
				for (var i = 0; i < answers.length; i++){
					if ( answers[i].value === num ) {
						// if duplicate is found recursively call again
						return this.random(answers, distance);
					}
				}

				return num;
			},

			randomize_answers(){
				// console.log('randomize_answers() called');
				this.answers = [];
				//get the correct answer
				var correct = this.getAnswer();

				this.answers.push( { 
					value: correct,
					state: 'on', //valid, correct 
					iscorrect: true
				} );
				//get three other answers - random differences from the range
				while( this.answers.length < 4 ) {
					this.answers.push( { 
						value: this.random(this.answers, this.range_answer),
						state: 'on',
						iscorrect: false
					} );
				}
				// console.table(answers);
				// make sure answers are unique
				// and randomize the answers
				this.answers.sort(function() { 
					return 0.5 - Math.random() 
				});
			},

			randomNumber(x){
				if (typeof x === 'undefined') { x = 10; }
				return Math.floor(Math.random() * x) + 1;
			},
			
			reset(){
				// console.log('start game:', this.mode);
				this.state = 'on';
				this.flipcard();
				this.errors = 0;
				this.valids = 0;
				this.answer_count = 0;
				this.answer_color = this.randomNumber(8);
				switch ( this.mode ) {
					case 'practice':
						this.current_card = 0;
						break;
					case 'timer':
						this.current_card = 0;
						break;
					case 'test':
						this.current_card = this.total_cards;
						break;
					default:
						// nothing here
				}
				this.progressrecord = [];
				this.starttime = new Date();

				this.getRandomValues();
			},

			setDefaultRanges(){

				//set ranges based on operation
				switch(this.operation){
					case '+':
						this.actives = '0-10';
						this.passives = '0-10';
						break;
					case '-':
						this.actives = '10-20';
						this.passives = '0-10';
						break;
					case '×':
						this.actives = '0-12';
						this.passives = '0-12';
						break;
					case '÷':
						this.actives = '0-12';
						this.passives = '0-12';
						break;
					default:
						//just leave alone
						break;
				}
				this.setRanges();
			},

			setRanges(){
				//set ranges based on values of the select lists for active and passive numbers
				//active split
				let vals = this.actives.split('-');
				this.active_min = parseInt( vals[0] );
				this.active_max = parseInt( vals[1] );

				vals = this.passives.split('-');
				this.passive_min = parseInt( vals[0] );
				this.passive_max = parseInt( vals[1] );
			},

			toggleinfomode(){
				this.infomode = !this.infomode;
			},
			
		},

		watch: {
			
			logs: function(){
				localStorage.setItem('logs', JSON.stringify(this.logs));
			},

			state: function(){
				// console.log('state changed to', this.state);
			},
			
			card_timeout: function(){
				// console.log('card_timeout changed to', this.card_timeout);
			},

		},

		filters: {

			relativetime: function(time){
				return moment(time).fromNow();
			}

		},

		computed: {
			
			grade(){
				var average = Math.round(this.valids / this.answer_count * 100);
				if ( isNaN(average) ) average = '0';
				return average;
			},

		},

		mounted(){
			this.reset();
		}

	});