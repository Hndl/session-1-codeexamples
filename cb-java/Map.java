
public class Map {
	public static final Exception INVALID_ARG = new Exception ("e9001 - Coordinate: Invalid Arg");
	public static final String COORDINATE_SEPERATOR = ":";
	
	
	static class Coordinate  {
		public int x = -1;
		public int y = -1;
		public String label = "";
		Coordinate(String _xy, String _label) throws Exception {
			if ( _xy == null )
				throw  Map.INVALID_ARG;
			
			java.util.StringTokenizer st = 
					new java.util.StringTokenizer (
							_xy , 
							Map.COORDINATE_SEPERATOR, 
							false);
			
			if ( st.countTokens() == 2 ) {
			
				this.x = Integer.parseInt(st.nextToken());
				this.y = Integer.parseInt(st.nextToken());
			
			}
			this.label = _label;
		}
		
		public String toString() {
			return ( this.label + " @[" + this.x + Map.COORDINATE_SEPERATOR + this.y + "]");
		}
		boolean isValid() {
			return ( this.x > 0 && this.y >0 );
		}
		
		private final int calculateDistance ( int x1, int x2){
			return (( x1 > x2 ) 
					? (x1 - x2 ) 
					: (x2 - x1 ));
		}
		
		int distanceFrom ( Map.Coordinate b) {
			
			int r = -1;
			
			if ( !this.isValid() 
				|| b == null 
				|| !b.isValid()) 
				return (r);
			
			int dX = calculateDistance ( this.x, b.x );
			int dY = calculateDistance ( this.y, b.y );
			
			return ( dX + dY );
		}
		
		
	}
	
	
	
	
	public Map (){
	}
	
	public int distanceFrom ( Map.Coordinate a, Map.Coordinate b) {
		
		return ( a.distanceFrom(b));
	}
	
	
	public Map.Coordinate closest ( Map.Coordinate s, Map.Coordinate tA, Map.Coordinate tB) {
	
		int dA = this.distanceFrom(s, tA);
		int dB = this.distanceFrom(s, tB);
	
		return ( dA<= dB ? tA : tB); 
	
	}
	
	/**
	 * 
	 * @param args
	 * 				arg[0] <car position, specified as <x>:<y>
	 * 				arg[1] <petrol station A position, specified as <x>:<y>
	 * 				arg[2] <petrol station B position, specified as <x>:<y>
	 */
	public static void main(String[] args) {
		
		final int ERR = 1;
		final int OK  = 0;
		int exitCode = ERR;
		
		if ( args.length != 3) {
			
			System.out.println( "Missing args for car[x:y] petrol stationa[x:y] petrol station b[x:y]");
			System.exit(exitCode);
		}
	
		try {
			
			Map.Coordinate car = new Map.Coordinate(args[0], "Car");
			Map.Coordinate petrolStationA = new Map.Coordinate(args[1],"Petrol Station A");
			Map.Coordinate petrolStationB = new Map.Coordinate(args[2],"Petrol Station B");
			
			Map myMap = new Map();
			
			Map.Coordinate nearestPetrolStation 
				= myMap.closest
					(car,
					petrolStationA, 
					petrolStationB);
	
			System.out.println
				( "the " + car.toString() + 
				" is closest to " +
				nearestPetrolStation.toString());
			
			exitCode = OK;
			
		} catch ( Exception e) {
			System.out.println(e.getMessage());
			
		}
		
		System.exit(exitCode);
	}

}
