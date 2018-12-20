let mainMenu = new Phaser.Scene('Menu')
    

mainMenu.preload = function() {
        this.load.image('title', 'assets/title.png');
        this.load.image('menubg', 'assets/bg_menu.jpg');
        this.load.image('playbutton', 'assets/button.png');
        this.load.image('helpbutton', 'assets/helpbutton.png');
        this.load.image('mutebutton', 'assets/mutebutton.png');
        
        this.load.audio("menu_music", 'assets/Komiku_Home.mp3');
        this.load.audio("game_music", 'assets/Komiku_Skate.mp3')
    
    }
    
mainMenu.create = function(){
    
        window.addEventListener('resize', resize);
        resize();
        
        let menubg = this.add.sprite(0, 0, 'menubg');
        let title = this.add.sprite(90, 80, 'title');
        let playbutton = this.add.sprite(120, 550, 'playbutton');
        let helpbutton = this.add.sprite(120, 750, 'helpbutton');
        let mutebutton = this.add.sprite(120, 950, 'mutebutton');
        
        var menu_music = this.sound.add('menu_music');
        var game_music = this.sound.add('game_music');
    
        menu_music.stop(); //does nothing
        
        if(!mute){
            menu_music.play();
        }
        
        menubg.setOrigin(0,0);
        title.setOrigin(0,0);
        playbutton.setOrigin(0,0);
        helpbutton.setOrigin(0,0);
        mutebutton.setOrigin(0,0);
        
        playbutton.setInteractive();
        playbutton.on('pointerdown', () => this.scene.start('Game'));
        playbutton.on('pointerdown', () => menu_music.stop());   
        
        helpbutton.setInteractive();
        playbutton.on('pointerdown', () => menu_music.stop());
        helpbutton.on('pointerdown', () => this.scene.start(helpScreen));  
         
        
        mutebutton.setInteractive();
        //mutebutton.on('pointerdown', () => mute=true);
        mutebutton.on('pointerdown', () => toggleMute());
        mutebutton.on('pointerdown', () => menu_music.stop());
        
        
    }


//this.currentScene = new Menu();

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
    //menubutton.on('pointerdown', () => menu_music.stop());
    menubutton.on('pointerdown', () => this.scene.start(mainMenu));
   
}


// create a new scene
let gameScene = new Phaser.Scene('Game');
let total = 0;
var mute = false;


// parameters for our scene
gameScene.init = function () {
    this.playerSpeed = 10;
}

// load assets
gameScene.preload = function () {
    
    //Loading Screen Preload
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
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
    
    this.load.on('progress', function (value) {
        //console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(350, 880, 300 * value, 60);
        percentText.setText(parseInt(value * 100) + '%');
    });    
    
    this.load.on('complete', function () {
        //console.log('complete');
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });
    
    // load images
    this.load.image('background', 'assets/bg_blue.jpg');
    this.load.image('player', 'assets/abiUP.png');
    this.load.image('drop', 'assets/drop.png');
    
    this.load.image('black', 'assets/bg_black.jpg');
    this.load.image('playagainbutton', 'assets/playagain.png')
    this.load.image('backtomenubutton', 'assets/menubutton.png')
    
    this.load.audio("game_music", 'assets/Komiku_Skate.mp3')
};


////////////////////////////////   CREATE   //////////////////////////
// called once after the preload ends
gameScene.create = function () {
    
    if(!mute){
        let game_music = this.sound.add('game_music');
        game_music.play();
        game_music.setLoop(true);
    }

    
    var timer = this.time.delayedCall(30000, function() {gameScene.gameOver()}, [], this);
    console.log(timer);
    
    // FOR TESTING ONLY
//    var timer = this.time.delayedCall(1000, function() {gameScene.gameOver()}, [], this);
//    console.log(timer);
        
    
    //let counter = 100;
    this.counter =100;
    
    // create bg sprite
    let bg = this.add.sprite(-50, 0, 'background');
    // change the origin to the top-left corner
    bg.setOrigin(0, 0);
    //this.bg.setScale(4);

    // create the player
    this.player = this.physics.add.sprite(80, this.sys.game.config.height - 280, 'player');
    this.player.body.allowGravity = false;

    //reducing the width and height 
    this.player.setScale(2);
    
    drops = this.physics.add.group({
        key: 'drop',
        repeat: 149,
        setXY: { x: Phaser.Math.Between(0, innerWidth-20), 
                 y: 30,
                 stepY: -30
               }
    });
    
    
    // Collision
    this.physics.add.overlap(gameScene.player, drops, collectDrop, null, this);
    
    //player is alive
    this.isPlayerAlive = true;
    
    totalText = this.add.text(320, 80, '', { fontFamily: 'Calibri', fontStyle:'bold', fontSize: '90px', fill: '#000' });
    
    
    
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
    
    //console.log(total);
}; // end update


function shutUp(){
        //this.menu_music.stop();
        game_music.stop();
    }
//////////////////////////// FUNCTIONS ////////////////////////////////



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

function collectDrop(player, drop)
{
    //console.log("collect drop");
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
    drop.x = Math.random() * 950;
}

// end the game
gameScene.gameOver = function () {
    

    //player alive flag set to dead
    this.isPlayerAlive = false;

    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(100);
    
    //this.game_music.stop();
    mute = true;

    
    let black = this.add.sprite(0, 0, 'black');
    black.setOrigin(0, 0);
    
    //endText1 = this.add.text(120, 400, 'Drops You Helped Collect: ', { fontFamily: 'Calibri', fontStyle:'bold', fontSize: '90px', fill: '#fff' });
    endText2 = this.add.text(450, 600, total , { fontFamily: 'Calibri', fontStyle:'bold', fontSize: '90px', fill: '#fff' });
    
    
    let playagainbutton = this.add.sprite(140, 800, 'playagainbutton')
    playagainbutton.setOrigin(0,0);
    playagainbutton.setInteractive();
    playagainbutton.on('pointerdown', () => this.scene.restart());
    
    let backtomenubutton = this.add.sprite(140, 1000, 'backtomenubutton')
    backtomenubutton.setOrigin(0,0);
    backtomenubutton.setInteractive();
    //backtomenubutton.on('pointerdown', () => Game.shutUp());
    backtomenubutton.on('pointerdown', () => this.scene.start(mainMenu));
    
    
    total = 0;

//    //restart game
//    this.time.delayedCall(10000, function () {    
//        this.scene.restart();
//        mutr = false;
//    }, [], this);
}



function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}
 


// set the configuration of the game
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
    scene: [mainMenu, helpScreen, gameScene]
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
