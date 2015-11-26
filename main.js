var containerDOM = elm("container");
var UNIT = 1/6;
var PIECE_SIZE = 0.12;

for( var i = 0; i < 18; i++ ){
	(function(){
		var p = getPiecePosition( i, UNIT );
		var d = document.createElement("div");
		d.className = "piece";
		d.style.top = ( 0.5 - p.y - PIECE_SIZE/2 ) * 100 + "%";
		d.style.left = ( 0.5 - p.x - PIECE_SIZE/2 ) * 100 + "%";
		var l = document.createElement("span");
		l.className = "pieceLabel";
		l.innerHTML = i;
		d.appendChild(l);
		containerDOM.appendChild(d);
	})();
}