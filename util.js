function getAreaSize(){
	return Math.min( window.innerWidth, window.innerHeight );
}

function getPiecePosition( n, unit ){
	if( 0 <= n && n <= 11 ){
		if( n % 2 == 0 ){
			return {
				x: Math.cos( Math.PI / 3 * n / 2 ) * unit * 2,
				y: Math.sin( Math.PI / 3 * n / 2 ) * unit * 2
			};
		}else{
			return {
				x: Math.cos( Math.PI / 3 * ( n - 1 ) / 2 + Math.PI / 6 ) * unit * 1.732,
				y: Math.sin( Math.PI / 3 * ( n - 1 ) / 2 + Math.PI / 6 ) * unit * 1.732
			};
		}
	}else if( 12 <= n ){
		return {
			x: Math.cos( Math.PI / 3 * ( n - 12 ) ) * unit,
			y: Math.sin( Math.PI / 3 * ( n - 12 ) ) * unit
		};
	}
}