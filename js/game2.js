// create a new scene
let gameScene = new Phaser.Scene('Game');

// parameters for our scene
gameScene.init = function () {
    this.playerSpeed = 3;
    this.dropMaxY = 460;
    this.dropMinY = 0;
    
    this.total = 0;
    this.totalText;
    
}

// load assets
gameScene.preload = function () {
    // load images
    this.load.image('background', 'assets/bg_blue.jpg');
    this.load.image('player', 'assets/abiUP.png');
    this.load.image('drop', 'assets/drop.png');
};

// called once after the preload ends
gameScene.create = function () {
    
    console.log(this);
    //let counter = 100;
    this.counter =100;
    this.dropNum =0;
    
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');

    // change the origin to the top-left corner
    bg.setOrigin(0, 0);

    // create the player
    this.player = this.add.sprite(80, this.sys.game.config.height - 100, 'player');

    // we are reducing the width and height 
    this.player.setScale(0.6);


    //group of drops
    this.drops = this.add.group({
        key: 'drop',
        y: Math.random() * -400,
        repeat: 100        
    });

    // scale drops down
    Phaser.Actions.ScaleXY(this.drops.getChildren(), -0.2, -0.2);
    
    // set random drop speeds & x positions
    for(let count = 0; count < 100; count++) {
        Phaser.Actions.Call(this.drops.getChildren(), function (drop) 
        {
            drop.speed = Math.random() * 2 + 1;
        }, this);
        
        Phaser.Actions.Call(this.drops.getChildren(), function (drop) 
        {
            drop.x = Math.random() * 400;
        }, this);
        
    }

    //player is alive
    this.isPlayerAlive = true;
    
    totalText = this.add.text(140, 30, '', { fontFamily: 'Arial Rounded', fontSize: '28px', fill: '#000' });
}; // end create




// this is called up to 60 times per second
gameScene.update = function () {
    
    
    //console.log(this.counter);
    
    
    //check is player isPlayer dead -> exit the update loop
    if (!this.isPlayerAlive) {
        return;
    }
    
    
     // check for active input
      if (this.input.activePointer.downX > this.player.x ) {
          // player moves right
          this.player.x += this.playerSpeed;
      }
      else  {
          // player moves left
          this.player.x -= this.playerSpeed;
      }
    

    this.time.addEvent({delay:2000, callback:dropFall, callbackScope:this});
    


    totalText.setText('Drops: ' + this.total);

}; // end update


/////////// FUNCTIONS ///////////////////////


function dropFall(){
    let drops = this.drops.getChildren();
    let numdrops = drops.length;
   
    if(this.dropNum <100){
        drops[this.dropNum].y += drops[this.dropNum].speed;

         console.log(drops[this.dropNum].y);
         if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), drops[this.dropNum].getBounds())) {

                this.total = collectDrop(drops[this.dropfall], this.total);
            }
            else if (drops[this.dropNum].y >= innerHeight){
                //resetDrop(drops[i]);   // Different Game Style


                this.counter = this.counter-1;
                console.log(this.counter);
                if (this.counter === 0){
                    this.gameOver();
                }

            }

        this.dropNum ++;
    }
                
    
    
}

function resetDrop(drop){
    // set random drop speeds, x and y positions

    //drop.speed = Math.random() * 2 + 1; 
    drop.speed = drop.speed*1.1;
    drop.y = Math.random() * -400;
    drop.x = Math.random() *400;
     
}

function collectDrop(drop, total)
{
    resetDrop(drop);
    total += 1;
    //console.log(total);
  
    return total;
}


// end the game
gameScene.gameOver = function () {

    //player alive flag set to dead
    this.isPlayerAlive = false;

    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(500);

    //fading out
    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);

    //restart game
    this.time.delayedCall(500, function () {
        this.scene.restart();
    }, [], this);
}

// set the configuration of the game
let config = {
    type: Phaser.AUTO,
    width: this.window.innerWidth,
    height: this.window.innerHeight,
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
