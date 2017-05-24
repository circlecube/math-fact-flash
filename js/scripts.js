//register modal component
Vue.component('modal', {
	template: '#modal-template'
});

//app
var app = new Vue({
		el: '#app',
		data: {
			max_errors_allowed: 5,
			pause_game_allowed: false,
			range_answer: 6,
			active_val: '',
			passive_val: '',
			active_min: 0,
			active_max: 9,
			passive_min: 0,
			passive_max: 19,
			range_total: [0,20],
			init_timeout: 10000,
			operation: '+', // '-', '/', '*'
			errors: 0,
			valids: 0,
			answers: 0,
			mode: 'game',	// 'game' - answer until correct. 
							//	 'test' - only one answer per question
			timer: false,	// to add a timer option
			allow_negative: false,
			fractions: false,
			decimals: false,
			state: 'on',	// valid, error, on, end
			showModal: false,
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
			getAnswer(){
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
				// get answer
				var correct = this.getAnswer();

				if ( this.random_answers[i].value === correct ) {
					// alert/('correct!');
					this.valids++;
					this.state = 'valid';
					this.random_answers[i].state = 'valid';
					setTimeout(this.newCard, 500);
				} else {
					this.errors++;
					this.state = 'error';
					this.random_answers[i].state = 'error';
					this.badAnswer();
					// alert('nope! ' + this.errors + ' incorrect.');
				}
				this.answers++;
			},
			newCard(){
				//reset the values
				this.getRandomValues();
				this.state = 'on';
			},
			badAnswer(){
				if ( this.errors > this.max_errors_allowed ) {
					// this.state = 'end';
				}
			},
			getRandomValues(){
				this.active_val = Math.round( Math.random() * ( this.active_max - this.active_min ) ) + this.active_min;
				this.passive_val = Math.round( Math.random() * ( this.passive_max - this.passive_min ) ) + this.passive_min;
			},
			reset(){
				this.showModal = false;
				this.errors = 0;
				this.valids = 0;
				this.answers = 0;
				this.getRandomValues();
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
				
				//make sure answers are unique
				//randomize the answers
				answers.sort(function() { return 0.5 - Math.random() });

				return answers;

			},

			grade(){
				var average = Math.round(this.valids / this.answers * 100);
				if ( isNaN(average) ) average = '-';
				return average;
			}
		},

		mounted(){
			this.reset();
		}


	});
