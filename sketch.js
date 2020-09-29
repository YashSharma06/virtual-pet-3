

//Create variables here
var dog, happydog, database, foodstock;
var foods = 0;
var lastfed, addfood,fedtime,foodobj,feedpet;
var readgameState,changegameState;
var dogbed,washdog,garden;

function preload()
{
  //load images here
  dog1 = loadImage("images/Dog.png");
  doghappy = loadImage("images/happydog.png");
  dogbed = loadImage("images/Bed Room.png");
  washdog = loadImage("images/Wash Room.png");
  gerdendog = loadImage("images/Garden.png");
  saddogy = loadImage("images/Lazy.png");
}

function setup() {
  createCanvas(1000, 800);
  dog = createSprite(550,250);
  dog.addImage(dog1);
  dog.scale = 0.3;
  database = firebase.database();
  foodstock = database.ref('Food');
  read = database.ref('gameState');

  foodobj = new FOOD();

  feedpet = createButton("Feed the dog");
  feedpet.position(700,95);
  feedpet.mousePressed(feeddog);
  foodstock.on("value", function(data){
    foods = data.val();
    foodobj.updatefoodstock(foods);
   })

  addfood = createButton("Add Food");
  addfood.position(800,95);
  addfood.mousePressed(addfoods);
  read.on("value",function(data){
    readgameState = data.val();
  })
  
}

function addfoods(){
  foods = foods+1;
    database.ref('/').update({
      Food:foods
    })
  }

function feeddog(){
 dog.addImage(doghappy);

 foodobj.updatefoodstock(foodobj.getfoodstock()-1);
 database.ref('/').update({
   Food:foodobj.getfoodstock(),
   FeedTime:hour(),
   gameState : "Hungry"
 })

}

function updategameState(state){
  database.ref('/').update({
    gameState : state
  })
}

function draw() {  
  background(46, 139, 87);
  
  fedtime=database.ref('FeedTime');
  fedtime.on("value",function(data){
    lastfed=data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastfed>=12){
    text("Last Feed :"+lastfed%12+" PM",350,30);
  }else if(lastfed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+lastfed+" AM",350,30);
  }

  if(gameState!= "Hungry"){
    dog.remove();
    feedpet.hide();
    addfood.hide();
  }else{
    feedpet.show();
    addfood.show();
    dog.addImage(saddogy);
  }
  currentTime = hour();
  if(currentTime==(lastfed+1)){
    updategameState("Playing");
    foodobj.garden();
  }else if(currentTime==(lastfed+2)){
   updategameState("sleeping");
   foodobj.bedroom();
  }else if(currentTime>(lastfed+2) && currentTime<=(lastfed+4)){
    updategameState("bathing");
    foodobj.washroom();
  }else{
    updategameState("Hungry")
    foodobj.display();
  }

  drawSprites();
  //add styles here
  textSize(20);
  fill("white");
  stroke("black");
  text("FOOD REMAINING:"+foods, 160, 180);
  foodobj.display();
}


