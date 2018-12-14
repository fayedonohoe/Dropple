//class mainMenu extends Phaser.Scene{
//    
//    constructor ()
//    {
//        super('Menu');
//
//        this.active;
//        this.currentScene;
//        
//        this.menubg;
//    }



let mainMenu = new Phaser.Scene('Menu')
    

mainMenu.preload = function() {
        this.load.image('menubg', 'assets/bg_menu.jpg');
        this.load.image('playbutton', 'assets/button.png');
        this.load.image('helpbutton', 'assets/helpbutton.png');
        this.load.image('mutebutton', 'assets/mutebutton.png');
        
        this.load.audio("menu_music", 'assets/Komiku_Home.mp3')
    }
    
mainMenu.create = function(){
        
        let menubg = this.add.sprite(0, 0, 'menubg');
        let playbutton = this.add.sprite(60, 250, 'playbutton');
        let helpbutton = this.add.sprite(60, 330, 'helpbutton');
        let mutebutton = this.add.sprite(60, 410, 'mutebutton');
        
        var menu_music = this.sound.add('menu_music');
        var game_music = this.sound.add('game_music');
        
        if(!mute){
            menu_music.play();
        }
        
        menubg.setOrigin(0,0);
        this.menubg.setScale(4);
        playbutton.setOrigin(0,0);
        helpbutton.setOrigin(0,0);
        mutebutton.setOrigin(0,0);
        
        playbutton.setInteractive();
        playbutton.on('pointerdown', () => this.scene.start('Game'));
        playbutton.on('pointerdown', () => menu_music.stop());   
        
        helpbutton.setInteractive();
        helpbutton.on('pointerdown', () => this.scene.start(helpScreen));  
        playbutton.on('pointerdown', () => menu_music.stop()); 
        
        mutebutton.setInteractive();
        //mutebutton.on('pointerdown', () => mute=true);
        mutebutton.on('pointerdown', () => toggleMute());
        mutebutton.on('pointerdown', () => menu_music.stop());
        
        
    }


//this.currentScene = new Menu();

var helpScreen = new Phaser.Scene('Help');

helpScreen.preload = function(){
    this.load.image('helpbg', 'assets/bg_menu.jpg');
    this.load.image('menubutton', 'assets/menubutton.png')
    
}

helpScreen.create = function () {
    

    
    let helpbg = this.add.sprite(0, 0, 'helpbg');
    this.helpbg.setScale(4);
    let menubutton = this.add.sprite(60, 250, 'menubutton');
    
    helpbg.setOrigin(0,0);
    menubutton.setOrigin(0,0);
    
    menubutton.setInteractive();
    //menubutton.on('pointerdown', () => this.menu_music.stop());
    menubutton.on('pointerdown', () => this.scene.start(mainMenu));
    
    
    
}


// create a new scene
let gameScene = new Phaser.Scene('Game');
let counter = 99;
let total = 0;
let mute = false;


// parameters for our scene
gameScene.init = function () {
    this.playerSpeed = 5;
}

// load assets
gameScene.preload = function () {
    // load images
    this.load.image('background', 'assets/bg_blue.jpg');
    this.load.image('player', 'assets/abiUP.png');
    this.load.image('drop', 'assets/drop.png');
    
    this.load.audio("game_music", 'assets/Komiku_Skate.mp3')
};


////////////////////////////////   CREATE   //////////////////////////
// called once after the preload ends
gameScene.create = function () {
    
    if(!mute){
        let game_music = this.sound.add('game_music');
        game_music.play();
    }

    
    var timer = this.time.delayedCall(30000, function() {gameScene.gameOver()}, [], this);
    console.log(timer);
        
    
    //let counter = 100;
    this.counter =100;
    
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');
    // change the origin to the top-left corner
    bg.setOrigin(0, 0);
    this.bg.setScale(4);

    // create the player
    this.player = this.physics.add.sprite(80, this.sys.game.config.height - 100, 'player');
    this.player.body.allowGravity = false;

    //reducing the width and height 
    this.player.setScale(1.2);
    
    drops = this.physics.add.group({
        key: 'drop',
        repeat: 99,
        setXY: { x: Phaser.Math.Between(0, innerWidth-20), 
                 y: 30,
                 //stepX: 20,
                 stepY: -30
               }
    });
    
    
    // Collision
    this.physics.add.overlap(gameScene.player, drops, collectDrop, null, this);
    
    //player is alive
    this.isPlayerAlive = true;
    
    totalText = this.add.text(140, 30, '', { fontFamily: 'Arial Rounded', fontSize: '28px', fill: '#000' });
    
}; // end create



///////////////////////////////  UPDATE //////////////////////////////////////


// this is called up to 60 times per second
gameScene.update = function () {
  
    //check if player isPlayer dead -> exit the update loop
    if (!this.isPlayerAlive) {
        return;
    }
    
    if(this.input.activePointer.isDown){   
        // check for active input
      if (this.input.activePointer.downX > this.player.x ) {
          // player moves right
          this.player.x += this.playerSpeed;
      }
      else  {
          // player moves left
          this.player.x -= this.playerSpeed;
      } 
    }
    
    console.log(total);
}; // end update

//////////////////////////// FUNCTIONS ////////////////////////////////

function toggleMute(){
    if(!mute){
        mute = true;
    }
    else{
        mute = false;
        if(Menu.isActive){
            menu.menu_music.play();
        }
    }
}

function collectDrop(player, drop)
{
    console.log("collect drop");
    drop.disableBody(true, true);
    drop.enableBody(true, drop.x, 0, true, true);
    resetDrop(drop);
    
    total++;
    totalText.setText("Drops: " + total);   
}

function resetDrop(drop){
    // set random drop speeds, x and y positions
    drop.speed = drop.speed*1.1;
    drop.gravity = drop.gravity*2;
    drop.y = Math.random() * -400;
    drop.x = Math.random() *400;
}

// end the game
gameScene.gameOver = function () {

    //player alive flag set to dead
    this.isPlayerAlive = false;

    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(100);
    
    //this.game_music.stop();
    mute = true;
    
    //fading out
    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);
    
    
    
    
    

    //restart game
    this.time.delayedCall(10000, function () {    
        this.scene.restart();
        mutr = false;
    }, [], this);
}


 


// set the configuration of the game
let config = {
    type: Phaser.AUTO,
    width: this.window.innerWidth,
    height: this.window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: [mainMenu, helpScreen, gameScene]
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
