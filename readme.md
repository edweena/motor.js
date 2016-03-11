## Motor.js
Motor is a multitrack step sequencer for the browser. It is inspired by MIDI sequencers in modern music software, but is flexible enough to control any audio or visual elements in a webpage. Play back sequences of numbers, strings, or objects at a given tempo, and use them to control anything you want. Send strings to a text-to-speech library while sending MIDI note numbers to a synthesis library, while adding DOM elements to a page, all in sync.

### Examples
**[Realtime Bling](http://urmston.xyz/realtimebling)**
- strings -> text-to-speech with [responsivevoice.js](link)
- note numbers -> synthesizer and drum samples with [gibberish.js](https://github.com/charlieroberts/Gibberish)
- Sending strings to a div in the DOM

**[Youtube Remix](http://urmston.xyz/trackYoutubeRemix)**
- Create a new song by jumping around in videos with the YouTube API
	
### Getting Started
#### Simple Example: Add text to two separate divs
Link to motor.js in your HTML file’s head:
```javascript
<!doctype HTML>
<html>
<head>
<!-- link to motor.js -->
<script type=“text/javascript” src=“motor.js”></script>
</head>
<body>
<div id="lyrics"></div>
<div id="drums"></div>
<script type="text/javascript">

// Instantiate a new Motor
sillySequencer = new Motor()

// Create a new sequence with two tracks, “text” and “textSize”
sillySequencer.newSeq(‘intro’, {
	lyrics:[[“hey”,30],,,,,,,,[“ho”,50],,,,,,,,,,,,[”let’s”, 20],,,,[“go”,50],,,,,,,,],
	drums:[["boom",20],,,,["bap",10],,,,["boom",20],,,,["bap",10],,,,]
})

// Define the output functions
// The track name and the value of each step is sent to the output functions
sillySequencer.globalOutputs({
	setTextOfDiv: function(trackName,value) {
   		var divToFill = document.getElementById(trackName)
   		//set the text of the div
    		divToFill.innerHTML = value[0]
    		//set the fontSize of the text
    		divToFill.style.fontSize = value[1]
    },
    addToBody: function(trackName,value) {
    	//append text to body
    	document.body.innerHTML += value
    }
})

// Tell Motor where to send each track
// You can send tracks to multiple output functions
sillySequencer.setOutputs({
	lyrics:['setTextOfDiv','console'],
	drums:['setTextOfDiv','console'],
	backgroundText:['addToBackground']
)}

// Play the sequence. If no argument is supplied, the last sequence will play.
sillySequencer.bpm = 120
sillySequencer.play()
</script>
</body>
```

### Documentation
#### Motor{}
*Properties*
* **Motor.bpm** *[float]*   
Motor will play sequences at this tempo. 120 by default.
* **Motor.swing** *[float 0-1]*  
The amount of swing applied to sequences. A value of 0.5 produces a “straight” sequence with no swing.
* **Motor.currentSeq** *[object, read-only]*  
* Always contains the current playing sequence. Don’t modify this.
*Methods*
* **Motor.newSeq**( name *[string]*, sequence data *[object]*)
Creates a new sequence. Use the following syntax:
```javascript
Motor.newSeq(‘intro’, {  
	kick: 		[1,,,,,,,, 1,,,,,,,,],  
	hatOpen: 	[,,1,,1,,,,],  
	hatClosed:	[,,,,1,,,,]
})
```
* **Motor.globalOutputs**( outputs *[object]* )
* **Motor.play**(sequenceToPlay *[string, optional]* )
Starts playing a sequence. If no argument is supplied, the last-created sequence will play.
Sequence{}
#### Extra random math tools
* **mtof**(midiNoteNumber *[float 0-127]* )
Converts a MIDI note number to its corresponding frequency in Hz.
* **ftom**(frequency *[float]*)
Converts a frequency to its corresponding MIDI note number.

### Dependencies
You should use [HackTimer.js](https://github.com/turuslan/HackTimer) to prevent timer throttling when tabs are in the background.
### License
