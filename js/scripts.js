/*
 * http://codepen.io/circlecube/pen/AXzxAv
 */

(function($){

/* SETTINGS VARIABLES */

var elements = {
	"app": $(".app"),
  "output": $(".equation"),
  "outputm": $(".message"),
  "output1": $(".term1"),
  "output2": $(".term2"),
  "outputo": $(".operation"),
	"input": $(".result"),
	"timer": $(".timer-value"),
};

var ui = {
	"hearts": ".hearts",
	"success": ".success",
	"errors": ".errors",
	"rounds": ".rounds",
  "combo": ".combo",
  "score": ".score",
}

var output = {
	errors: 0,
	success: 0,
	rounds: 0,
  continued_success: 0,
  combo: 1,
  score: 0,
};

var config = {
	max_errors_allowed: 5,
	pause_game_allowed: false,
	range: [1,9],
  init_timeout: 10000,
}

var cache = {
	"result": null,
	"timer": setTimeout(function(){}, 1),
  "timeout": config.init_timeout,
}




/* UTILERY FUNCTIONS */

var random = function (range)
{
  return Math.ceil(Math.random()*range[1]+range[0]);
}

var startTimeout = function ()
{
  abortTimeout();
  elements.timer.animate({width:'0%'}, cache.timeout, "linear");
  cache.timer = setTimeout(function(){ validate(); }, cache.timeout)
}

var abortTimeout = function ()
{
  clearTimeout(cache.timer)
  elements.timer.stop();
  elements.timer.css({width: "100%"});
}




/* APPLICATION LOGIC FUNCTIONS */

var generateEq = function ()
{
  var pasive = random(config.range)
  var active = random(config.range)
  
  startTimeout();
  
  cache.result = pasive + active
  var equation = {
    'terms': [pasive,active],
    'opperation': '+'
  }
  return equation
}

var validate = function ()
{
  if (elements.input.val() == cache.result)
    success();
  else
  	error();

  setTimeout(function(){elements.input.removeClass("success error")},1000)
  
  run();
}




/* UI ACTIONS */

var success = function ()
{
  elements.input.addClass("success");
  output.success++;
  output.continued_success++;
  if (output.continued_success >= output.combo+1 && output.combo < 8) 
  {
    output.combo++;
    output.continued_success = 1;
    if (cache.timeout > 5000)
      cache.timeout-=1000;
  }
  output.score+=1*output.combo;
}

var error = function ()
{
  elements.input.addClass("error");
  output.errors++;
  output.continued_success = 0;
  output.combo = 1;
  cache.timeout = config.init_timeout;
  breakHeart();
}

var breakHeart = function ()
{
  var h = $(ui.hearts + " :not(.broken).fa-heart"); // Select non-broken hearts
  $(h.get(h.length-1)).addClass("broken");
}

var refreshMark = function ()
{
	$.each(ui, function(key, element)
	{
		if (key == 'hearts') return;
		$(element).html(output[key]);
	})
  elements.input.val("");
}



/* APPLICATION STATUS FUNCTIONS */

var pause = function ()
{
  if ( config.pause_game_allowed ) {
  	abortTimeout();
    elements.outputm.html("Paused")
    elements.app.addClass("paused")
    cache.result = false;
  }
}

var gameover = function ()
{
  abortTimeout();
  elements.app.addClass("gameover");
  elements.outputm.html("<i class='fa fa-frown-o'></i> GAME OVER");
  // elements.input.attr("disabled",1);
  elements.input.find(".message", "Click to play");
  $(".mark").append('<div class="button restart">Restart</div>');
  cache.result = Math.random();
}

var restart = function () 
{
  abortTimeout();
  $('.button.restart').remove();
  elements.app.removeClass("gameover");
  elements.app.removeClass("paused")
  elements.outputm.html("");
  // elements.input.attr("disabled",0);
  // elements.input.find(".message", "Click to play");
  cache.result = false;
  output.errors = 0;
  output.success = 0;
  output.rounds = 0;
  output.continued_success = 0;
  output.combo = 1;
  output.score = 0;
  generateHearts();
  elements.input.trigger('focus');
  setTimeout(run, 100);
}


/* ONE-TIME-RUN FUNCTIONS */

var addListeners = function ()
{
	elements.input.on('focusin', function(){
    if (!cache.result) setTimeout(run, 100);
  });
  
  elements.input.on('focusout', function(){
    if (output.errors < config.max_errors_allowed)
      pause();
  });
  
  elements.input.on('keyup', function(e){
    if (e.which == 13 || ($(this).val()==cache.result)) validate();
  });

  $('.app').on('click', '.restart.button', function(e) {
    restart();
  });

  $()
  
}

var generateHearts = function ()
{
	$(ui.hearts).html("");
	for (var i = 1; i <= config.max_errors_allowed; i++) {
		$(ui.hearts).append("<i class='fa fa-heart'></i>");
	};
}




/* MAIN */

var run = function ()
{
  elements.app.removeClass("paused")
  
	output.rounds++;
  refreshMark();
  
  if (output.errors >= config.max_errors_allowed)
  	gameover()
  else if (!$(":focus").hasClass("result") && config.pause_game_allowed && output.rounds > 1)
		pause()
	else {
    var equation = generateEq();
    elements.outputm.html('');
    elements.output1.html(equation.terms[0]);
    elements.output2.html(equation.terms[1]);
    elements.outputo.html(equation.opperation);
  }
}

/* RUN */
generateHearts();
addListeners();
  
})(jQuery);