var containerDOM = elm("container");

var UNIT = 1/5.5;
var PIECE_SIZE = 0.14;
var COLORS = [ "#EC6D71", "#F08300", "#F6AD49", "#C3D825", "#839D5C", "#2A83A2", "#706CAA" ];

var level = 0;

var pieces = [];
var positions = [];
var inactiveWords = [];
var activeWords = [];
var activeLettersLength = 0;
var colorIndex = 0;

var currentWordIdentifier = "", currentColor = "";
var answeringString = "";
var answeringPieceIndexes = [];

for( var i = 0; i < 18; i++ ){
	pushPiece( i );
	positions.push( i );
}

function pushPiece( n ){
	var d = document.createElement("div");
	d.className = "piece";
	var l = document.createElement("span");
	l.className = "pieceLabel";
	l.innerHTML = n;
	d.appendChild(l);
	pieces.push({
		wordIdentifier:null,
		dom:d
	});
	cursorTracker.set( d, (function( n ){
		return function( e ){
			if( e.type != "start" ){
				return false;
			}
			handleTouch( n );
		};
	})( n ) );
	containerDOM.appendChild(d);
}

window.addEventListener( "load", function(){
	//inactiveWordsリストにWORDSリストの中身をクローン
	for( var h = 0; h < WORDS[0].length; h++ ){
		inactiveWords.push( {
			identifier: h,
			k: WORDS[0][h].k,
			rk: WORDS[0][h].k
		} );
	}
	
	initiallize();
} );

function initiallize(){
	for( var h = 0; h < 18; h++ ){
		pieces[h].dom.style.color = "#888";
		pieces[h].dom.style.backgroundColor = "#FFF";
		setTimeout( (function( h ){
			return function(){
				setPositionToPiece( h, -1 );
			};
		})( h ) , h*10 );
	}
	
	setTimeout( function(){
		for( var i = 0; i < 18; i++ ){
			setLetterToPiece( i );
			setTimeout( (function( i ){
				return function(){
					setPositionToPiece( i, positions[i] );
				};
			})( i ), 20 * i );
		}
	}, 1000 );
}

//新規文字を割り当てる
function setLetterToPiece( n ){
	//activeWordsリストに不足分があればinactiveWordsリストから追加
	while( activeLettersLength < 18 ){
		var iwn = Math.floor( Math.random() * inactiveWords.length );
		activeLettersLength += inactiveWords[iwn].k.length;
		inactiveWords[iwn].color = COLORS[ colorIndex ];
		activeWords.push( inactiveWords[iwn] );
		inactiveWords.splice( iwn, 1 );
		
		colorIndex++;
		if( colorIndex >= COLORS.length ){
			colorIndex = 0;
		}
	}
	
	var p = pieces[n];
	
	//単語の割り当て
	var wi = Math.floor( Math.random() * activeWords.length/2 );
	var li = Math.floor( Math.random() * activeWords[wi].rk.length );
	var tl = activeWords[wi].rk.charAt(li);
	activeWords[wi].rk = activeWords[wi].rk.substr(0,li) + activeWords[wi].rk.substr(li+1);
	
	p.letter = tl;
	p.color = activeWords[wi].color;
	p.wordIdentifier = activeWords[wi].identifier;
	p.dom.childNodes[0].innerHTML = tl;
	p.dom.style.color = activeWords[wi].color;
	p.dom.style.backgroundColor = "#FFF";
	
	//使い切った単語をリセットしてinactiveに戻す
	if(activeWords[wi].rk.length <= 0 ){
		activeWords[wi].rk = activeWords[wi].k;
		inactiveWords.push( activeWords[wi] );
		activeLettersLength -= activeWords[wi].k.length;
		activeWords.splice( wi, 1 );
	}
}

function setPositionToPiece( dn, pn ){
	var pc = pieces[dn];
	if( pn >= 0 ){
		var p = getPiecePosition( pn, UNIT );
		pc.dom.style.top = ( 0.5 - p.y - PIECE_SIZE/2 ) * 100 + "%";
		pc.dom.style.left = ( 0.5 - p.x - PIECE_SIZE/2 ) * 100 + "%";
	}	else{
		pc.dom.style.top = "43%";
		pc.dom.style.left = "43%";
	}
	pc.dom.style.zIndex = 1;
	setTimeout( function(){
		pc.dom.style.zIndex = 0;
	}, 210 );
}

function handleTouch( n ){
	var p = pieces[n];
	p.dom.style.color = "#FFF";
	p.dom.style.backgroundColor = p.color;
	
	var answer = WORDS[level][p.wordIdentifier].k;
	answeringString += p.letter;
	
	var isFirstTime = ( currentWordIdentifier == "" && currentColor == "" );
	var isPropertiesMatch = ( currentWordIdentifier == p.wordIdentifier && currentColor == p.color );
	var isOrderMatch = ( answer.indexOf( answeringString ) == 0 );
	if( (isFirstTime || isPropertiesMatch) && isOrderMatch ){
		currentWordIdentifier = p.wordIdentifier;
		currentColor = p.color;
		answeringPieceIndexes.push( n );
		if( answeringString == answer ){
			goNextWord();
			currentWordIdentifier = "";
			currentColor = "";
			answeringString = "";
			answeringPieceIndexes = [];
		}
	}else{
		initiallize();
		currentWordIdentifier = "";
		currentColor = "";
		answeringString = "";
		answeringPieceIndexes = [];
	}
}

function goNextWord(){
	for( var i = 0; i < answeringPieceIndexes.length; i++ ){
		setTimeout( (function( tpi ){
			return function(){
				setPositionToPiece( tpi, -1 );
				setTimeout( function(){
					var tp = pieces[tpi];
					setLetterToPiece( tpi );
					setPositionToPiece( tpi, positions[tpi] );
				}, 400 );
			};
		} )( answeringPieceIndexes[i] ), 20*i );
	}
	
	elm("centerPiece").style.boxShadow = "1px 1px 20px 20px " + currentColor;
	elm("centerPiece").style.backgroundColor = currentColor;
	setTimeout( function(){
		elm("centerPiece").style.backgroundColor = "#FFF";
		elm("centerPiece").style.boxShadow = "";
	}, 400 );
}