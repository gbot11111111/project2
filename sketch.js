let testArray = [130, //BPM of the song
  0,0,0,0,
  1,1,1,1,0,0,0,0,3,3,3,3,4,4,4,4,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//1z 2x 3c 4v

//timing variables
let currentBeat = 1;
let beatCounter = 0;
let metronome = 1;
let metroCounter = 0;
let sixteenthNoteMs = 0;
let fourthNoteMs = 0;

//notes
let Znotes = [];
let Xnotes = [];
let Cnotes = [];
let Vnotes = [];

class Znote{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.timer = 0;
  }

  show(){
    rect(this.x, map(this.timer, 0, fourthNoteMs, 0, height-100), width/4,20);
    text(this.timer,100,400);
    if (this.y >= height-100) {
      Znotes.splice(this,1);
    }
  }

  fall(){
    if (this.timer !== fourthNoteMs){
      this.timer++;
    }
    else{
      this.timer = 0;
    }
  }
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('gameCanvas');

  lastSecond = second();

  setInterval(countBeats, 1); //runs every ms instead of 60fps
  setInterval(draw, 1); 

}

//minimize this lmao
function countBeats(arr){
  let bpm = 120;

  if (arr){
    bpm = arr[0];
  }

  let s = millis()/1000;

  fourthNoteMs = round(60000 / bpm);
  sixteenthNoteMs = round(fourthNoteMs / 4);

  if (beatCounter < sixteenthNoteMs){
    beatCounter++;
  }
  else{
    beatCounter = 0;
    currentBeat++;

    if (arr[currentBeat+4] == 1){
      let z = new Znote();
      Znotes.push(z);
    }
  }

  if (metroCounter !== fourthNoteMs){
    metroCounter++;
  }
  else{
    metroCounter = 0;
    metronome++;
  }

  if (metronome > 4){
    metronome = 1;
  }

  text('BPM: ' + bpm, 10, 50);
  text('Metronome: ' + metronome, 10, 70);
  text('Current Beat: ' + currentBeat, 10, 90);
  text(beatCounter + " resets every " + sixteenthNoteMs, 10, 130);

}

function drawSong(arr){
  let y = map(metroCounter, 0, fourthNoteMs, 0, height-100); 

  let XnoteX = width/4;
  let CnoteX = width/2;
  let VnoteX = width*3/4;
  
  let fallingBeat = currentBeat+4;

  if (arr[fallingBeat] == 2){
    rect(XnoteX,y,width/4,20);
  }

  if (arr[fallingBeat] == 3){
    rect(CnoteX,y,width/4,20);
  }

  if (arr[fallingBeat] == 4){
    rect(VnoteX,y,width/4,20);
  }

  for (let i = 0; i < Znotes.length; i++) {

    Znotes[i].fall();
    Znotes[i].show();
  }

}

function draw() {
  background(220);

  textSize(12);

  let song = testArray;

  countBeats(song);
  if (currentBeat <= song.length){
    drawSong(song);
  }

  strokeWeight(2);
  line(0,height-100,width,height-100);

}