!function($){var t={app:$(".app"),output:$(".equation"),outputm:$(".message"),output1:$(".term1"),output2:$(".term2"),outputo:$(".operation"),input:$(".result"),timer:$(".timer-value")},e={hearts:".hearts",success:".success",errors:".errors",rounds:".rounds",combo:".combo",score:".score"},o={errors:0,success:0,rounds:0,continued_success:0,combo:1,score:0},s={max_errors_allowed:5,pause_game_allowed:!1,range_active:[0,9],range_passive:[0,9],range_total:[0,20],init_timeout:1e4},u={result:null,timer:setTimeout(function(){},1),timeout:s.init_timeout},r=function(t){return Math.round(Math.random()*t[1]+t[0])},n=function(t){var e=r(t),o=r([0,e]),s=e-o,u={terms:[o,s],opperation:"+",result:e};return u},a=function(){i(),t.timer.animate({width:"0%"},u.timeout,"linear"),u.timer=setTimeout(function(){l()},u.timeout)},i=function(){clearTimeout(u.timer),t.timer.stop(),t.timer.css({width:"100%"})},c=function(){var t=r(s.range_active),e=r(s.range_passive);if(u.result=t+e,u.reslut<=s.max_total){var o={terms:[t,e],opperation:"+"};return o}c()},m=function(){var t=n(s.range_total);return u.result=t.result,a(),t},l=function(){t.input.val()==u.result?p():d(),setTimeout(function(){t.input.removeClass("success error")},1e3),C()},p=function(){t.input.addClass("success"),o.success++,o.continued_success++,o.continued_success>=o.combo+1&&o.combo<8&&(o.combo++,o.continued_success=1,u.timeout>5e3&&(u.timeout-=1e3)),o.score+=1*o.combo},d=function(){t.input.addClass("error"),o.errors++,o.continued_success=0,o.combo=1,u.timeout=s.init_timeout,f()},f=function(){var t=$(e.hearts+" :not(.broken).fa-heart");$(t.get(t.length-1)).addClass("broken")},_=function(){$.each(e,function(t,e){"hearts"!=t&&$(e).html(o[t])}),t.input.val("")},h=function(){s.pause_game_allowed&&(i(),t.outputm.html("Paused"),t.app.addClass("paused"),u.result=!1)},v=function(){i(),t.app.addClass("gameover"),t.outputm.html("<i class='fa fa-frown-o'></i> GAME OVER"),t.input.find(".message","Click to play"),$(".mark").append('<div class="button restart">Restart</div>'),u.result=Math.random()},g=function(){i(),$(".button.restart").remove(),t.app.removeClass("gameover"),t.app.removeClass("paused"),t.outputm.html(""),u.result=!1,o.errors=0,o.success=0,o.rounds=0,o.continued_success=0,o.combo=1,o.score=0,w(),t.input.trigger("focus"),setTimeout(C,100)},b=function(){t.input.on("focusin",function(){u.result||setTimeout(C,100)}),t.input.on("focusout",function(){o.errors<s.max_errors_allowed&&h()}),t.input.on("keyup",function(t){13!=t.which&&$(this).val()!=u.result||l()}),$(".app").on("click",".restart.button",function(t){g()}),$()},w=function(){$(e.hearts).html("");for(var t=1;t<=s.max_errors_allowed;t++)$(e.hearts).append("<i class='fa fa-heart'></i>")},C=function(){if(t.app.removeClass("paused"),o.rounds++,_(),o.errors>=s.max_errors_allowed)v();else if(!$(":focus").hasClass("result")&&s.pause_game_allowed&&o.rounds>1)h();else{var e=m();t.outputm.html(""),t.output1.html(e.terms[0]),t.output2.html(e.terms[1]),t.outputo.html(e.opperation)}};w(),b()}(jQuery);