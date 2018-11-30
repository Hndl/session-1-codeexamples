class Cell {
	constructor (_x, _y, _obj){
		this._obj = _obj || null
		this.x= _x
		this.y= _y
	}
	makeCoordinatesKey (_x, _y) {
		return ('key:'+_x + ':' + _y)
	}
	key () {
		return ( this.makeCoordinatesKey ( this.x, this.y ) )
	}
	setObject ( _o ) {
		this._obj = _o;
	}
	getObject () {
		return ( this._obj);
	}
	match ( _x, _y) {
		return ( this.key() === this.makeCoordinatesKey( _x, _y ))
	}
	toString () {
		return ( 'Cell:' + this.x + ':' + this.y )
	}
}

/*
 * grid
 * Network of uniformly spaced parallel lines intersecting at right angles. When superimposed on a map, 
 * it usually carries the name of the projection used for the map- that is, Lambert grid, transverse 
 * Mercator grid, universal transverse Mercator grid.
 */
class Grid {
	
	constructor( _noOfRows, _noOfCols) {

		this.noOfRows  = _noOfRows;
		this.noOfCols  = _noOfCols;
		this.cells = []
		this.DEBUG = false;

		for ( let column = 0 ; column < this.noOfCols ; column++){
			for ( let row = 0 ; row < this.noOfRows ; row++){
				this.cells.push( new Cell (column,row ) )
			}
		}
	}


	getCell( _column, _row) {
		return ( this.cells[this.getCellIndexByXY(_column,_row, this.noOfCols)] )
	}

	

	getCells() {
		return ( this.cells )
	}

	getCellIndexByXY ( _x, _y , _width){
		let i = (_x * _width ) + _y
		
		if (this.DEBUG)
			console.log ('getCellIndexByXY:' + _x + ':' + _y + ' - ' + _width + ' = ' + i)
		
		return ( i)
	}


	
	
	
}//End Grid
