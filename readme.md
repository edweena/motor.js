# Motor.js
=========
Motor is a multitrack step sequencer for the browser. It is inspired by MIDI sequencers in modern music software, but is flexible enough to control any audio or visual elements in a webpage. Play back sequences of numbers, strings, or objects at a given tempo, and use them to control anything you want. Send strings to a text-to-speech library while sending MIDI note numbers to a synthesis library, all in sync.

# Examples
## Realtime Bling
- strings -> text-to-speech with [responsivevoice.js][link]
- note numbers -> synthesizer and drum samples with [gibberish.js][id]
- Sending strings to a div in the DOM

## Youtube Remix
send play positions to the YouTube API and create a new song by sampling YouTube videos
	
# Getting Started
Link to motor.js in your HTML file’s head:
`<script type=“text/javascript” src=“motor.js”></script>`

In a script in your page, instantiate a new Motor object:
`sillySequencer = new Motor()`



# Documentation
Everything resides within the Motor object

## Properties
`Motor.bpm [float]`
Motor will play sequences at this tempo

`Motor.swing [float 0-1]`
The amount of [swing][https://en.wikipedia.org/wiki/Swing_(jazz_performance_style)#Swing_note] applied to sequences. A value of 0.5 produces a “straight” sequence with no swing

`Motor.currentSeq [object, read-only]`
Always contains the current playing sequence. Don’t modify this.

## Methods 
`Motor.newSeq( name [string], sequence data [object])`
Creates a new sequence. Automatically fills the Motor.currentSeq. Use the following syntax:

`Motor.newSeq(‘intro’, {
kick: 		[1,,,,,,,, 1,,,,,,,,],
hatOpen: 	[,,1,,1,,,,],
hatClosed:[,,,,1,,,,]
})`

`Motor.globalOutputs( outputs [object] )`
`Motor.play(sequence to play [string, optional] )`

## Dependencies
It is highly recommended that you use HackTimer.js to prevent timer throttling when tabs are in the background
# License