package com.internalrobot.data {
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.ErrorEvent;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	
	import com.global.GlobalVars; 

	public class JSONrequestor extends Sprite{

		private var requestor:URLLoader;
		private var request:URLRequest;
		private var json:Object;

		private var result:Array;

		private var retries:int = 0;
		
		private var unixTime:Number;
		private var startTime:String; 
		private var duration:int; 
		
		private var schedule:Array; 
		
		public function JSONrequestor(url:String, apiRequest:String) {

			trace('requesting JSON from ' + url);

			request = new URLRequest(url); 
			
			request.contentType = "Content-type", "application/json";
			request.method = URLRequestMethod.GET; 
			request.data = apiRequest;
			
			 //Initiate the transaction 
			requestor = new URLLoader(); 
			requestor.dataFormat = URLLoaderDataFormat.TEXT;
			requestor.load(request); 
			
			requestor.addEventListener(IOErrorEvent.IO_ERROR, httpRequestError); 
			requestor.addEventListener(SecurityErrorEvent.SECURITY_ERROR, httpRequestError); 
			requestor.addEventListener(Event.COMPLETE, httpRequestComplete);
			
		}
		
		private function httpStatus(e:Event):void{
			trace ( "Load failed: HTTP Status = " + e );
		}

		private function httpRequestError( e:ErrorEvent ):void{ 
			trace("UH OH!...");
			trace("An error occured: " + e);
			try{
				trace("trying again...");
				
				if (retries > 5){
					retries = 0;
					
					throw new Error("Could not load request");
					
				}else{
					retries++
					requestor.load(request);
				}
			} catch(e:Error){
				trace("An error occured: " + e);     
			}
		}
		
		private function httpRequestComplete(e:Event):void { 
			//trace('httpRequestComplete');
			requestor.removeEventListener(Event.COMPLETE, httpRequestComplete);
			requestor.removeEventListener(IOErrorEvent.IO_ERROR, httpRequestError); 
			requestor.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, httpRequestError); 
			
			json = JSON.parse(e.target.data);
			
			dispatchEvent(new Event('dataReceived'));
			//trace(json);
			//parseJSON(json);
		} 
		
		
		public function getData():Object{
			return json;
		}
		
	}
	
}
