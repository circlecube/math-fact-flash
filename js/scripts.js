var app = new Vue({
		el: '#app',
		data: {
			max_errors_allowed: 5,
			pause_game_allowed: false,
			range_answer: 6,
			range_active: [0,9],
			range_passive: [0,19],
			range_total: [0,20],
			init_timeout: 10000,
			operation: '+', // '-', '/', '*'
			errors: 0,
			valids: 0,
			mode: 'game', // 'test'
			allow_negative: false,
			fractions: false,
			decimals: false,
			state: 'on'//valid, error, on, end
		},

		methods: {
			random(answers, distance) {
				// return Math.round(Math.random()*this.range_answer[1]+this.range_answer[0]);

				// correct answer will always be the first index of answers
				// distance meaning be the range +/- that the answer can be from the center
				// get random number of distance
				var num = Math.round(Math.random()*distance*2)-distance;
				// center number is the origin
				num += answers[0].value;
				// must make sure the answer checks if `allow_negative`
				if ( !this.allow_negative && num < 0 ) {
					num *= -1;
				}
				// must make sure the answer is unique
				for (var i = 0; i<answers.length; i++){
					if ( answers[i].value === num ) {
						// console.log('found duplicate answer:',num,i);
						//if duplicate is found recursively call again
				  		return this.random(answers, distance)
					}
				}

				return num;
			},
			checkAnswer(i){
				if ( this.random_answers[i].value === this.random_term_top + this.random_term_bottom ) {
					// alert/('correct!');
					this.state = 'valid';
					this.random_answers[i].state = 'valid';
					setTimeout(this.newCard, 500);
				} else {
					this.state = 'error';
					this.random_answers[i].state = 'error';
					this.badAnswer();
					// alert('nope! ' + this.errors + ' incorrect.');
				}
			},
			newCard(){
				this.valids++;
				//reset the source computed values and it will trigger vue to recalculate them.
				this.range_active = [0,9];
				this.range_passive = [0,19];
				this.state = 'on';
			},
			badAnswer(){
				this.errors++;
				if ( this.errors > this.max_errors_allowed ) {
					// this.state = 'end';
				}
			}
		},

		computed: {
			random_term_top(){
				return Math.round(Math.random()*this.range_active[1]+this.range_active[0]);
			},

			random_term_bottom(){
				return Math.round(Math.random()*this.range_passive[1]+this.range_passive[0]);
			},
			random_answers(){
				var answers = [];
				//get the correct answer
				var correct = this.random_term_top + this.random_term_bottom
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

			}
		}


	});
