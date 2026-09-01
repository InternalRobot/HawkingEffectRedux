package  {
	
	import flash.display.MovieClip;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.utils.setTimeout; 
	import flash.desktop.NativeApplication;
	
	import com.THE.DataController;
	import com.THE.DisplayController;
	import com.THE.FileController;
	
	import com.global.GlobalVars; 

	public class THE_ImageExporter extends MovieClip {
		
		private var theStage:Stage; 
		
		private var dataController:DataController; 
		private var displayController:DisplayController;
		private var fileController:FileController; 
		
		public function THE_ImageExporter() {
			// constructor code
			addEventListener(Event.ADDED_TO_STAGE,init,false,0,true);
		}
		
		private function init(e:Event):void{
			removeEventListener(e.type,arguments.callee);
			
			GlobalVars.THE_STAGE = stage;
			theStage = GlobalVars.THE_STAGE;
			
			dataController = new DataController(); 
			displayController = new DisplayController(); 
			fileController = new FileController(); 
			
			dataController.initDataController();
			displayController.initDisplayController(); 
			fileController.initFileController(); 
			
			theStage.addEventListener('closeApp', closeApp);
		}
		
		private function closeApp(e:Event){
			trace('...closing down');
			setTimeout(destroyApp, 1000);
		}
		  
		private function destroyApp():void{
			NativeApplication.nativeApplication.exit(); 
		}
		
	}
	
}
