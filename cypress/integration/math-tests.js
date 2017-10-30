describe('Math Fact Flash App', function(){
	it('.should() - assert that <title> is correct', function(){
		cy.visit('http://local.cc.com/app/math-fact-flash/index.html?cachebuster=1')
		cy.title().should('include', 'Math Flash Cards')
		cy.screenshot()
	})

	it('.click cog button to go to options card back', function(){
		cy.get('#cog').click()
		cy.get('.card').should('have.attr', 'data-card', 'back')
	})

	it('.select() - select an option in a <select> element', function(){
		cy.get('#term1select').select('0-10')
		cy.get('#term2select').select('0-10')
		cy.get('#operationselect').select('+')

		cy.get('#modeselect').select('test')
		cy.get('#testnumberselect').select('5')

	})

	it('.click ok button to go to options card back', function(){
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
		// cy.wait(100)
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 2', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		// cy.wait(100)
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 3', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		// cy.wait(100)
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 4', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		// cy.wait(100)
		cy.get('.front .answer[data-iscorrect="true"]').should('have.class', 'valid')
		cy.wait(1000);
		//check progressbar
		cy.get('.progressbar .bar:last-child')
			.should('have.class', 'valid')
			.and('have.attr', 'style', 'width: 20%;')
	})

	it('click correct answer 5', function(){
		cy.get('.front .answer[data-iscorrect="true"]').click()
		// cy.wait(100)
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

	
	


})
