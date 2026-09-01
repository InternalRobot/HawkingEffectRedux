package com.THE {
	
	import flash.events.Event;
	import flash.display.Stage;
	import flash.display.MovieClip;
	import flash.text.TextField; 
	import flash.utils.setTimeout; 
	import flash.utils.getDefinitionByName; 
	import flash.display.Bitmap;
	import com.global.GlobalVars; 
	
	import com.greensock.TweenLite; 
	import com.greensock.plugins.TweenPlugin; 
	import com.greensock.plugins.ColorTransformPlugin; 
	import flash.display.DisplayObject;
	
	TweenPlugin.activate([ColorTransformPlugin]); //activation is permanent in the SWF, so this line only needs to be run once.
	
	public class DisplayController {

		private var theStage:Stage; 
		private var theSlug:String; 
		private var thePath:Object;
		private var theLength:uint; 
		
		private var twoNode:TwoNode; 
		private var threeNode:ThreeNode;
		private var fourNode:FourNode; 
		private var fiveNode:FiveNode; 
		private var sixNode:SixNode; 

		private var generalShare:GeneralShare; 
		
		private var tempClass:Class; 
		private var instance:MovieClip; 
		
		private var drift:uint = 35;
		
		public function DisplayController() {
			// constructor code
		}
		
		public function initDisplayController():void{
			trace('initDisplayController');
			
			theStage = GlobalVars.THE_STAGE;

			generalShare = new GeneralShare(); 
			
			twoNode = new TwoNode();
			threeNode = new ThreeNode(); 
			fourNode = new FourNode(); 
			fiveNode = new FiveNode(); 
			sixNode = new SixNode(); 
	
			theStage.addChild(twoNode);
			theStage.addChild(threeNode); 
			theStage.addChild(fourNode); 
			theStage.addChild(fiveNode); 
			theStage.addChild(sixNode);
			
			theStage.addChild(generalShare); 
			
			generalShare.visible = false;
			threeNode.visible = false; 
			fourNode.visible = false; 
			fiveNode.visible = false; 
			sixNode.visible = false;
			
			theStage.addEventListener('iterationComplete', updateDisplay);
		}

		private function updateDisplay(e:Event):void{
			trace('Updating Display...');
			
			
			theSlug = GlobalVars.SLUG;
			thePath = GlobalVars.PATH;
			theLength = GlobalVars.PATH_LENGTH;
			
			/*var test:Class = getDefinitionByName('a_brief_history_of_time') as Class;
			trace(test);
			var testtest =  new test() as MovieClip;
			theStage.addChild(testtest);
			*/
			trace('slug = ' + theSlug);
			//trace(thePath[0]);

			switch (theLength){
				case 1:
					generalShare.visible = true; 
					twoNode.visible = false;
					threeNode.visible = false; 
					fourNode.visible = false;
					fiveNode.visible = false; 
					sixNode.visible = false;
				
				break; 
				case 2:
					generalShare.visible = true; 
					twoNode.visible = false;
					threeNode.visible = false; 
					fourNode.visible = false;
					fiveNode.visible = false; 
					sixNode.visible = false;
				
				break;
				case 3:
					generalShare.visible = false; 
					twoNode.visible = true;
					threeNode.visible = false; 
					fourNode.visible = false;
					fiveNode.visible = false; 
					sixNode.visible = false; 
					twoNode['nodeDot'+(theLength-1)].visible = true;
					for(var i = 0; i<theLength; i++ ) {
						var nodeString = thePath[i];
						//trace('---> ' + thePath[i]);
						twoNode['node'+i.toString()].text = nodeString.toUpperCase();
						twoNode['node'+i.toString()].autoSize = "left";
						twoNode['node'+i.toString()].multiline = true;
						twoNode['node'+i.toString()].wordWrap = true;
						if (i < theLength){
							trace(i)
							twoNode['node'+i.toString()].y = twoNode['nodeDot'+i.toString()].y - twoNode['node'+i.toString()].height/2 + 5;
						}
					}
					
					try{
						trace('Instance removed');
						twoNode.removeChild(instance);
					}catch(e:Error){
						trace('There is no image to remove');
					}
					
					try{
						trace('Class exists - Adding to display...');
						tempClass = getDefinitionByName(theSlug) as Class;
						instance = new tempClass() as MovieClip;
						instance.x = twoNode['nodeDot'+(theLength-1).toString()].x - twoNode['nodeDot'+(theLength-1).toString()].width/2 - 2;
						instance.y = twoNode['nodeDot'+(theLength-1).toString()].y - twoNode['nodeDot'+(theLength-1).toString()].height/2 - 2;
						twoNode['nodeDot'+(theLength-1)].visible = false;
						twoNode.addChild(instance);
						
					}catch(e:Error){
						trace('Class does not exist');
					}
					
				break; 
				case 4:
					generalShare.visible = false; 
					twoNode.visible = false;
					threeNode.visible = true; 
					fourNode.visible = false;
					fiveNode.visible = false; 
					sixNode.visible = false; 
					threeNode['nodeDot'+(theLength-1)].visible = true;
					for(i = 0; i<theLength; i++ ) {
						nodeString = thePath[i];
						threeNode['node'+i.toString()].text = nodeString.toUpperCase();
						threeNode['node'+i.toString()].autoSize = "left";
						threeNode['node'+i.toString()].multiline = true;
						threeNode['node'+i.toString()].wordWrap = true;
						if (i < theLength){
							threeNode['node'+i.toString()].y = threeNode['nodeDot'+i.toString()].y - threeNode['node'+i.toString()].height/2 + 5;
						}
						
					}
					
					try{
						trace('Instance removed');
						threeNode.removeChild(instance);
					}catch(e:Error){
						trace('There is no image to remove');
					}
					
					//trace(getDefinitionByName(theSlug));
					try{
						trace('Class exists - Adding to display...');
						tempClass = getDefinitionByName(theSlug) as Class;
						instance = new tempClass() as MovieClip;
						instance.x = threeNode['nodeDot'+(theLength-1).toString()].x - threeNode['nodeDot'+(theLength-1).toString()].width/2 - 2;
						instance.y = threeNode['nodeDot'+(theLength-1).toString()].y - threeNode['nodeDot'+(theLength-1).toString()].height/2 - 2;
						threeNode['nodeDot'+(theLength-1)].visible = false;
						threeNode.addChild(instance);
						
					}catch(e:Error){
						trace('Class does not exist');
					}
					
				break; 
				case 5:
					generalShare.visible = false; 
					twoNode.visible = false;
					threeNode.visible = false; 
					fourNode.visible = true;
					fiveNode.visible = false; 
					sixNode.visible = false; 
					fourNode['nodeDot'+(theLength-1)].visible = true;
					//trace('case 4');
					for(i = 0; i<theLength; i++ ) {
						nodeString = thePath[i];
						fourNode['node'+i.toString()].text = nodeString.toUpperCase();
						fourNode['node'+i.toString()].autoSize = "left";
						fourNode['node'+i.toString()].multiline = true;
						fourNode['node'+i.toString()].wordWrap = true;
						if (i < theLength){
							fourNode['node'+i.toString()].y = fourNode['nodeDot'+i.toString()].y - fourNode['node'+i.toString()].height/2 + 5;
						}
					}

					try{
						trace('Instance removed');
						fourNode.removeChild(instance);
					}catch(e:Error){
						trace('There is no image to remove');
					}
					
					try{
						trace('Class exists - Adding to display...');
						tempClass = getDefinitionByName(theSlug) as Class;
						instance = new tempClass() as MovieClip;
						instance.x = fourNode['nodeDot'+(theLength-1).toString()].x - fourNode['nodeDot'+(theLength-1).toString()].width/2 - 2;
						instance.y = fourNode['nodeDot'+(theLength-1).toString()].y - fourNode['nodeDot'+(theLength-1).toString()].height/2 - 2;
						fourNode['nodeDot'+(theLength-1)].visible = false;
						fourNode.addChild(instance);
					}catch(e:Error){
						trace('Class does not exist');
					}
					
				break; 
				case 6:
					generalShare.visible = false; 
					twoNode.visible = false;
					threeNode.visible = false; 
					fourNode.visible = false;
					fiveNode.visible = true; 
					sixNode.visible = false; 
					fiveNode['nodeDot'+(theLength-1)].visible = true;
				
					for(i = 0; i<theLength; i++ ) {
						nodeString = thePath[i];
						fiveNode['node'+i.toString()].text = nodeString.toUpperCase();
						fiveNode['node'+i.toString()].autoSize = "left";
						fiveNode['node'+i.toString()].multiline = true;
						fiveNode['node'+i.toString()].wordWrap = true;
						if (i < theLength){
							fiveNode['node'+i.toString()].y = fiveNode['nodeDot'+i.toString()].y - fiveNode['node'+i.toString()].height/2 + 5;
						}
					}
					
					try{
						trace('Instance removed');
						fiveNode.removeChild(instance);
					}catch(e:Error){
						trace('There is no image to remove');
					}
					
					try{
						trace('Class exists - Adding to display...');
						tempClass = getDefinitionByName(theSlug) as Class;
						instance = new tempClass() as MovieClip;
						instance.x = fiveNode['nodeDot'+(theLength-1).toString()].x - fiveNode['nodeDot'+(theLength-1).toString()].width/2 - 2;
						instance.y = fiveNode['nodeDot'+(theLength-1).toString()].y - fiveNode['nodeDot'+(theLength-1).toString()].height/2 - 2;
						fiveNode['nodeDot'+(theLength-1)].visible = false;
						fiveNode.addChild(instance);
						
					}catch(e:Error){
						trace('Class does not exist');
					}
				break; 
				
			}
			
			setTimeout(generateFile, 150); 
		}
		
		private function generateFile():void{
			theStage.dispatchEvent(new Event('generateFile'));
		}
	}
	
}
