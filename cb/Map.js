
class Rectangle  {
	constructor ( _x, _y, _w , _h){
		this.x = _x;
		this.y = _y;
		this.w = _w;
		this.h = _h;
	}

	isInside ( _x, _y ) {
		return (
			_x >= this.x && _x < (this.x+this.w) &&
			_y >= this.y && _y < (this.y+this.h)
			)
	}

	distanceFrom ( _r1 ) {

		const CURRENTCELL = 1
	
		let diffCol = ( this.col > _r1.col) ?
			this.col - _r1.col  :
			 _r1.col - this.col

		let diffRow = ( this.row > _r1.row ) ? 
			this.row - _r1.row : 
			_r1.row - this.row 
		
		//console.log('col diff:' + diffCol + ' diff row:' + diffRow + ' - ' + diffCol + diffRow)
		return ( diffCol+ diffRow + CURRENTCELL)
	}
}

class Coordinate extends Rectangle {

	constructor ( _col, _row, _x, _y, _w, _h) {
		super ( _x, _y, _w, _h) 
		this.col = _col
		this.x = _x
		this.y = _y
		this.h = _h
		this.w = _w
		this.row = _row
		this.highlighted = false;
		this.pin = null;
		
			}
	hasPin () {
		return ( this.pin != null )
	}

	clearPin (){
		this.pin = null
	}

	highlight ( _b ){
		this.highlighted = _b 
	}


	dropPin( _type, _label) {
		if ( _type === null )
			return ;

		this.pin = null
		
		//console.log('dropPin:' + _type)
		
		switch (_type ) {
			case 'CAR':
				this.pin = new Car ( this.col, this.row, this.x, this.y, this.w, this.h,_label)
				break;
			case 'PETROL_STATION' :
				this.pin = new PetrolStation ( this.col, this.row, this.x, this.y, this.w, this.h, _label)
				break;
		}

		return ( this.pin )
		
	}

	draw( _canvas) { 
		
		if ( this.highlighted) {

			let border = 5
			push()
			
			strokeWeight (5) 
			stroke(0,255,0)
			rect(this.x + border, 
				 this.y + border, 
				 this.w - (border*2), 
				 this.h - (border*2))
			pop()

		}

		if ( this.pin != null )
			this.pin.draw( _canvas)	
	}
}

class Pin extends Rectangle {
	constructor ( _pintype, _col, _row, _x, _y, _w, _h,_label) {
		super ( _x, _y, _w, _h) 
		this.col = _col
		this.row = _row
		this.pintype = _pintype
		this.flashing = false
		this.label = _label
	}
	
	isPinType ( _t ) {
		return (_t === this.pintype)
	}

	draw(_canvas, txt) {
		
		push()
		let txtSize = 15
		strokeWeight(1)
		stroke(0,0,255)
		textSize(txtSize)
		text(txt, this.x, this.y+txtSize)
		pop()
	}

	flash( _b ) {
		//console.log( 'Pin:' + this.label + ' flashing:' + _b)
		this.flashing = _b
	}


}

class Car extends Pin {

	constructor (  _col, _row, _x, _y, _w, _h,_label) {
		super ( 'CAR',_col,_row,_x, _y, _w, _h,_label) 

	}

	draw(_canvas) {

		super.draw(_canvas,'X:'+this.col + ' Y:' + this.row)

		let centreX = this.x+(this.w*0.5)
		let centreY = this.y+(this.h*0.5)
		
		push()
		strokeWeight(1)
		stroke(0,0,255)
		ellipse(centreX, centreY,30)
		textSize(15)
		text('C', centreX-5, centreY)
		pop()

	}
}

class PetrolStation extends Pin {

	constructor (  _col, _row, _x, _y, _w, _h, _label) {
		super ( 'PETROLSTATION',_col,_row,_x, _y, _w, _h,_label) 
		this.drawCounter = 0
		
	}

