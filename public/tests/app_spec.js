describe('LearnJS', function() {
	it('can show a problem view', function() {
		learnjs.showView('#problem-1');
		expect($('.view-container .problem-view').length).toEqual(1);
	});
	it('Shows the landing page view when there is no hash', function() {
		learnjs.showView('');
		expect($('.view-container .landing-view').length).toEqual(1);
	});
	it('passes the hash view parameter to the view function', function() {
		spyOn(learnjs, 'problemView');
		learnjs.showView('#problem-42');
		expect(learnjs.problemView).toHaveBeenCalledWith('42');
	});
		it('invokes the router when loaded', function() {
		spyOn(learnjs, 'showView');
		learnjs.appOnReady();
		expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
	});
	it('subscribes to the hash change event', function() {
		learnjs.appOnReady();
		spyOn(learnjs, 'showView');
		$(window).trigger('hashchange');
		expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
	});
	
	describe('problem view', function() {
		var view;
		beforeEach(function() {
			view = learnjs.problemView('1');
		});
		
		it('has a title that includes the problem number', function() {
			expect(view.find('.title').text()).toEqual('Problem #1');
		});
		
		it('shows the description', function() {
			expect(view.find('[data-name="description"]').text()).toEqual('Hvad er sandhed?');
		});
		
		it('shows the problem code', function() {
			expect(view.find('[data-name="code"]').text()).toEqual('function problem() { return __; }');
		});
		
		describe('answer section', function() {
			var resultFlash;
			
			beforeEach(function() {
				spyOn(learnjs, 'flashElement');
				resultFlash = view.find('.result');
			});
			
			describe('When the ansver is correct', function() {
				beforeEach(function() {					
				  view.find('.answer').val('true');
				  view.find('.check-btn').click();
				});
				
				it('flashes the result', function() {
					var flashArgs = learnjs.flashElement.calls.argsFor(0);
					expect(flashArgs[0]).toEqual(resultFlash);
					expect(flashArgs[1].find('span').text()).toEqual('Rigtigt!');
				});
				
				it('kan vise link til næste problem', function() {
					var link = learnjs.flashElement.calls.argsFor(0)[1].find('a');
					expect(link.text()).toEqual('Næste Problem');
					expect(link.attr('href')).toEqual('#problem-2');
				});
			});
			
			it('afviser et ukorrekt svar', function() {
				view.find('.answer').val('false');
				view.find('.check-btn').click();
				expect(learnjs.flashElement).toHaveBeenCalledWith(resultFlash, 'Forkert!');
			});
		});
	});
});


