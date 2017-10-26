/*

ROADMAP:
Add settings to localstorage
Options styled as back of card

*/

//app

var app = new Vue({
		el: '#app',
		data: {
			cardstate: 'back', // front, back/flipped
			state: 'on',	// valid, error, on, end
			mode: 'test',	// 'practice' - answer until correct. 
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
			answers: 0,
			answer_color: 0,
			total_cards: 20,
			current_card: 0,
			progressrecord: [],
			allow_negative: false,
			// max_errors_allowed: 5,
			// pause_allowed: false,
			// fractions: false,
			// decimals: false,
			// init_timeout: 10000,
			// timer: false,	// to add a timer option
			starttime: 0,
			duration: 0,
			logs: localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : [],
			displaylogs: false,
			infomode: false,
			autopilot: true,
			autopilot_timeout: null,
			autopilot_delay: 400,
			card_timeout: null,
			card_delay: 500,
		},

		methods: {
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
			randomNumber(x){
				if (typeof x === 'undefined') { x = 10; }
				return Math.floor(Math.random() * x) + 1;
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
			progresswidthcss(total){
				if ( this.mode === 'practice' ) {
					return 'width:' + (100 / this.current_card) + '%;';
				} else {
					return 'width:' + (100 / this.total_cards) + '%;';
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
			answerforme(){
				var correct = this.getAnswer();

				//
				for ( var i = 0; i < 4; i++ ) {
					if ( this.random_answers[i].value === correct ) {
						this.checkAnswer(i);
					}
				}

			},
			checkAnswer(i){
				// get correct answer
				var correct = this.getAnswer();

				this.answers++;

				//if practice mode
				if ( this.mode === 'practice' ) {
					// correct - load new card
					if ( this.random_answers[i].value === correct ) {
						// alert('correct!');
						this.valids++;
						this.state = 'valid';
						this.random_answers[i].state = 'valid';
						this.card_timeout = setTimeout(this.newCard, this.card_delay);
					}
					else { // incorrect - wait for correct			 
						this.errors++;
						this.state = 'error';
						this.random_answers[i].state = 'error';
						this.badAnswer();
						// alert('nope! ' + this.errors + ' incorrect.');
					}

					this.current_card++;

					//update progress
					this.progressrecord.push(this.state);

				} else { // test mode
					// record correct answer
					if ( this.random_answers[i].value === correct ) {
						this.valids++;
						this.state = 'valid';
						this.random_answers[i].state = 'valid';
					} else { //record incorrect answer
						this.errors++;
						this.state = 'error';
						this.random_answers[i].state = 'error';
					}
					// console.log('checkAnswer', i , this.random_answers[i].value, this.state, correct);
					// console.table( this.random_answers );

					this.current_card--;

					//update progress
					this.progressrecord.push(this.state);
					
					// load new card
					this.card_timeout = setTimeout(this.newCard, this.card_delay);

					//automate answers
					if ( this.current_card > 0 && this.autopilot ) {
						this.autopilot_timeout = setTimeout(this.answerforme, this.card_delay + this.autopilot_delay);
					}

				}
				
				 
			},
			newCard(){
				//if practice mode
				if ( this.mode === 'practice' ) {
					//reset the values
					this.getRandomValues();
					this.state = 'on';
				} else { // test mode
				// if cards are out
				if ( this.current_card <= 0 ) {
						this.getReport();
						this.state = 'off';
					} else {
						//reset the values
						this.getRandomValues();
						this.state = 'on';
					}
				}
				this.answer_color = this.randomNumber();
			},
			badAnswer(){
				if ( this.errors > this.max_errors_allowed ) {
					// this.state = 'end';
				}
			},
			getReport(){
				this.endtime = new Date();
				this.duration = moment(this.endtime).diff(moment(this.starttime), 'seconds');
				var log = {
					grade: this.grade,
					total: this.total_cards,
					operationlabel: this.operationlabel[this.operation],
					operation: this.operation,
					terms: this.actives + ' & ' + this.passives,
					duration: this.duration,
					time: new Date(),
				};
				// alert(log.operation +'('+ log.total +') '+ log.grade +'% '+ log.duration + 's');
				this.logs.unshift(log);
				// localStorage.setItem('logs', this.logs);

				this.flipcard();
				this.displaylog(true);
			},
			getRandomValues(){
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
			},
			reset(){
				// console.log('start game:', this.mode);
				this.state = 'on';
				this.flipcard();
				this.errors = 0;
				this.valids = 0;
				this.answers = 0;
				this.answer_color = this.randomNumber(8);
				if ( this.mode === 'practice' ) {
					this.current_card = 0;
				} else {
					this.current_card = this.total_cards;
				}
				this.progressrecord = [];
				this.starttime = new Date();

				this.getRandomValues();
			},
			toggleinfomode(){
				this.infomode = !this.infomode;
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
			displaylog(show){
				if (typeof show === 'undefined') { show = !this.displaylogs; }
				this.displaylogs = show;
			},
			clearlog(){
				this.logs = [];
				// localStorage.setItem('logs', []);
			},
			
		},

		watch: {
			logs: function(){
				localStorage.setItem('logs', JSON.stringify(this.logs));
			}
		},

		filters: {
			relativetime: function(time){
				return moment(time).fromNow();
			}
		},

		computed: {
			
			random_answers(){
				var answers = [];
				//get the correct answer
				var correct = this.getAnswer();

				answers.push( { 
					value: correct,
					state: 'on' //valid, correct 
				} );
				//get three other answers - random differences from the range
				while( answers.length < 4 ) {
					answers.push( { 
						value: this.random(answers, this.range_answer),
						state: 'on'
					} );	
				}
				// console.table(answers);
				
				// make sure answers are unique
				// and randomize the answers
				answers.sort(function() { return 0.5 - Math.random() });

				return answers;

			},

			grade(){
				var average = Math.round(this.valids / this.answers * 100);
				if ( isNaN(average) ) average = '0';
				return average;
			}
		},

		mounted(){
			this.reset();
		}


	});
