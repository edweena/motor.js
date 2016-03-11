//MOTOR MULTITRACK SEQUENCE ENGINE
//AN EASY WAY TO READ AND PLAY BACK ARRAYS OF DIFFERENT LENGTHS AT A GIVEN TEMPO

//FUTURE FEATURES:
//FOLLOW ACTIONS BASED ON CHANCE
//PLAYING A SEQUENCE FORWARDS OR BACKWARDS
//RANDOMNESS/"ERROR"
//INDEPENDENT RESOLUTIONS PER TRACK

var Motor = function() {
	this.timer = undefined
	this.isPlaying = false
	this._currentStep = 0
	this.currentSeq = undefined
	this.defaultDestination = undefined
	this._bpm = 120
	this.bpm = function(val) {
		if (val != undefined) {self._bpm = val}
		return self._bpm
	}
	this.swing = 0 
	this.toolsShown = false
	self = this

	this.seqs = { //seqs will end up here
	} 
	this.tracks = { //tracks will end up here
	}
	self.track = function(newTrackName){ //track constructor
		var outputToSet = self.defaultDestination
		if (newTrackName.split('_')[1] == 'transpose') {
			outputToSet = 'transpose' 
		}
		this._outputs = [outputToSet],
		// outputs function

		this.onTrigger = function(onTriggerFunct){
			self.tracks[newTrackName]._onTrigger = onTriggerFunct
			return self.tracks[newTrackName]
		}
		this._onTrigger = function(){}

		this.setOutputs = function(one,two,three,four,five,six,seven,eight) {
			for (i=0; i<arguments.length; i++) {
				self.tracks[newTrackName]._outputs.push(arguments[i])
			}
			return self.tracks[trackName]
		}
	}
	self.setOutputs = function(data){
		for (trackName in data) {
			if(self.tracks.hasOwnProperty(trackName) == false) {
			//create top-level track objects if they don't exist yet
				self.tracks[trackName] = new self.track(trackName)
			}
			self.tracks[trackName]._outputs = data[trackName]
		}
	}
	//sequence constructor
	this.Sequence = function(seqName) {

	}
	this.newSeq = function(seqName, newSeq) {
		//initialize new sequence
		self.seqs[seqName] = {
			name: seqName,
			tracks: {},
			followers: {},
			//add 
			onLaunch: function(onLaunchFunct){
				self.seqs[seqName]._onLaunch = onLaunchFunct
				return self.seqs[seqName]
			},
			onStep: function(onStepFunct){
				self.seqs[seqName]._onStep = onStepFunct
				return self.seqs[seqName]
			},
			_onLaunch: function(){},
			_onStep: function(){}
		}

		for (trackName in newSeq) {
			var cleanTrackName
			var stringToTest = parseInt(trackName.split('_')[1])
				
			if ( isNaN(stringToTest) ) {
				cleanTrackName = trackName
			} else {
				//if trackName is a string, e.g. xylophone_transpose, trim off layer number

				cleanTrackName = trackName.split('_')[0]
			}

			//if data hasn't been added in this track in this sequence already
			if (self.seqs[seqName].tracks[cleanTrackName] == undefined){
				// create new track in sequence
				self.seqs[seqName].tracks[cleanTrackName] = {
					data: [
						newSeq[trackName]
					],
					resolution: 1/16,
					midiTransposeAmt: 0
				}

			} else {
				//get number of slots in track
				var numberOfLayers = self.seqs[seqName].tracks[cleanTrackName].data.length
				//append new layer to data[]
				self.seqs[seqName].tracks[cleanTrackName].data[numberOfLayers] = newSeq[trackName]
			}

			//create top-level track objects if they don't exist yet
			if(self.tracks.hasOwnProperty(cleanTrackName) == false) {
				self.tracks[cleanTrackName] = new self.track(cleanTrackName)
			}
			//add follower method! Accepts a number of steps and an array of sequence names
			self.seqs[seqName].addFollowers = function(followers){
				// for(stepAmt in followers) {
				// 	self.seqs[seqName].followers[stepAmt] = followers[stepAmount]
				// }
				self.seqs[seqName].followers = followers
				return self.seqs[seqName]
			}
		} 
		//automatically make this the currentSeq
		self.currentSeq = self.seqs[seqName]
    return self.seqs[seqName]
	}



	this.newTrack = function(trackName, output) {
		//if not an array, make it so
		if ( Array.isArray(output) == false) {
			output = [output]
		}

		//create outputs array in track object
		self.tracks[trackName] = {
			_outputs: output
		}

		//add track to all sequences
		for (sequence in self.seqs) {
			self.seqs[sequence].tracks[trackName] = {
				0:[]
			}
		}

		//set the _outputs to the output
		self.tracks[trackName] = new self.track(trackName)

		self.tracks[trackName]._outputs.push(output)

		return self.tracks[trackName]
	} 

	self._globalOutputs = {
		//built-in outputs
		transpose: function(parameter,value){
          parameter = parameter.split('_')[0]
          motor.currentSeq.tracks[parameter].midiTransposeAmt = value
        }
	}
	
	this.globalOutputs = function(globalOuts) {
		for (outputName in globalOuts) {
			thisFunc = globalOuts[outputName]
			self._globalOutputs[outputName] = thisFunc
		}	
		return self
	}

	this.sendTo = function(destination,parameter,value){
  		self._globalOutputs[destination](parameter,value)
  		self.tracks[parameter]
 		return self		
 	}

 	this.stop = function() {
      clearTimeout(self.timer)
      this._currentStep = 0
  }

  this.play = function(seqToPlay) {
  	//optionally accept argument to play a specific sequence
  	if (seqToPlay != undefined) {
  		self._currentStep = 0
  		self.currentSeq = self.seqs[seqToPlay]
  	}

  	self.currentSeq._onStep()
  	if (self._currentStep == 0) { 
  		console.log('sequence launched: '+self.currentSeq.name)
  		self.currentSeq._onLaunch() 
  	}
  	
  	//for each track
  	for (trackName in self.currentSeq.tracks) {
  		var trackData = self.currentSeq.tracks[trackName].data
  		var outputDests = self.tracks[trackName]._outputs

  		//for each layer of track data
  		for(i=0;i<trackData.length;i++) {
  			
  			var stepValue = trackData[i][self._currentStep%trackData[i].length]

				if(stepValue != NaN && stepValue != undefined ) {
					
					//detect if stepValue is an object with type: 'chord' or 'poly'
					if ( stepValue.type === 'poly' || stepValue.type === 'chord' ){
						
						for (j=0;j<stepValue.data.length;j++){
			
							var thisChordNote = stepValue.data[j]

							//add midiTransposeAmount
							thisChordNote = thisChordNote + self.currentSeq.tracks[trackName].midiTransposeAmt
							
							//finally send out value of each chord note
		        	for (k=0; k<outputDests.length; k++) {

		         		self.sendTo(outputDests[k], trackName, thisChordNote)
		          }
		          self.tracks[trackName]._onTrigger()
						}
					} else { 
						//if not chord
							//if not array
						if (typeof stepValue != 'object') {
							//add midiTransposeAmount
							stepValue = stepValue + self.currentSeq.tracks[trackName].midiTransposeAmt		
						}
						//finally send out value
	        	for (i=0; i<outputDests.length; i++) {
	         		self.sendTo(outputDests[i], trackName, stepValue)
	          }
	          self.tracks[trackName]._onTrigger()
					}
        }
			}	
    }
      
    this._currentStep++

    //SWING CALCULATOR
    var swingSwitch = self._currentStep % 2
    var swingMultiplier
    if(swingSwitch != 1) {
    	swingMultiplier = 1 - self.swing
    } else {
    	swingMultiplier = self.swing
    }

    var followers = self.currentSeq.followers
    var stepMatch = followers[self._currentStep]

    if (stepMatch !== undefined) {
			var theseFollowers = followers[self._currentStep]
			var selector = parseInt( Math.floor(Math.random() * theseFollowers.length))
    	var nextSeqName = theseFollowers[ selector ]

    	self.currentSeq = self.seqs[nextSeqName]
			self._currentStep = 0
    }

    // ok ok ok do it this way:
    // addFollowers(128, ['a','b'] })
    // in the play function, listen for when the currentStep == followerTime
    // then pick a random one and play it
 	
    self.timer = setTimeout(function() {
      self.play()
    }, (1000 * 60 / (this._bpm * 4) ) * swingMultiplier )
	}	
   	
  this.togglePlay = function(){
		if (this.isPlaying == false) {
			self.play()
			// self.isPlaying = true
		} else if (this.isPlaying == true ) {
			self.pause()
			// self.isPlaying = false		
		}
	}

 	return self
}

