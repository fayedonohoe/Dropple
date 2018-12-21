/*
Title: Dropple!
Author: Faye Donohoe - N00174001
Date Began: 1-11-2018
Description: A casual one handed game for mobile devices
             Help Abigail collect as many raindrops as possible in 30 seconds
             Control Abigail by tapping either side of her
*/


var gameMode;
let mainMenu = new Phaser.Scene('Menu');

mainMenu.preload = function() {
        this.load.image('title', 'assets/title.png');
        this.load.image('menubg', 'assets/bg_menu.jpg');
        this.load.image('playbutton', 'assets/button.png');
        this.load.image('helpbutton', 'assets/helpbutton.png');
        this.load.image('mutebutton', 'assets/mutebutton.png');
        
        this.load.audio("menu_music", 'assets/Komiku_Home.mp3');
        this.load.audio("game_music", 'assets/Komiku_Skate.mp3')
    } // End menu preload
    
mainMenu.create = function(){
        let menubg = this.add.sprite(0, 0, 'menubg');
        let title = this.add.sprite(90, 80, 'title');
        let playbutton = this.add.sprite(120, 550, 'playbutton');
        let helpbutton = this.add.sprite(120, 750, 'helpbutton');
        let mutebutton = this.add.sprite(120, 950, 'mutebutton');
        
        // Create Instances of the Audio Files
        var menu_music = this.sound.add('menu_music');
        var game_music = this.sound.add('game_music');
        
        if(!mute){
            menu_music.play();
        }
        
        menubg.setOrigin(0,0);
        title.setOrigin(0,0);
        playbutton.setOrigin(0,0);
        helpbutton.setOrigin(0,0);
        mutebutton.setOrigin(0,0);
        
    
        // Make each of the button sprites interactive to navigate the menu
        playbutton.setInteractive();
        playbutton.on('pointerdown', () => this.scene.start('Select'));
        playbutton.on('pointerdown', () => menu_music.stop());   
        
        helpbutton.setInteractive();
        playbutton.on('pointerdown', () => menu_music.stop());
        helpbutton.on('pointerdown', () => this.scene.start(helpScreen));  
         
        mutebutton.setInteractive();
        mutebutton.on('pointerdown', () => toggleMute());
        mutebutton.on('pointerdown', () => menu_music.stop());
             
    }// End Menu Create


let modeSelect = new Phaser.Scene('Select');
modeSelect.preload = function() {
        this.load.image('title', 'assets/title.png');
        this.load.image('menubg', 'assets/bg_menu.jpg');
    
        this.load.image('easy', 'assets/easy.png');
        this.load.image('normal', 'assets/normal.png');
        this.load.image('hard', 'assets/hard.png');
        this.load.image('easytext', 'assets/easytext.png');
        this.load.image('normaltext', 'assets/normaltext.png');
        this.load.image('hardtext', 'assets/hardtext.png');
        
        this.load.audio("menu_music", 'assets/Komiku_Home.mp3');
        this.load.audio("game_music", 'assets/Komiku_Skate.mp3')    
    } // End mode preload
    
modeSelect.create = function(){   
        let menubg = this.add.sprite(0, 0, 'menubg');
        let title = this.add.sprite(90, 80, 'title');
        let easy = this.add.sprite(20, 550, 'easy');
        let easytext = this.add.sprite(20, 550, 'easytext');
        let normal = this.add.sprite(335, 550, 'normal');
        let normaltext = this.add.sprite(335, 550, 'normaltext');
        let hard = this.add.sprite(650, 550, 'hard');
        let hardtext = this.add.sprite(650, 550, 'hardtext');
        
        var menu_music = this.sound.add('menu_music');
        var game_music = this.sound.add('game_music');
        
        menubg.setOrigin(0,0);
        title.setOrigin(0,0);
        easy.setOrigin(0,0);
        normal.setOrigin(0,0);
        hard.setOrigin(0,0);
        easytext.setOrigin(0,0);
        normaltext.setOrigin(0,0);
        hardtext.setOrigin(0,0);
        
    
        //User has the option of selection one of three game modes / difficulties
        //Depending on which is selected, the gameMode global variable will be 
        //assigned an integer value
    
        easy.setInteractive();
        easy.on('pointerdown', () => gameMode = 1);
        easy.on('pointerdown', () => this.scene.start('Game'));
        easy.on('pointerdown', () => menu_music.stop());   
        
        normal.setInteractive();
        normal.on('pointerdown', () => gameMode = 2);
        normal.on('pointerdown', () => this.scene.start('Game'));
        normal.on('pointerdown', () => menu_music.stop()); 
         
        
        hard.setInteractive();
        hard.on('pointerdown', () => gameMode = 3);
        hard.on('pointerdown', () => this.scene.start('Game'));
        hard.on('pointerdown', () => menu_music.stop());    
    }// End Mode Create


