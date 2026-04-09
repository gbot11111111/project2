let array_m_e = [120, //BPM of the song
  0,0,0,0,
  1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,
  1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
  3,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//1z 2x 3c 4v

let songPlay = false;

//timing variables
let currentBeat = 1;
let metronome = 1;

let m_lastBeat = 0;
let s_lastBeat = 0;

//notes + songs
let notes = [];
let musica_electronica;

function preload() {
  musica_electronica = loadSound("musica_electronica.wav");
}

class note{
  constructor(noteType,bpm){ //value 1-4
    if (noteType == 1){
      this.x = 0;
    }
    else if (noteType == 2){
      this.x = width/4;
    }
    else if (noteType == 3){
      this.x = width/2;
    }
    else if (noteType == 4){
      this.x = width*3/4;
    }
    
    this.y = 0;
    this.timer = 0;

    this.fourthNoteMs = round(60000 / bpm);
  }

  show(){
    rect(this.x, map(this.timer, 0, this.fourthNoteMs, 0, height-100), width/4,20);
  }

  fall(){
    if (this.timer !== this.fourthNoteMs){
      this.timer++;
    }
    else{
      this.timer = 0;
      notes.splice(0,1);
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

  //metronome calculations
  let m_beatInterval = (60 / bpm) * 1000;
  let currentTime = millis();
  if (currentTime - m_lastBeat >= m_beatInterval) {

    // TRIGGER BEAT HERE
    console.log("beat");

    metronome++;

    if (metronome > 4){
      metronome = 1;
    }

    if (songPlay && !musica_electronica.isPlaying()){
      musica_electronica.play();
    }

    m_lastBeat = currentTime; // Reset the timer
  }

  //sixteenth note calculations
  let s_beatInterval = (60 / bpm/4) * 1000;
  if (currentTime - s_lastBeat >= s_beatInterval && metronome > 0) {

    // TRIGGER BEAT HERE (create notes)

    let fallingBeat = currentBeat+4;

    if (fallingBeat < arr.length){

      if (arr[fallingBeat] == 1){
        let z = new note(1,bpm);
        notes.push(z);
      }
      else if (arr[fallingBeat] == 2){
        let x = new note(2,bpm);
        notes.push(x);
      }
      else if (arr[fallingBeat] == 3){
        let c = new note(3,bpm);
        notes.push(c);
      }
      else if (arr[fallingBeat] == 4){
        let v = new note(4,bpm);
        notes.push(v);
      }
    }

    currentBeat++;
    
    s_lastBeat = currentTime; // Reset the timer
  }

  text('BPM: ' + bpm, 10, 50);
  text('Metronome: ' + metronome, 10, 70);
  text('Current Beat: ' + currentBeat, 10, 90);
  text(notes, 10, 10); 
}

function drawSong(){

  for (let i = 0; i < notes.length; i++) {
    notes[i].fall();
    notes[i].show();
  }

}

function draw() {
  background(220);

  textSize(12);

  let song = array_m_e;

  if (songPlay == true && 4 < currentBeat <= song.length){
    countBeats(song);
    drawSong();
  }

  strokeWeight(2);
  line(0,height-100,width,height-100);

}

//space to start song
function keyPressed() {

  if (keyCode == 32){
    if (songPlay == false){
      songPlay = true;
      currentBeat = 0;
      metronome = 0;
    } else {
      songPlay = false;
      musica_electronica.stop();
      notes = [];
    }
    
  }
}