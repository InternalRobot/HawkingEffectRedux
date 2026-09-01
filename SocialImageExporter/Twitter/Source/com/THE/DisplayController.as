package com.THE {
	
	import flash.events.Event;
	import flash.display.Stage;
	import flash.text.TextField; 
	import flash.utils.setTimeout; 
	
	import com.global.GlobalVars; 
	
	import com.greensock.TweenLite; 
	import com.greensock.plugins.TweenPlugin; 
	import com.greensock.plugins.ColorTransformPlugin; 
	
	TweenPlugin.activate([ColorTransformPlugin]); //activation is permanent in the SWF, so this line only needs to be run once.
	
	public class DisplayController {

		private var theStage:Stage; 
		private var thePath:Object;
		private var theLength:uint; 
		
		private var startNode:CapNode;
		private var endNode:CapNode;
		private var middleNode0:MiddleNode; 
		private var middleNode1:MiddleNode; 
		private var middleNode2:MiddleNode; 
		
		private var startDot:Dot; 
		private var midDot0:Dot; 
		private var midDot1:Dot; 
		private var midDot2:Dot; 
		private var endDot:Dot; 
		
		private var drift:uint = 12;
		
		public function DisplayController() {
			// constructor code
		}
		
		public function initDisplayController():void{
			trace('initDisplayController');
			
			theStage = GlobalVars.THE_STAGE;
			
			
			theStage.addEventListener('iterationComplete', updateDisplay);
			
			var nodeString:String = 'startNode';
			startNode = new CapNode(); 
			startNode.name = 'startNode'; 
			startNode.x = 57;
			startNode.y = 80;
			startNode.nodeText.text = nodeString.toUpperCase();
			theStage.addChild(startNode);

			nodeString = 'node 0';
			middleNode0 = new MiddleNode(); 
			middleNode0.name = 'middleNode0'; 
			middleNode0.x = 57;
			middleNode0.y = 115;
			middleNode0.nodeText.text = nodeString.toUpperCase();
			theStage.addChild(middleNode0);
			
			nodeString = 'node 1';
			middleNode1 = new MiddleNode(); 
			middleNode1.name = 'middleNode1'; 
			middleNode1.x = 57;
			middleNode1.y = 145;
			middleNode1.nodeText.text = nodeString.toUpperCase();
			theStage.addChild(middleNode1);
			
			nodeString = 'node 2';
			middleNode2 = new MiddleNode(); 
			middleNode2.name = 'middleNode2'; 
			middleNode2.x = 57;
			middleNode2.y = 175;
			middleNode2.nodeText.text = nodeString.toUpperCase();
			theStage.addChild(middleNode2);
			
			nodeString = 'endNode';
			endNode = new CapNode(); 
			endNode.name = 'endNode'; 
			endNode.x = 57;
			endNode.y = 210;
			endNode.nodeText.text = nodeString.toUpperCase();
			theStage.addChild(endNode);
			
			//--------------------------------------------------
			
			startDot = new Dot(); 
			startDot.name = 'startDot'; 
			startDot.scaleX = .25;
			startDot.scaleY = .25;
			startDot.x = 45;
			startDot.y = 80 + drift;;
			theStage.addChild(startDot); 
			
			midDot0 = new Dot(); 
			midDot0.name = 'midDot0'; 
			midDot0.scaleX = .2;
			midDot0.scaleY = .2;
			midDot0.x = 45;
			midDot0.y = 115 + drift;;
			theStage.addChild(midDot0);
			
			midDot1 = new Dot();
			midDot1.name = 'midDot1'; 
			midDot1.scaleX = .2;
			midDot1.scaleY = .2;
			midDot1.x = 45;
			midDot1.y = 145 + drift;; 
			theStage.addChild(midDot1);
			
			midDot2 = new Dot();
			midDot2.name = 'midDot1'; 
			midDot2.scaleX = .2;
			midDot2.scaleY = .2;
			midDot2.x = 45;
			midDot2.y = 175 + drift;; 
			theStage.addChild(midDot2);
			
			endDot = new Dot(); 
			endDot.name = 'endDot'; 
			endDot.scaleX = .25;
			endDot.scaleY = .25;
			endDot.x = 45;
			endDot.y = 210 + drift;
			theStage.addChild(endDot);
			
			TweenLite.to(startDot, .25, {colorTransform:{tint:0x7FABB3, tintAmount:1}}); 
			TweenLite.to(midDot0, .25, {colorTransform:{tint:0xb34342, tintAmount:1}}); 
			TweenLite.to(midDot1, .25, {colorTransform:{tint:0xddbd42, tintAmount:1}}); 
			TweenLite.to(midDot2, .25, {colorTransform:{tint:0xddbd42, tintAmount:1}}); 
			TweenLite.to(endDot, .25, {colorTransform:{tint:0x7FABB3, tintAmount:1}}); 
			
		}

		private function updateDisplay(e:Event):void{
			trace('Updating Display...');
			
			thePath = GlobalVars.PATH;
			theLength = GlobalVars.PATH_LENGTH;
			
			//trace(thePath[0]);
			
			var nodeString:String = thePath[0];
			this['startNode'].nodeText.text = nodeString.toUpperCase();
			endNode.nodeText.text = 'ME';
			
			switch (theLength){
				case 1:
					
				break; 
				case 2:
					
					for(var i:int=0; i<theLength - 1; i++ ) {
						//var nodeString:String = 'node' + i.toString();
						nodeString = thePath[i+1];
						this['middleNode'+i].nodeText.text = nodeString.toUpperCase();
					}
					
					this['middleNode' + 1].nodeText.text = "";
					this['middleNode' + 2].nodeText.text = "";
					
					midDot0.visible = true; 
					midDot1.visible = false; 
					midDot2.visible = false; 
					
				break; 
				case 3:
					for(i = 0; i<theLength - 1; i++ ) {
						nodeString = thePath[i+1];
						this['middleNode'+i].nodeText.text = nodeString.toUpperCase();
					}
					this['middleNode' + 2].nodeText.text = "";
					
					midDot0.visible = true; 
					midDot1.visible = true; 
					midDot2.visible = false;
					
				break; 
				case 4:
					for(i = 0; i<theLength - 1; i++ ) {
						nodeString = thePath[i+1];
						this['middleNode'+i].nodeText.text = nodeString.toUpperCase();
					}
					
					midDot0.visible = true; 
					midDot1.visible = true; 
					midDot2.visible = true;
				//this['middleNode' + 3].nodeText.text = "";
				break; 
			}
			
			setTimeout(generateFile, 250); 
		}
		
		private function generateFile():void{
			theStage.dispatchEvent(new Event('generateFile'));
		}
	}
	
}