var helpScreen = new Phaser.Scene('Help');
helpScreen.preload = function(){
    this.load.image('helpbg', 'assets/bg_help.jpg');
    this.load.image('menubutton', 'assets/menubutton.png') 
}

helpScreen.create = function () {       
    let helpbg = this.add.sprite(0, 0, 'helpbg');
    let menubutton = this.add.sprite(90, 1000, 'menubutton');
    
    helpbg.setOrigin(0,0);
    menubutton.setOrigin(0,0);
    
    menubutton.setInteractive();
    menubutton.on('pointerdown', () => this.scene.start(mainMenu));
}
// End Help Screen


//Create the main game scene
let gameScene = new Phaser.Scene('Game');
let total = 0;           //Initialising Total for keeping score
var mute = false;
    

// parameters 
gameScene.init = function () {
    this.playerSpeed = 10;  // Affects how quickly the player moves to the users x input
}

// load assets
gameScene.preload = function () {
    
    //Loading Screen 
    // Add the phaser 3 graphics
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);       //Filling boxes with colour and alpha values for opacity
    progressBox.fillRect(340, 870, 320, 80);
    
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 40,
        text: 'Taking Off...',
        style: {
            font: '40px calibri',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2 + 15,
        y: height / 2 + 35,
        text: '0%',
        style: {
            font: '22px calibri',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    //The following code continuously updates to increment the percentage output
    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(350, 880, 300 * value, 60);
        percentText.setText(parseInt(value * 100) + '%');
    });    
    
    //When the preload is complete, remove these entities from the screen
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });
    
    // load images and audio
    this.load.image('background', 'assets/bg_blue.jpg');
    this.load.image('backgroundnorm', 'assets/bg_norm.jpg');
    this.load.image('backgroundhard', 'assets/bg_hard.jpg');
    
    this.load.image('dropzone', 'assets/dropzone.png');
    this.load.image('player', 'assets/abiUP.png');
    this.load.image('drop', 'assets/drop.png');
    
    this.load.image('black', 'assets/bg_black.jpg');
    this.load.image('playagainbutton', 'assets/playagain.png')
    this.load.image('backtomenubutton', 'assets/menubutton.png')
    
    this.load.audio("game_music", 'assets/Komiku_Skate.mp3')
}; // End game preload


////////////////////////////////   CREATE   //////////////////////////
// called once after the preload ends
gameScene.create = function () {
    
    //Check if mute has been selevted, if not, play the music and loop when it ends
    if(!mute){
        let game_music = this.sound.add('game_music');
        game_music.play();
        game_music.setLoop(true);
    }

    //Timed Event - Allows the game to run for 30 seconds, when time runs out, gameOver is called
    var timer = this.time.delayedCall(30000, function() {gameScene.gameOver()}, [], this);
    console.log(timer);
    
//    FOR TESTING ONLY
//    var timer = this.time.delayedCall(1000, function() {gameScene.gameOver()}, [], this);
//    console.log(timer);
        
    
    // create bg sprite depending on game mode selected
    if (gameMode == 3){
        var bg = this.add.sprite(-50, 0, 'backgroundhard');
    } else if (gameMode == 2){
        var bg = this.add.sprite(-50, 0, 'backgroundnorm');
    } else {
        var bg = this.add.sprite(-50, 0, 'background');
    }
    bg.setOrigin(0, 0);
    
    //Only really applicable to first game mode
    this.dropzone = this.physics.add.sprite(0, 1850, 'dropzone');
    this.dropzone.setOrigin(0, 0);
    this.dropzone.body.allowGravity = false;
    
    // create the player and add physics
    this.player = this.physics.add.sprite(80, this.sys.game.config.height - 280, 'player');
    this.player.body.allowGravity = false;
    this.player.setScale(2);              //increasing the width and height 
    
    //Creating a group pf drop objects with physics applied.
    drops = this.physics.add.group({
        key: 'drop',
        repeat: 149,
        setXY: { x: Phaser.Math.Between(0, innerWidth-20), 
                 y: 30,
                 stepY: -30
               }
    });
    
    // If the user selects hard mode, shrink the raindrops
    if (gameMode == 3){
        Phaser.Actions.ScaleXY(drops.getChildren(), -0.5, -0.5);
    }

    
    // Collisions
    this.physics.add.overlap(gameScene.player, drops, collectDrop, null, this);
    
    if (gameMode == 1){
        this.physics.add.overlap(gameScene.dropzone, drops, easyReset, null, this);
    }
    
    //player is alive
    this.isPlayerAlive = true;
    
    //For Displaying the Total Score
    totalText = this.add.text(320, 80, '', { fontFamily: 'Calibri', fontStyle:'bold', fontSize: '90px', fill: '#000' });
    
}; // End Game Create