//HANDY FUNCTIONS /////////////////////////////////
var mtof = function(note) {
	return 440.0 * Math.pow(2, (note - 69.0) / 12.0)
}
var ftom = function(f){
	return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69)
}

midiScale = function(note, rootNote, mode) {
  //map input scale interval -> output scale interval
  var scaleIntervals = {
    0:0,
    1:0,
    2:2,
    3:2,
    4:4,
    5:5,
    6:5,
    7:7,
    8:7,
    9:9,
    10:9,
    11:11,
    12:12
  }
  //amount to offset the scale intervals for each root note
  var rootOffsets =  {
    'c': 0,
    'c#':1,
    'd': 2,
    'd#': 3,
    'e':4,
    'f':5,
    'f#':6,
    'g':7,
    'g#':8,
    'a':9,
    'a#':10,
    'b':11
  }
  //amount to offset the scale intervals for each mode
  var modeOffsets = {
    major:0,
    ionian:0,
    minor:5,
    aeolian:5,
  }
  
  var octave = Math.floor(note / 12)
  var pitchClass = note % 12

  //get rootOffset amount
  var rootOffset = rootOffsets[rootNote]
  var modeOffset = modeOffsets[mode]

  var octaveBonus = Math.floor((pitchClass + rootOffset + modeOffset) / 12)

  //get scale interval based on input pitchClass and rootOffset
  var newNote = scaleIntervals[(pitchClass + rootOffset + modeOffset) % 12 ] + ((octave+octaveBonus) * 12)


  // var newNote = scaleIntervals[(pitchClass + rootOffset + modeOffsets[mode]) % 12 ] + (octave * 12)

  // console.log((pitchClass + rootOffset) %13)
  // console.log(pitchClass,octave)
  // console.log(note,newNote)
  return newNote
}

// IN-SEQUENCE GENERATORS /////////////////////////////////

// POLY e.g. p(100,200,250)
// 		if this is used in a sequence, play() will loop through each of the arguments 
// 		instead of passing the whole object to the output 
var p = function() {
	var poly = {
		type:'poly',
		data:[]
	}
	for (i=0;i<arguments.length;i++){
		poly.data[i] = arguments[i]
	}
	return poly
}

//replace 'rF' with random float btwn 0-1
