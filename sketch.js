//1z 2x 3c 4v
let songPlay = false;

//timing variables
let songStartTime;
let lastBeatIndex = -1;

//notes + songs
let Znotes = [];
let Xnotes = [];
let Cnotes = [];
let Vnotes = [];

let selectedSong;
let musica_electronica, heart_pop, harajuku_girl, i_dont_go_to_parties;

//score
let score = 0;

function preload() {
  musica_electronica = loadSound("musica_electronica.wav"); //120bpm
  heart_pop = loadSound("heart_pop.wav"); //142bpm
  harajuku_girl = loadSound("harajuku_girl.wav"); //139bpm
  i_dont_go_to_parties = loadSound("i_dont_go_to_parties.wav"); //134bpm
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
    this.noteType = noteType;
    this.fourthNoteMs = (60 / bpm * 4) * 1000;
    this.spawnTime = millis();
    this.showing = true;
  }

  show(){ 
    if (this.y < 475){
      rect(this.x, this.y, width/4,20);
    }
    else{

      if (this.showing){
        //miss if y below 475
        console.log("miss");
        score-=10;
        this.showing = false;
      }
    }
  }

  fall(){
    this.timer = millis() - this.spawnTime;
    this.y = map(this.timer, 0, this.fourthNoteMs, 0, height-100);
  }

  hit(){

      //score feedback
      if (this.y < 395){
        console.log("bad");
        score-=10;
      }
      else if (this.y < 425 && this.y > 395){
        console.log("meh")
        score+=5;
      }
      else if (this.y > 425 && this.y < 455){
        console.log("good");
        score+=10;
      }
      else if (this.y > 455 && this.y < 485){
        console.log("perfect")
        score+=15;
      }

      //removing notes from the array
      if (this.noteType == 1){
        Znotes.splice(0,1);
      }
      else if (this.noteType == 2){
        Xnotes.splice(0,1);
      }
      else if (this.noteType == 3){
        Cnotes.splice(0,1);
      }
      else if (this.noteType == 4){
        Vnotes.splice(0,1);
      }
  }
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('gameCanvas');

  lastSecond = second();
}

//minimize this lmao
function countBeats(arr,songFile){
  let bpm = arr[0];
  let sixteenth = (60 / bpm / 4) * 1000;
  let song = songFile;

  let beatIndex = Math.floor((millis() - songStartTime) / sixteenth);

  if (songPlay && !song.isPlaying()){
    song.play();
  }

  if (beatIndex !== lastBeatIndex) {
    lastBeatIndex = beatIndex;

    // trigger note spawn here
    let fallingBeat = beatIndex+4;

    if (fallingBeat < arr.length){

      if (arr[fallingBeat] == 1){
        let z = new note(1,bpm);
        Znotes.push(z);
      }
      else if (arr[fallingBeat] == 2){
        let x = new note(2,bpm);
        Xnotes.push(x);
      }
      else if (arr[fallingBeat] == 3){
        let c = new note(3,bpm);
        Cnotes.push(c);
      }
      else if (arr[fallingBeat] == 4){
        let v = new note(4,bpm);
        Vnotes.push(v);
      }
    }
  }

  text("beat: " + beatIndex,15,15);

}

//shows, moves, and deletes notes - minimize this
function drawSong(){

  for (let i = Znotes.length - 1; i >= 0; i--) {
    if (Znotes[i].timer >= Znotes[i].fourthNoteMs) {
      Znotes.splice(i, 1); // remove self when note timer over
    } else {
      Znotes[i].fall();
      Znotes[i].show();
    }
  }

  for (let i = Xnotes.length - 1; i >= 0; i--) {
    if (Xnotes[i].timer >= Xnotes[i].fourthNoteMs) {
      Xnotes.splice(i, 1); // remove self when note timer over
    } else {
      Xnotes[i].fall();
      Xnotes[i].show();
    }
  }

  for (let i = Cnotes.length - 1; i >= 0; i--) {
    if (Cnotes[i].timer >= Cnotes[i].fourthNoteMs) {
      Cnotes.splice(i, 1); // remove self when note timer over
    } else {
      Cnotes[i].fall();
      Cnotes[i].show();
    }
  }

  for (let i = Vnotes.length - 1; i >= 0; i--) {
    if (Vnotes[i].timer >= Vnotes[i].fourthNoteMs) {
      Vnotes.splice(i, 1); // remove self when note timer over
    } else {
      Vnotes[i].fall();
      Vnotes[i].show();
    }
  }
}

function draw() {
  background(225);

  //rects
  textSize(12);
  noStroke();

  fill(255,0,0,35);
  rect(0,0,600,395)

  fill(255,255,0,35);
  rect(0,395,600,30)

  fill(0,0,255,35);
  rect(0,425,600,30)

  fill(0,255,0,35);
  rect(0,455,600,30)

  strokeWeight(2);
  stroke(0);
  fill(255);

  let songArray;
  selectedSong = heart_pop;

  if (selectedSong == musica_electronica){
    songArray = array_m_e;
  }
  else if (selectedSong == heart_pop){
    songArray = array_h_p;
  }
  else if (selectedSong == harajuku_girl){
    songArray = array_h_g;
  }
  else if (selectedSong == i_dont_go_to_parties){
    songArray = array_idgtp;
  }
  
  
  if (songPlay == true && 4 < beatIndex <= songArray.length){
    countBeats(songArray, selectedSong);
    drawSong(); 
    text("score: " + score,10,30)
  }
  
}

//stopping and starting song, hitting notes
function keyPressed() {

  //starting and stopping song
  if (keyCode == 32){

    if (songPlay == false){
      songPlay = true;
      beatIndex = 0;
      score = 0;
      songStartTime = millis();

    } else {

      songPlay = false;
      selectedSong.stop();
      
      Znotes = [];
      Xnotes = [];
      Cnotes = [];
      Vnotes = [];
    }
  }

  //pressing notes
  if (songPlay) {
    if (key === "z" && Znotes.length > 0){
      Znotes[0].hit();
    }

    if (key === "x" && Xnotes.length > 0){
      Xnotes[0].hit();
    }

    if (key === "c" && Cnotes.length > 0){
      Cnotes[0].hit();
    }

    if (key === "v" && Vnotes.length > 0){
      Vnotes[0].hit();
    }
  }
}