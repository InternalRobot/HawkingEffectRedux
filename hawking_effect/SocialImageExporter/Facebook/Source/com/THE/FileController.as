package com.THE {


	import flash.display.Stage;
	import flash.display.Bitmap; 
	import flash.display.BitmapData; 
	import flash.display.JPEGEncoderOptions;
	
	import flash.filesystem.File; 
	import flash.filesystem.FileMode; 
	import flash.filesystem.FileStream;

	import flash.utils.ByteArray; 
	
	import flash.geom.Matrix;
	
	import flash.events.Event; 
	import flash.events.OutputProgressEvent; 
	import flash.events.IOErrorEvent; 
	
	import com.adobe.images.JPGEncoder
	
	import com.global.GlobalVars; 
	
	
	public class FileController {

		private var theStage:Stage; 
		private var hash:String; 
		private var slug:String;
		private var filePath:String; 

		public function FileController() {
			// constructor code
		}
		
		public function initFileController():void{
			trace('initFileController');
			
			theStage = GlobalVars.THE_STAGE;
			
			
			theStage.addEventListener('generateFile', generateFile);
		}
		
		public function generateFile(e:Event):void{
			trace('Generating File...');
			
			hash = GlobalVars.HASH; 
			slug = GlobalVars.SLUG;
			
			trace(theStage.stageWidth, theStage.stageHeight);
			//write bitmap data
			var bitmapData = new BitmapData(theStage.stageWidth,theStage.stageHeight);
			bitmapData.draw(theStage, null);
			//trace(bitmapData.height, bitmapData.height);
			//bitmapData.draw(
			var bitmap : Bitmap = new Bitmap(bitmapData);
			var jpg:JPGEncoder = new JPGEncoder(100);
			var ba:ByteArray = jpg.encode(bitmapData);
			
			//save without dialogue
			var fs:FileStream = new FileStream();
			
			fs.addEventListener(Event.CLOSE, fileComplete); 
			fs.addEventListener(OutputProgressEvent.OUTPUT_PROGRESS, fileProgress); 
			fs.addEventListener(IOErrorEvent.IO_ERROR, fileError); 
			
			trace('filename = ' + hash + '.jpg');
			var dir:File = File.desktopDirectory.resolvePath("images"); 
			dir.createDirectory(); 
			
			var targetFile : File = File.desktopDirectory.resolvePath("social/" + slug + ".jpg");

			fs.openAsync(targetFile, FileMode.WRITE);
			fs.writeBytes(ba);
			fs.close();
			
			

		}
		
		private function fileComplete(e:Event):void{
			trace('file write complete!');
			theStage.dispatchEvent(new Event('fileWriteComplete'));
		}
		
		private function fileProgress(e:OutputProgressEvent):void{
			
	//		trace(e.bytesPending / e.bytesTotal);
			var progressRatio:Number = (1 - (e.bytesPending / e.bytesTotal));
   
	//		trace(progressRatio);
	
		}
		
		private function fileError(e:IOErrorEvent):void{
			trace('error writing to file!');
		}
		
		
	}
	
}
