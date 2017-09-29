/*

ROADMAP:

Add settings to localstorage
Range sliders for max/min values
Total cards input update to select list with preset numbers for quiz length

*/

//app

var app = new Vue({
		el: '#app',
		data: {
			state: 'on',	// valid, error, on, end
			mode: 'test',	// 'game' - answer until correct. 
							// 'test' - only one answer per question (limited question)
			showModal: false,
			range_answer: 6,
			active_val: '',
			passive_val: '',
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
			allow_negative: false,
			// max_errors_allowed: 5,
			total_cards: 20,
			current_card: 0,
			// pause_game_allowed: false,
			// fractions: false,
			// decimals: false,
			// init_timeout: 10000,
			// timer: false,	// to add a timer option
			starttime: 0,
			duration: 0,
			logs: localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : [],
			// logs: [],
			displaylogs: true,
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
				if ( !this.allow_negative && this.operation === '+' && num < 0 ) {
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
						return (this.active_val / this.passive_val).toFixed(2);
					default:
						return this.active_val + this.passive_val;
				}
			},
			checkAnswer(i){
				// get correct answer
				var correct = this.getAnswer();
				this.answers++;

				//if game mode
				if ( this.mode == 'game' ) {
					// correct - load new card
					if ( this.random_answers[i].value === correct ) {
						// alert('correct!');
						this.valids++;
						this.state = 'valid';
						this.random_answers[i].state = 'valid';
						setTimeout(this.newCard, 500);
					}
					else { // incorrect - wait for correct			 
						this.errors++;
						this.state = 'error';
						this.random_answers[i].state = 'error';
						this.badAnswer();
						// alert('nope! ' + this.errors + ' incorrect.');
					}

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

					// load new card
					this.current_card--;
					setTimeout(this.newCard, 500);
					
				}
				
					


				

				 
			},
			newCard(){
				//if game mode
				if ( this.mode == 'game' ) {
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
			},
			badAnswer(){
				if ( this.errors > this.max_errors_allowed ) {
					// this.state = 'end';
				}
			},
			getReport(){
				// this.reset(true);
				this.endtime = new Date();
				this.duration = moment(this.endtime).diff(moment(this.starttime), 'seconds');
				var log = {
					grade: this.grade,
					total: this.total_cards,
					operation: this.operationlabel[this.operation],
					duration: this.duration,
					time: new Date(),
				};
				// alert(log.operation +'('+ log.total +') '+ log.grade +'% '+ log.duration + 's');
				this.logs.unshift(log);
				// localStorage.setItem('logs', this.logs);

				this.showModal = true;
				this.displaylog(true);
			},
			getRandomValues(){
				this.active_val = Math.round( Math.random() * ( this.active_max - this.active_min ) ) + this.active_min;
				this.passive_val = Math.round( Math.random() * ( this.passive_max - this.passive_min ) ) + this.passive_min;
			},
			reset(closemodal){

				this.showModal = !closemodal;
				this.errors = 0;
				this.valids = 0;
				this.answers = 0;
				this.current_card = this.total_cards;
				this.starttime = new Date();

				this.getRandomValues();
			},
			setDefaultRanges(){

				//set ranges based on operation
				switch(this.operation){
					case '+':
						this.active_min = 0;
						this.active_max = 10;
						this.passive_min = 0;
						this.passive_max = 10;
						break;
					case '-':
						this.active_min = 10;
						this.active_max = 20;
						this.passive_min = 0;
						this.passive_max = 10;
						break;
					case '×':
						this.active_min = 0;
						this.active_max = 12;
						this.passive_min = 0;
						this.passive_max = 12;
						break;
					default:
						//just leave alone
						break;
				}

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
			this.reset(true);
		}


	});
