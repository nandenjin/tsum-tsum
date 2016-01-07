// Common Utils - cursorTracker.js
// Kazumi Inada
// https://github.com/nandenjin/common_utils/wiki

// cursorTracker.js
// 2016.01 v0.2.1 beta

var cursorTracker = {};

( function(){
	var ct = cursorTracker;
	
	if( window.TouchEvent ){
		ct.isTouchEnable = true;
	}else{
		ct.isTouchEnable = false;
	}
	
	ct.set = function( target, callback ){
		target.addEventListener( "mousedown", createHandler( callback ) );
		target.addEventListener( "mousemove", createHandler( callback ) );
		target.addEventListener( "mouseup", createHandler( callback ) );
		target.addEventListener( "touchstart", createHandler( callback ) );
		target.addEventListener( "touchmove", createHandler( callback ) );
		target.addEventListener( "touchend", createHandler( callback ) );
	};
	
	ct.remove =function( target, callback ){
		target.removeEventListener( "mousedown", createHandler( callback ) );
		target.removeEventListener( "mousemove", createHandler( callback ) );
		target.removeEventListener( "mouseup", createHandler( callback ) );
		target.removeEventListener( "touchstart", createHandler( callback ) );
		target.removeEventListener( "touchmove", createHandler( callback ) );
		target.removeEventListener( "touchend", createHandler( callback ) );
	};
	
	ct.getScroll = function( doc ){
		doc = doc || document;
		return {
			x: doc.body.scrollLeft || doc.documentElement.scrollLeft,
			y: doc.body.scrollTop  || doc.documentElement.scrollTop
		};
	};
	
	ct.getDetail = function( e, doc ){
		doc = doc || document;
		var scroll = ct.getScroll( doc );
		
		var result = {};
		result.points = [];
		result.event = e;

		if( e.type == "mousedown" || e.type == "touchstart" ){
			result.type = "start";
		}else if( e.type == "mousemove" || e.type == "touchmove" ){
			result.type = "move";
		} else if (e.type == "mouseup" || e.type == "touchend") {
			result.type = "end";
		}
		
		//マウスボタン押し下げ中もしくはタッチ中にisPressをtrue
		var b = e.buttons;
		if( b > 0 || e.type.indexOf("touch") == 0 ){
			result.isPress = true;
		}else{
			result.isPress = false;
		}
		
		//各ボタンの押し下げ状況
		result.buttons = {
			left: false,
			right: false,
			wheel: false
		};
		if( b >= 4 ){
			result.buttons.wheel = true;
			b -= 4;
		}else if( b >= 2 ){
			result.buttons.right = true;
			b -= 2;
		}else if( b >= 1 ){
			result.buttons.left = true;
			b -=1;
		}
		
		if( e.type.indexOf("mouse") != -1 ){
			result.points[0] = {
				clientX: e.clientX,
				clientY: e.clientY,
				pageX: e.clientX + scroll.x,
				pageY: e.clientY + scroll.y,
				screenX: e.screenX,
				screenY: e.screenY,
				offsetX: e.offsetX,
				offsetY: e.offsetY
			};
		}else{
			var touches = e.touches;
			if( e.type == "touchend" ){
				for( var j = 0; j < e.changedTouches.length; j++ ){
					touches[ touches.length ] = e.changedTouches[j];
				}
			}
			
			var bounding = e.target.getBoundingClientRect();
			
			for( var i = 0; i < touches.length; i++ ){
				var t = touches[i];
				result.points.push( {
					clientX: t.clientX,
					clientY: t.clientY,
					pageX: t.pageX,
					pageY: t.pageY,
					screenX: t.screenX,
					screenY: t.screenY,
					offsetX: t.clientX - bounding.left,
					offsetY: t.clientY - bounding.top
				} );
			}
		}
		return result;
	};
	
	function createHandler( callback ){
		var lastTouchEventTime = 0, lastEventType = "";
		return function( e ){
			var time = new Date().getTime();
			
			//タッチがクリックよりも先に発火する前提
			//対象がマウスイベントの場合、直近のタッチイベントが100msec以上前でなければコールバックを呼ばない
			var IS_MOUSE_DOUBLE_EVENT = ( e.type.indexOf( "mouse" ) == 0 && lastTouchEventTime < time - 100 );
			if( !IS_MOUSE_DOUBLE_EVENT ){
				callback( ct.getDetail( e ) );
			}
			
			if( e.type.indexOf( "touch" ) == 0 ){
				lastTouchEventTime = new Date().getTime();
			}
			lastEventType = e.type;
		};
	}
	
})();
