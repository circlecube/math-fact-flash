var app = new Vue({
		el: '#root',
		data: {
			max_errors_allowed: 5,
			pause_game_allowed: false,
			range_answer: [-6,6],
			range_active: [0,9],
			range_passive: [0,19],
			range_total: [0,20],
			init_timeout: 10000,
			operation: '+', // '-', '/', '*'
			errors: 0
		},

		methods: {
			random () {
			  return Math.round(Math.random()*this.range_answer[1]+this.range_answer[0]);
			},
			checkAnswer(answer){
				if ( answer === this.random_term_top + this.random_term_bottom ) {
					alert('correct!');
					this.range_active = [0,9];
					this.range_passive = [0,19];
				} else {
					this.errors++;
					alert('nope!' + this.errors);
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
				answers.push( correct );
				//get three other answers - random differences from the range
				answers.push( correct + this.random() );
				answers.push( correct + this.random() );
				answers.push( correct + this.random() );
				//make sure answers are unique
				//randomize the answers
				answers.sort(function() { return 0.5 - Math.random() });

				return answers;

			}
		}


	});
