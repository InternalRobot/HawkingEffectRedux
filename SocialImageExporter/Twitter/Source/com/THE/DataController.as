package com.THE {
	
	import flash.display.Stage;
	import flash.events.Event;
	
	import com.global.GlobalVars;
	import com.internalrobot.data.JSONrequestor;


	public class DataController {

		private var theStage:Stage; 
		
		private var theJSON;
		private var theData:Object; 
		
		private var iteration:uint; 
		
		public function DataController() {
			// constructor code
			
			
		}
		
		public function initDataController():void{
			
			trace('initDataController');
			theStage = GlobalVars.THE_STAGE;
			iteration = GlobalVars.ITERATION; 
			
			theJSON = new JSONrequestor(GlobalVars.JSON_URL, null);
			theJSON.addEventListener('dataReceived', dataReceived);
		}
		
		private function dataReceived(e:Event){
			theJSON.removeEventListener('dataReceived', dataReceived);
			trace('dataReceived');
			theData = theJSON.getData();
			
			//trace(theData);
			
			iterateData(iteration); 
			
			theStage.addEventListener('fileWriteComplete',  nextIteration);
		}
		
		public function iterateData(iteration):void{
			
			/*for (var i in theData){
				trace(theData[i].path);

			}*/
			
			trace('=======================');
			trace(theData.length);
			trace(theData[iteration].hash);
			trace(theData[iteration].path);
			trace(theData[iteration].path.length);
			trace('=======================');
			
			GlobalVars.HASH 		= theData[iteration].hash;
			GlobalVars.PATH			= theData[iteration].path;
			GlobalVars.PATH_LENGTH 	= theData[iteration].path.length;
			
			
			theStage.dispatchEvent(new Event('iterationComplete'));
		}
		
		private function nextIteration(e:Event):void{
			if (iteration != theData.length - 1){
				
				iteration++;
				
				trace('=======================');
				trace(theData.length);
				trace(theData[iteration].hash);
				trace(theData[iteration].path);
				trace(theData[iteration].path.length);
				trace('=======================');
				
				GlobalVars.HASH 		= theData[iteration].hash;
				GlobalVars.PATH			= theData[iteration].path;
				GlobalVars.PATH_LENGTH 	= theData[iteration].path.length;
			
			
				theStage.dispatchEvent(new Event('iterationComplete'));
			}else{
				
				trace('\nALL FILES CREATED!');
				theStage.dispatchEvent(new Event('closeApp'));

			}
		}
		
	}
	
}
