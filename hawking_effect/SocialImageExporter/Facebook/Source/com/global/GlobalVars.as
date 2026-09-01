package com.global  {
	
	import flash.display.Stage;
	
	public class GlobalVars {


			// const			 ************************************************		
			public static const JSON_URL:String 						= "http://images.hawking.hyfn.s3.amazonaws.com/shareables.json";
			public static const FILE_PATH:String 						= "socialImages/";
	
		
			// vars				 ************************************************		
			public static var THE_STAGE:Stage 							= undefined;
			public static var ITERATION:uint							= 0;
			public static var HASH:String								= undefined;
			public static var PATH:Object								= undefined;
			public static var PATH_LENGTH:uint							= undefined;
			public static var SLUG:String								= undefined;
		

		public function GlobalVars() {
			// constructor code
			trace('GlobalVars');
			//const
			
			
		}

	}
	
}
