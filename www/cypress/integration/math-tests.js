describe('Math Fact Flash App', function(){
	it('.should() - assert that <title> is correct', function(){
		cy.visit( Cypress.env("appurl") )
		cy.title().should('include', 'Math Flash Cards')
		// cy.screenshot()
	})

	it('.click cog button to go to options card back', function(){
		cy.get('#cog').click()
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('.select() - select an option in a <select> element', function(){
		cy.get('#operationselect').select('+')
		cy.get('#term1select').select('0-10')
		cy.get('#term2select').select('0-10')

		cy.get('#modeselect').select('test')
		cy.get('#testnumberselect').select('5')

	})

	it('.click ok button to go to options card front', function(){
		cy.get('#ok').click()
		cy.get('.card').should('have.attr', 'data-card', 'front')
	})

	it('check that front is in order', function(){
		cy.get('.front .term1').should('be.visible')
		cy.get('.front .term2').should('be.visible')
		cy.get('.front .operand').should('have.html', '+')

		cy.get('.front .answer[data-iscorrect]').should('be.visible')

	})

	it('click correct answer 1', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 2', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 3', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 4', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 5', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('check for end of 5 card test', function(){
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('check log for latest addition', function(){
		cy.get('.log').should('be.visible')
		cy.get('.log tbody tr .operation').should('contain', '[0-10] + [0-10]')
		cy.get('.log tbody tr .total').should('contain', '5/5')
		cy.get('.log tbody tr .duration').should('contain', 'sec')
		cy.get('.log tbody tr .time').should('contain', 'ago')

	})

	it('.click logs button to close logs and go to options card back', function(){
		cy.get('#logs').click()
		cy.get('.log').should('not.be.visible')
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('check default operations ranges are set', function(){
		cy.get('#operationselect').select('+')
		cy.get('#term1select').should('have.value', '0-10')
		cy.get('#term2select').should('have.value', '0-10')

		cy.get('#operationselect').select('×')
		cy.get('#term1select').should('have.value', '0-12')
		cy.get('#term2select').should('have.value', '0-12')
		
		cy.get('#operationselect').select('-')
		cy.get('#term1select').should('have.value', '10-20')
		cy.get('#term2select').should('have.value', '0-10')
		
		cy.get('#operationselect').select('÷')
		cy.get('#term1select').should('have.value', '0-12')
		cy.get('#term2select').should('have.value', '0-12')

	})

	it('another test for multiplication', function(){

		cy.get('#operationselect').select('×')
		cy.get('#modeselect').select('test')
		cy.get('#testnumberselect').select('5')

		cy.get('#ok').click()
		cy.get('.card').should('have.attr', 'data-card', 'front')

	})

	it('click incorrect answer', function(){
		cy.get('.front .answer:not([data-iscorrect="true"]):first').click()
		cy.get('.front .answers').should('have.attr', 'data-state', 'error')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar')
			.should('have.class', 'error')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 2', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 3', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})
	
	it('click correct answer 4', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})
	
	it('click correct answer 5', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('check for end of 5 card test', function(){
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('check log for latest addition', function(){
		cy.get('.log').should('be.visible')
		cy.get('.log tbody tr .operation').should('contain', '[0-12] × [0-12]')
		cy.get('.log tbody tr .total').should('contain', '4/5')
		cy.get('.log tbody tr .duration').should('contain', 'sec')
		cy.get('.log tbody tr .time').should('contain', 'ago')
	})

	it('.click logs button to close logs and go to options card back', function(){
		cy.get('#logs').click()
		cy.get('.log').should('not.be.visible')
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('try app in practice mode', function(){
		cy.get('#operationselect').select('×')
		cy.get('#term1select').select('5-5')
		cy.get('#term2select').select('1-1')
		//should always be 5 x 1
		cy.get('#modeselect').select('practice')

		cy.get('#ok').click()
		cy.get('.card').should('have.attr', 'data-card', 'front')
	})

	it('check practice 1 correct - 5 x 1 = 5', function(){
		cy.get('.front .answers').should('contain', '5')
		cy.get('.front .answer').contains('5').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 100%;')

		cy.get('.card').should('have.attr', 'data-answers', '1')
		cy.get('.card').should('have.attr', 'data-valids', '1')
		cy.get('.card').should('have.attr', 'data-errors', '0')
	})

	it('check practice 2 incorrect', function(){
		cy.get('.front .answers').should('contain', '5')
		cy.get('.front .answer:not([data-iscorrect="true"]):first').click()
		cy.get('.front .answers').should('have.attr', 'data-state', 'error')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:first-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 50%;')
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'error')
			.and('have.attr', 'style', 'width: 50%;')

		cy.get('.card').should('have.attr', 'data-answers', '2')
		cy.get('.card').should('have.attr', 'data-valids', '1')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('check practice 2 correct', function(){
		cy.get('.front .answers').should('contain', '5')
		cy.get('.front .answer').contains('5').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			// .and('have.attr', 'style', 'width: 100%;')

		cy.get('.card').should('have.attr', 'data-answers', '3')
		cy.get('.card').should('have.attr', 'data-valids', '2')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('check practice 3 correct', function(){
		cy.get('.front .answers').should('contain', '5')
		cy.get('.front .answer').contains('5').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 25%;')

		cy.get('.card').should('have.attr', 'data-answers', '4')
		cy.get('.card').should('have.attr', 'data-valids', '3')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('check practice 4 - all incorrects', function(){
		cy.get('.front .answers').should('contain', '5')
		cy.get('.front .answer[data-incorrect="true"]').click( { multiple: true } )
		cy.get('.front .answers').should('have.attr', 'data-state', 'error')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'error')

		cy.get('.front .answer').contains('5').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')

		cy.get('.card').should('have.attr', 'data-answers', '8')
		cy.get('.card').should('have.attr', 'data-valids', '4')
		cy.get('.card').should('have.attr', 'data-errors', '4')

	})

	it('.click cog button to go to options card back', function(){
		cy.get('#cog').click()
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('.click info to display infomode', function(){
		cy.get('.option.mode button.info').click()
		cy.get('.infomode').should('be.visible')
		cy.get('.option.mode button.info').click()
		cy.get('.infomode').should('not.be.visible')
	})

	it('test mode should display number cards select', function(){
		cy.get('#testnumberselect').should('not.be.visible')
		cy.get('#modeselect').select('test')
		cy.get('#testnumberselect').should('be.visible')
		cy.get('#modeselect').select('practice')
		cy.get('#testnumberselect').should('not.be.visible')
		cy.get('#modeselect').select('test')
		cy.get('#testnumberselect').should('be.visible')
	})

	it('test 100 mode progress bar width check', function(){
		cy.get('#testnumberselect').select('100')
		cy.get('#ok').click()
		cy.get('.card').should('have.attr', 'data-card', 'front')

	})

	it('click incorrect answer', function(){
		cy.get('.front .answer:not([data-iscorrect="true"]):first').click()
		cy.get('.front .answers').should('have.attr', 'data-state', 'error')
		cy.get('.card').should('have.attr', 'data-answers', '1')
		cy.get('.card').should('have.attr', 'data-valids', '0')
		cy.get('.card').should('have.attr', 'data-errors', '1')

		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar')
			.should('have.class', 'error')
			.and('have.attr', 'style', 'width: 1%;')

		cy.get('.card').should('have.attr', 'data-answers', '1')
		cy.get('.card').should('have.attr', 'data-valids', '0')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('click correct answer 2', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 1%;')

		cy.get('.card').should('have.attr', 'data-answers', '2')
		cy.get('.card').should('have.attr', 'data-valids', '1')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('open options during test', function(){
		cy.get('#cog').click();
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('close options to continue test', function(){
		cy.get('#close').click();
		cy.get('.card').should('have.attr', 'data-card', 'front')
	})

	it('click correct answer 3', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 1%;')

		cy.get('.card').should('have.attr', 'data-answers', '3')
		cy.get('.card').should('have.attr', 'data-valids', '2')
		cy.get('.card').should('have.attr', 'data-errors', '1')
	})

	it('open options during test', function(){
		cy.get('#cog').click();
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('ok to restart test', function(){
		cy.get('#ok').click();
		cy.get('.card').should('have.attr', 'data-card', 'front')
		cy.get('.card').should('have.attr', 'data-answers', '0')
		cy.get('.card').should('have.attr', 'data-valids', '0')
		cy.get('.card').should('have.attr', 'data-errors', '0')
	})

	it('click correct answer 1', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 1%;')

		cy.get('.card').should('have.attr', 'data-answers', '1')
		cy.get('.card').should('have.attr', 'data-valids', '1')
		cy.get('.card').should('have.attr', 'data-errors', '0')
	})

	it('open options during test', function(){
		cy.get('#cog').click();
		cy.get('.card').should('have.attr', 'data-card', 'back')
		cy.wait(1000);
	})

	it('open logs', function(){
		cy.get('#logs').should('be.visible')
		cy.get('#logs').click()
		cy.get('.log').should('be.visible')
		cy.get('.log tbody tr').should('have.length', 2)
		cy.screenshot()
	})

	it('delete logs', function(){
		cy.get('#delete_logs').should('be.visible')
		cy.get('#delete_logs').click()
		cy.get('.log tbody tr').should('have.length', 0)
	})

	it('close logs', function(){
		cy.get('#logs').should('be.visible')
		cy.get('#logs').click()
		cy.get('.logs').should('not.be.visible')
	})

	/*
		
	check math 

	*/


})