///////////////////////////////  UPDATE //////////////////////////////////////


// Called 60 times per second
gameScene.update = function () {
  
    //check if player isPlayer dead -> exit the update loop
    if (!this.isPlayerAlive) {
        return;
    }
    
    // Player Movement
    //Gets user touch input and increase or decrease Abigails x value accordingly
    if(this.input.activePointer.isDown){                        // check for active input     
      if (this.input.activePointer.downX > this.player.x ) {    // player moves right        
          this.player.x += this.playerSpeed;
      }
      else  {
          this.player.x -= this.playerSpeed;                     // player moves left
      } 
    }

}; // End Game Update


function shutUp(){
        game_music.stop();
    }
//////////////////////////// FUNCTIONS ////////////////////////////////

// For Muting Music
function toggleMute(){
    if(!mute){
        mute = true;
    }
    else{
        mute = false;
        if(mainMenu.isActive){
            menu.menu_music.play();
        }
    }
}

//When Plkayer collides with a drop, both are passed into this function
//Drop is disabled and re-enabled and passed into the resetDrop function
function collectDrop(player, drop)
{
    drop.disableBody(true, true);
    drop.enableBody(true, drop.x, 0, true, true);
    resetDrop(drop);
    
    //Increment Score and Display Current Score
    total++;
    totalText.setText("Drops: " + total);   
}

//Same as above but without incrememnting the score, Easy mode only
function easyReset(zone, drop){
    drop.disableBody(true, true);
    drop.enableBody(true, drop.x, 0, true, true);
    resetDrop(drop);
}

function resetDrop(drop){
    // set random x and y positions
    drop.y = Math.random() * -400;
    drop.x = Math.random() * 950;
}


// End the game
gameScene.gameOver = function () {
    
    //player alive flag set to dead
    this.isPlayerAlive = false;

    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(100);
    
    //this.game_music.stop();
    mute = true;
    
    //Scene Overlay
    let black = this.add.sprite(0, 0, 'black');
    black.setOrigin(0, 0);
    
    //Display Final Score
    endText2 = this.add.text(450, 600, total , { fontFamily: 'Calibri', fontStyle:'bold', fontSize: '90px', fill: '#fff' });
    
    // User Interaction to play again or return to menu
    let playagainbutton = this.add.sprite(140, 800, 'playagainbutton')
    playagainbutton.setOrigin(0,0);
    playagainbutton.setInteractive();
    playagainbutton.on('pointerdown', () => this.scene.restart());
    
    let backtomenubutton = this.add.sprite(140, 1000, 'backtomenubutton')
    backtomenubutton.setOrigin(0,0);
    backtomenubutton.setInteractive();
    backtomenubutton.on('pointerdown', () => this.scene.start(mainMenu));
    
    total = 0;      //Resets the Score To play again from scratch
} // End Game Over




// set the configuration of the game
//Match window dimensions, apply arcade settings and physics
let config = {
    type: Phaser.AUTO,
    width: this.window.innerWidth,
    height: this.window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
            debug: false
        }
    },
    scene: [mainMenu, helpScreen, modeSelect, gameScene]
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
