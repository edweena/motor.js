## Motor.js
Motor is a multitrack step sequencer for the browser. It is inspired by MIDI sequencers in modern music software, but is flexible enough to control any audio or visual elements in a webpage. Play back sequences of numbers, strings, or objects at a given tempo, and use them to control anything you want. Send strings to a text-to-speech library while sending MIDI note numbers to a synthesis library, while adding DOM elements to a page, all in sync.

### Examples
**[Realtime Bling](http://urmston.xyz/realtimebling)**
- strings -> text-to-speech with [responsivevoice.js](link)
- note numbers -> synthesizer and drum samples with [gibberish.js](https://github.com/charlieroberts/Gibberish)
- Sending strings to a div in the DOM

**[Youtube Remix](http://urmston.xyz/trackYoutubeRemix)**
- send play positions to the YouTube API and create a new song by sampling YouTube videos
	
### Getting Started
Link to motor.js in your HTML file’s head:
````<script type=“text/javascript” src=“motor.js”></script>````
Example: add text to a <div> in the page and change its size 
````javascript
sillySequencer = new Motor()

// Create a new sequence with two tracks, “text” and “textSize”
sillySequencer.newSeq(‘intro’, {
	text:[“hey”,,,,,,,,“ho”,,,,,,,,,,,,”let’s”,,,,“go”,,,,,,,,],  	textSize: 	[50,,,,,,,, ,,,,100,,,,]  
})

// Tell Motor where to send the data from each track


// Play the sequence. If no argument is supplied, the last-created sequence will play
sillySequencer.play()
````
### Documentation
#### Properties
* **Motor.bpm** *[float]*   
Motor will play sequences at this tempo. 120 by default.
* **Motor.swing** *[float 0-1]*  
The amount of swing applied to sequences. A value of 0.5 produces a “straight” sequence with no swing
* **Motor.currentSeq** *[object, read-only]*  
* Always contains the current playing sequence. Don’t modify this.

### Methods
* **Motor.newSeq**( name *[string]*, sequence data *[object]*)
* Creates a new sequence. Use the following syntax:
````javascript
Motor.newSeq(‘intro’, {  
		kick: 			[1,,,,,,,, 1,,,,,,,,],  
		hatOpen: 	[,,1,,1,,,,],  
		hatClosed:[,,,,1,,,,]  
})
````
* **Motor.globalOutputs**( outputs *[object]* )
* **Motor.play**(sequenceToPlay *[string, optional]* )
* If no argument is supplied, the last-created sequence will play.

### Dependencies
It is highly recommended that you use [HackTimer.js](https://github.com/turuslan/HackTimer) to prevent timer throttling when tabs are in the background.
### License