	draw(_canvas) {

		super.draw(_canvas,'X:'+this.col + ' Y:' + this.row)

		let centreX = this.x+(this.w*0.5)
		let centreY = this.y+(this.h*0.5)
	
		push()
		rectMode(CENTER)
		strokeWeight(2)
		
		if ( this.flashing) {
			stroke(0,255,0)	
					
		} else {
			stroke(255,0,0)		
		}

		

		rect(centreX, centreY,30,30)
		textSize(15)
		text(this.label, centreX-10, centreY+5)
		pop()
		
	}
}



/*
 * Program in the language of the domain....
 * map
 * Graphic representation of the physical features (natural, artificial, or both) 
 * of a part or the whole of the Earth's surface, by means of signs and symbols or photographic 
 * imagery, at an established scale, on a specified projection, and with the means of orientation indicated.
 */

class Map extends Grid {

	constructor ( _noOfRows, _noOfCols) {
		super ( _noOfRows, _noOfCols)
		this.DEBUG = false
		this.default_LINETHICKNESS = 1
		this.default_LINECOLOR_BLACK = 0
		this.default_LINECOLOR_RED = 255
		this.default_LINE_HIGHLIGHT = 5
		this.default_LINE_HIGHLIGHG_BORDER = 5
		this.pins = []
		
	}



	highlightCell ( _mouseX, _mouseY) {

		let targetCoordinate = null;
		
		for ( let column = 0 ; column < this.noOfCols ; column++){
			for ( let row = 0 ; row < this.noOfRows ; row++){
				
				let cell = super.getCell(column,row);
				let coordinate = cell.getObject()
				
				if ( coordinate != null ) {
					
					if ( coordinate.isInside( _mouseX, _mouseY ) ) {
						targetCoordinate = coordinate;
						coordinate.highlight(true)

					}else { 
					
						coordinate.highlight(false)
					}

					
				}
			}
		}

		return ( targetCoordinate)

	}

	removePins () {

		for ( let column = 0 ; column < this.noOfCols ; column++){
			for ( let row = 0 ; row < this.noOfRows ; row++){
				
				let cell = super.getCell(column,row);
				let coordinate = cell.getObject()
				
				if ( coordinate != null ) {
					
					coordinate.clearPin()
					
				}
			}
		}
		this.pins = []

		return true;

	}

	
	

	draw( _canvas , _border, _gridColor, _lineThickness) {

		if ( _canvas === null ) 
			return false

		_lineThickness = _lineThickness || this.default_LINETHICKNESS
		_gridColor = _gridColor || this.default_LINECOLOR_BLACK

		this.rowHeight = Math.floor((_canvas.height  - _border)/ this.noOfRows)
		this.colWidth = Math.floor((_canvas.width - _border)  / this.noOfCols)

		/*
		 * rectMode(CORNER) - interprets the first two parameters of rect() 
		 * as the upper-left corner of the shape, while the third and fourth 
		 * parameters are its width and height
		 */
		rectMode(CORNER)
		
		for ( let column = 0 ; column < this.noOfCols ; column++){
			for ( let row = 0 ; row < this.noOfRows ; row++){

				let drawFromY = (row*this.rowHeight)+(_border/2);
				let drawFromX = (column*this.colWidth)+(_border/2);
				
				let cell = super.getCell(column,row);
				let coordinate = cell.getObject()

				if ( coordinate === null ) {
				
					cell.setObject (
						new Coordinate (
							column, 
							row,
							drawFromX,
							drawFromY,
							this.colWidth, 
							this.rowHeight
							))
				}
				
				push()
				strokeWeight ( this.default_LINETHICKNESS) 
				stroke( this.default_LINECOLOR_BLACK)
				rect(drawFromX, drawFromY, this.colWidth, this.rowHeight);

				if (coordinate != null )
					coordinate.draw()

				pop()
				
				if (this.DEBUG)
					console.log('Drawing:' + column + ':' + row + ' - associated cell:' + cell.toString() + ' isMatch:' + cell.match(column,row))
			}
			
		}

	}//End Draw




}
