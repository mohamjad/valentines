import TUTORIAL from "./tutorial.js";
import UI from "./ui.js";
import TIPS from "./tips.js";
import PLAYER from "./player.js";
import PLATFORMS from "./platforms.js";
import COINS from "./coins.js";
import MOBS from "./mobs.js";
import ASCIIRAIN from "./asciiRain.js";
import { LEVELS } from "../levels.js";
import { themes } from "../themes.js";

export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    getUserData(item, defaultValue) {
        let data = localStorage.getItem(item);
        if(!data && defaultValue) {
            this.setUserData(item, defaultValue);
            data = defaultValue;
        }
        return data;
    }

    setUserData(item, value) {        
        localStorage.setItem(item, value);
        this[item] = value;
    }

    init(data) {
        this.checkpointSpawn = (data && data.checkpointSpawn) || null;
        this.devMode = parseInt(this.getUserData("devMode", "0")); 
        let savedLevel = this.getUserData("level", "0");
        let lvl = Math.max(0, Math.min(parseInt(savedLevel, 10) || 0, LEVELS.length - 1));
        this.level = String(lvl);
        this.setUserData("level", this.level);
        this.themeName = this.getUserData("themeName", "Valentine");
        this.soundOn = this.getUserData("soundOn", "1");

        this.tick = 0;
        this.tweening = true;
        this.tipsShowing = false;
        this.gameOver = false;
        this.creditsShown = false;
        this.valentineChoiceShown = false;
        this.valentineChoiceGraceUntil = 0;
        this.showingDoubleJumpPopup = false;
        this.maxLevel = LEVELS.length - 1;
        this.score = Math.max(12, (parseInt(this.level, 10) || 0) * 12);
        this.theme = themes[this.themeName] || themes.Valentine;
    }

    preload() {          
        this.showLoadingScreen();

        // LOAD ASSETS

        //tutorial and ui
        this.load.image('scroll', 'assets/tutorialUI/scroll.png');
        this.load.image('scrollBG', 'assets/tutorialUI/scrollBG.png');
        this.load.image('title', 'assets/tutorialUI/title.png');

        //player    
        this.load.spritesheet('dude', 'assets/dude/dude.png', { 
            frameWidth: 51.888, frameHeight: 98 
        });

        //platforms
        this.load.image('ground', 'assets/platforms/ground.png');
        this.load.image('platform0', 'assets/platforms/platform0.png'); // !!!!!
        this.load.image('platform1', 'assets/platforms/platform1.png'); // &&&&&
        this.load.image('platform2', 'assets/platforms/platform2.png'); // %%%%%
        this.load.image('platform3', 'assets/platforms/platform3.png'); // #####
        this.load.image('platform4', 'assets/platforms/platform4.png'); // /////
        this.load.image('platform5', 'assets/platforms/platform5.png'); // \\\\\
        this.load.image('platform6', 'assets/platforms/platform6.png'); // |_|_|_|
        this.load.image('platform7', 'assets/platforms/platform7.png'); // |_|_|_|_|_|_|

        //mobs (heart texture created at runtime to avoid load freeze)
        this.load.image('mob0', 'assets/mobs/mob0.png');
        this.load.image('bouncer', 'assets/mobs/mob0.png');
        this.load.image('mob1', 'assets/mobs/mob1.png');
        this.load.image('bomb', 'assets/mobs/bomb.png');
        //this.load.image('healthPot', 'assets/healthPot.png');
        
        //ascii rain
        this.load.spritesheet('asciiRain', 'assets/asciiRain/asciiRain.png', { 
            frameWidth: 16.6, frameHeight: 2074
        }); 
        this.load.image('rainBG', 'assets/asciiRain/rainBG.png');

        //art
        this.load.image('cloud0', 'assets/art/cloud0.png');
        this.load.image('cloud1', 'assets/art/cloud1.png');
        this.load.image('tree0', 'assets/art/tree0.png');
        this.load.image('tree1', 'assets/art/tree1.png');
        this.load.image('tree2', 'assets/art/tree2.png');
        this.load.image('tree3', 'assets/art/tree3.png');
        this.load.image('shrub0', 'assets/art/shrub0.png');
        this.load.image('mushroom0', 'assets/art/mushroom0.png');
        this.load.image('mushroom1', 'assets/art/mushroom1.png');
        this.load.image('flower0', 'assets/art/flower0.png');
        this.load.image('flower1', 'assets/art/flower1.png');
        this.load.image('flower2', 'assets/art/flower2.png');
        this.load.image('flower3', 'assets/art/flower3.png');
        this.load.image('flower4', 'assets/art/flower4.png');
        this.load.image('tower0', 'assets/art/tower0.png');
        this.load.image('hut', 'assets/art/hut.png');
        this.load.image('rat', 'assets/art/rat.png');
        this.load.image('wagon', 'assets/art/wagon.png');
        this.load.image('moon', 'assets/art/moon.png');
        this.load.image('star', 'assets/art/star.png');
        this.load.image('barn', 'assets/art/barn.png');

        //sounds
        this.load.audio('rain', ['assets/soundFX/asciiRain.mp3']);
        this.load.audio('coin', ['assets/soundFX/collectCoin.mp3']);
        this.load.audio('death', ['assets/soundFX/death.mp3']);
    }

    create () {       
        let world = this.physics.world;

        // Heart texture for collectibles (runtime so no load freeze)
        if (!this.textures.exists('heart')) {
            let canvas = document.createElement('canvas');
            canvas.width = 48;
            canvas.height = 48;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.font = '36px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('♡', 24, 24);
            this.textures.addCanvas('heart', canvas);
        }

        this.cameras.main.setBackgroundColor(this.theme.bg);
        this.ui = new UI(this, this.level, this.score);
        this.tips = new TIPS(this);
        
        this.base = this.physics.add.staticGroup();
        this.base.create(512, 748, 'ground').setDepth(75).setTint(this.theme.base);
        this.platforms = new PLATFORMS(world, this, {}); 

        this.player = new PLAYER(this, 375, 300, 'dude', 0);        
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 1024, 768, true, true, false, true); // don't collide with top of screen

        this.coins = new COINS(world, this, {
            key: 'heart',
            repeat: 11,
            setXY: { x: 42, y: 0, stepX: 85 }
        });
        this.asciiRain = new ASCIIRAIN(world, this, {});
        this.mobs = new MOBS(world, this, {});
        this.art = [];
        this.movingPlats = [];
                    
        this.physics.add.collider(this.player, this.base);  
        this.physics.add.collider(this.player, this.platforms);          
        this.physics.add.collider(this.mobs, this.base); 
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.coins, this.base);
        this.physics.add.collider(this.coins, this.platforms);

        this.physics.add.collider(this.mobs, this.mobs, this.mobHit, null, this);
        this.physics.add.collider(this.player, this.mobs, this.hitMob, null, this);  
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        // Debug: keys 1–4 skip to level 1–4
        this.input.keyboard.on('keydown', (e) => {
            let n = e.key === '1' ? 1 : e.key === '2' ? 2 : e.key === '3' ? 3 : e.key === '4' ? 4 : 0;
            if (n > 0 && n <= this.maxLevel) {
                this.level = String(n);
                localStorage.setItem('level', this.level);
                this.scene.restart();
            }
        });

        if(this.level == 0) {
            this.buildLevel();
        }
        this.playTween();
        
        this.rainFX = this.sound.add('rain');
        this.coinFX = this.sound.add('coin');
        this.deathFX = this.sound.add('death');
        if(this.soundOn === "1") {
            this.rainFX.play();
        } else {
            this.ui.toggleSound()
        }
    }
    
    update (time, delta) { 
        if (this.gameOver) {
            if (!this.creditsShown && !this.valentineChoiceShown) {
                this.creditsShown = true;
                this.rollCredits();
            }
        } else {
            let p = this.player;
            const L = LEVELS[parseInt(this.level, 10)];
            const groundDeathY = L && L.groundDeathY != null ? L.groundDeathY : null;
            if (groundDeathY != null && !this.tipsShowing && !this.gameOver && p.y >= groundDeathY) {
                if (this.valentineChoiceLevel) {
                    this.valentineGroundDeath();
                } else {
                    this.triggerFallDeath();
                }
            } else if (this.valentineChoiceLevel && !this.gameOver && this.time.now >= (this.valentineChoiceGraceUntil || 0)) {
                if (this.asciiRain && this.asciiRain.rainUpActive) this.asciiRain.rainUpWrap();
                const graceGroundDeathY = 700;
                if (!this.tipsShowing && p.y >= graceGroundDeathY) {
                    this.valentineGroundDeath();
                } else {
                    // YES is handled by overlap with yesZoneSensor (see buildLevel)
                    const inNo = L && (L.noZoneY != null ? p.y >= L.noZoneY : p.y > 680) && p.body.touching.down;
                    if (inNo) {
                        this.triggerValentineChoice(false);
                    }
                }
            }
            // Moving platforms: carry player when standing on them
            if (this.movingPlats && this.movingPlats.length && !this.gameOver && !this.tipsShowing) {
                const p = this.player;
                const pb = p.body;
                const footY = p.y + (pb.height * 0.45);
                for (const mp of this.movingPlats) {
                    if (!mp.body) continue;
                    const mx = mp.x, my = mp.y, mw = mp.width, mh = mp.height;
                    const onTop = p.body.touching.down && footY >= my - 4 && p.y <= my + mh * 0.3 && p.x >= mx - 10 && p.x <= mx + mw + 10;
                    if (onTop) {
                        const dx = (mp._prevX != null) ? mx - mp._prevX : 0;
                        const dy = (mp._prevY != null) ? my - mp._prevY : 0;
                        p.x += dx;
                        p.y += dy;
                        pb.updateFromGameObject();
                    }
                    mp._prevX = mx;
                    mp._prevY = my;
                }
            }
            if(!this.tweening && !this.showingDoubleJumpPopup && !this.tipsShowing) {
                this.player.move();
                if(time - this.tick > 3000) {
                    this.tick = time;
                    const L = LEVELS[parseInt(this.level, 10)];
                    if (!(L && L.coinPositions)) this.coins.bounce();
                    if(this.level == 0) {
                        this.tutorial.changeHint();
                    }
                }
            }
        } 
    }

    /////////////////////////////////////////////////////////////////////////////
    //                               Game events                               //
    /////////////////////////////////////////////////////////////////////////////

    collectCoin(player, coin) {
        if (typeof coin.disableBody === 'function') {
            coin.disableBody(true, true);
        } else {
            if (coin.body) coin.body.setEnable(false);
            coin.setActive(false).setVisible(false);
        }
        // Coin recharge: exactly one extra jump. Grace frames prevent overlap/order from resetting it.
        if (this.player && this.player.doubleJumpLevel && this.player.jumpsUsed >= 2) {
            this.player.jumpsUsed = 1;
            this.player._rechargeGraceFrames = 6;
        }
        this.ui.updateScore(this.score + 1);
        if (this.valentineChoiceLevel) {
            this.triggerValentineChoice(true);
            return;
        }
        const lvl = parseInt(this.level, 10);
        const levelDef = LEVELS[lvl];
        const totalCoins = (levelDef && levelDef.coinPositions && levelDef.coinPositions.length) || 0;
        const activeCoins = this.coins.countActive(true);
        if (!this.gameOver && totalCoins > 0 && activeCoins === 0) {
            this.levelUp();
        }
    }

    hitMob(player, mob) {
        if (!mob || !mob.body || !mob.body.enable || this.gameOver || this.tipsShowing) return;
        switch(mob.key) {
            case 'mob0': //witchhazel
            case 'bouncer':
                //player can kick from the sides, but landing on the pointy hat is bad news
                if((player.x > mob.x-25) && (player.x < mob.x+25)) {
                    this.killPlayer(player, mob);
                }
            break;
            case 'mob1': //scuttlebot
                //runs player down from the sides,
                //but player can hop on it's head
                if(player.y + 50 > mob.y) {
                    this.killPlayer(player, mob);
                }
            break;
            default:
                this.killPlayer(player, mob);
            break;
        }
    }

    mobHit(mob1, mob2) {
        //console.log(mob1.key + " hit " + mob2.key);
    }

    killPlayer(player, mob) {
        if (this.gameOver || this.tipsShowing) return;
        if (!mob || !mob.scene) return;
        this.physics.pause();
        this.deathFX.play({ seek: 2.5 });
        player.anims.play('turn');

        if (this.valentineChoiceLevel) {
            mob.destroy();
            this.showValentineDeathRetry();
        } else {
            this.tips.showTips(mob);
        }
    }

    showValentineDeathRetry() {
        this.tipsShowing = true;
        const cx = 512, cy = 384;
        this.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.theme.bg).setScrollFactor(0);
        this.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.theme.scroll).setScrollFactor(0);
        this.add.text(cx, cy - 104, 'You died!', { color: 'white', fontSize: 'xx-large' }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        this.add.text(cx, cy - 44, 'No penalty — try the level again.', { color: 'white', fontSize: 'x-large' }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        const btn = this.add.text(cx, cy + 36, '[Try again]', { color: 'white', fontSize: 'xx-large' }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        btn.setScrollFactor(0);
        btn.on('pointerup', () => {
            this.level = String(this.maxLevel);
            localStorage.setItem('level', this.level);
            this.scene.restart();
        });
    }

    valentineGroundDeath() {
        this.physics.pause();
        this.deathFX.play({ seek: 2.5 });
        this.player.anims.play('turn');
        if (!this.gameOver && !this.tipsShowing) this.showValentineDeathRetry();
    }

    triggerFallDeath() {
        this.physics.pause();
        this.deathFX.play({ seek: 2.5 });
        this.player.anims.play('turn');
        if (!this.gameOver && !this.tipsShowing) this.showFallDeathRetry();
    }

    showFallDeathRetry() {
        this.tipsShowing = true;
        const cx = 512, cy = 384;
        this.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.theme.bg).setScrollFactor(0);
        this.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.theme.scroll).setScrollFactor(0);
        this.add.text(cx, cy - 104, 'You fell!', { color: 'white', fontSize: 'xx-large' }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        this.add.text(cx, cy - 44, 'Try the level again.', { color: 'white', fontSize: 'x-large' }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        const currentLevel = this.level;
        const checkpointSpawn = this.checkpointSpawn;
        const btn = this.add.text(cx, cy + 36, '[Try again]', { color: 'white', fontSize: 'xx-large' }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        btn.on('pointerup', () => {
            this.level = currentLevel;
            localStorage.setItem('level', this.level);
            this.scene.restart({ checkpointSpawn: checkpointSpawn || undefined });
        });
    }

    levelUp() { 
        if(this.ui.helpShowing) {
            this.ui.showHelp(false);
        }

        let level = parseInt(this.level, 10);
        level++; 

        if(level > this.maxLevel) {
            this.gameOver = true;
        } else { 
            this.level = String(level);
            localStorage.setItem("level", this.level);       
            this.ui.updateLevel(this.level);
            this.rainFX.play();
            this.playTween();
        } 
    }
    
    rollCredits(saidYes) {
        const cx = 512, cy = 384;
        this.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.theme.bg).setScrollFactor(0);
        this.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.theme.scroll).setScrollFactor(0);

        let text = ``;
        if (saidYes === true) {
            text = `
     Yes! ♥♥♥

   You said yes!
   I'm so happy.

   Happy Valentine's Day, Joanne!

   I made this for you.`;
        } else if (saidYes === false) {
            text = `
   No worries ♥

   Maybe next year?
   Either way —

   I made this for you, Joanne.

   Happy Valentine's Day!`;
        } else if (this.score > 0) {
            text = `
   Congratulations!

   You earned ${this.score} hearts.

   Happy Valentine's Day, Joanne!`;
        } else {
            text = `
   Try again!

   Collect the hearts and
   watch out for hazards.

   I made this for you, Joanne.`;
        }

        this.add.text(cx, cy - 114, text, {
            color: 'white', fontSize: 'xx-large',
        }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);

        const button = this.add.text(cx, cy + 46, '[PLAY AGAIN]', {
            color: 'white', fontSize: 'xx-large',
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        button.on('pointerup', () => {
            if (saidYes === true || saidYes === false) {
                this.level = String(this.maxLevel);
                localStorage.setItem('level', this.level);
            } else {
                this.level = '0';
                this.valentineChoiceShown = false;
                this.score = 12;
                localStorage.setItem('level', this.level);
            }
            this.scene.restart();
        });
    }

    heartsGameOver() {
        this.gameOver = true;
        this.creditsShown = true;
        const cx = 512, cy = 384;
        this.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.theme.bg).setScrollFactor(0);
        this.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.theme.scroll).setScrollFactor(0);
        this.add.text(cx, cy - 114, `
   Out of hearts! ♥

   You ran out of hearts.
   Try again and watch out
   for those hazards!`, {
            color: 'white', fontSize: 'xx-large',
        }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        const button = this.add.text(cx, cy + 46, '[PLAY AGAIN]', {
            color: 'white', fontSize: 'xx-large',
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        button.on('pointerup', () => {
            this.level = '0';
            this.valentineChoiceShown = false;
            localStorage.setItem('level', this.level);
            this.scene.restart();
        });
    }

    triggerValentineChoice(saidYes) {
        this.gameOver = true;
        this.valentineChoiceShown = true;
        if (saidYes) {
            if (this.soundOn === '1') this.rainFX.play();
            if (this.asciiRain) {
                this.asciiRain.rainUpActive = false;
                this.asciiRain.rain();
            }
            if (this.cameras.main.flash) this.cameras.main.flash(500, 1, 0.94, 0.97);
            this.time.delayedCall(1800, () => {
                this.showILoveYou();
            });
            this.time.delayedCall(5200, () => {
                this.rollCredits(true);
            });
        } else {
            this.time.delayedCall(800, () => {
                this.rollCredits(false);
            });
        }
    }

    showILoveYou() {
        const cx = 512, cy = 384;
        const bg = this.add.rectangle(cx, cy, 1024, 768, 0x1a0a0f, 0.85).setDepth(99).setOrigin(0.5).setScrollFactor(0);
        const line1 = this.add.text(cx, cy - 64, 'I LOVE YOU', {
            fontFamily: 'sans-serif',
            fontSize: '72px',
            color: '#f8bbd9',
        }).setOrigin(0.5, 0.5).setDepth(100).setScrollFactor(0);
        const line2 = this.add.text(cx, cy + 36, '♥', {
            fontFamily: 'sans-serif',
            fontSize: '80px',
            color: '#c2185b',
        }).setOrigin(0.5, 0.5).setDepth(100).setScrollFactor(0);
        line1.setScale(0);
        line2.setScale(0);
        this.tweens.add({
            targets: [line1, line2],
            scale: 1.15,
            duration: 600,
            ease: 'Back.easeOut',
        });
        this.tweens.add({
            targets: [line1, line2],
            scale: 1.05,
            duration: 400,
            delay: 2600,
            yoyo: true,
            repeat: 1,
        });
        this.time.delayedCall(3400, () => {
            bg.destroy();
            line1.destroy();
            line2.destroy();
        });
    }

    showValentineFlashText() {
        this._valentineFlashText = this.add.text(512, 80, 'Will you be my Valentine?', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '38px',
            color: '#f8bbd9',
            align: 'center',
        }).setOrigin(0.5, 0.5).setDepth(110).setScrollFactor(0);
    }

    hideValentineFlashText() {
        if (this._valentineFlashText) {
            this._valentineFlashText.destroy();
            this._valentineFlashText = null;
        }
    }

    showDoubleJumpPopup() {
        this.showingDoubleJumpPopup = true;
        this.physics.pause();
        const cx = 512;
        const cy = 310;
        const popupBg = this.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.theme.bg).setScrollFactor(0);
        const popupScroll = this.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.theme.scroll).setScrollFactor(0);
        const popupText = this.add.text(cx, cy - 60, 'New ability: Double jump!\n\nPress jump again while in the air.\n\nHearts reset your jump — collect one to get your double jump back.', {
            color: 'white', fontSize: 'xx-large', align: 'center',
        }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        const btn = this.add.text(cx, cy + 50, '[OK]', {
            color: 'white', fontSize: 'xx-large',
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll).setScrollFactor(0);
        btn.on('pointerup', () => {
            this.showingDoubleJumpPopup = false;
            this.physics.resume();
            popupBg.destroy();
            popupScroll.destroy();
            popupText.destroy();
            btn.destroy();
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    //                                 Levels                                  //
    /////////////////////////////////////////////////////////////////////////////
    
    buildLevel() { 
        let lvl = parseInt(this.level, 10);
        let LEVEL = LEVELS[lvl]; 
        this.valentineChoiceLevel = !!(LEVEL && LEVEL.valentineChoiceLevel);
        this.player.doubleJumpLevel = !!(LEVEL && LEVEL.doubleJump);

        // World bounds (optional worldMinY for levels that extend upward, e.g. level 2 test)
        const worldW = (LEVEL && typeof LEVEL.worldWidth === 'number') ? LEVEL.worldWidth : 1024;
        const worldMinY = (LEVEL && typeof LEVEL.worldMinY === 'number') ? LEVEL.worldMinY : 0;
        const worldH = worldMinY < 0 ? 768 + Math.abs(worldMinY) : 768;
        this.physics.world.setBounds(0, worldMinY, worldW, worldH, true, true, false, true);
        this.cameras.main.setBounds(0, worldMinY, worldW, worldH);
        if (worldW > 1024) {
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        } else {
            this.cameras.main.stopFollow();
            this.cameras.main.setScroll(0, 0);
        }

        if (!LEVEL || !LEVEL.checkpoints) {
            this.checkpointSpawn = null;
        }
        if (LEVEL && LEVEL.checkpoints && LEVEL.checkpoints.length) {
            const w = 80;
            const h = 60;
            for (let i = 0; i < LEVEL.checkpoints.length; i++) {
                const cp = LEVEL.checkpoints[i];
                const zone = this.add.rectangle(cp.x + w / 2, cp.y - h / 2, w, h);
                this.physics.add.existing(zone, true);
                zone._checkpointIndex = i;
                zone._checkpointX = cp.x;
                zone._checkpointY = cp.y;
                this.physics.add.overlap(this.player, zone, (p, z) => {
                    if (z._checkpointIndex == null) return;
                    const cx = z._checkpointX;
                    const cy = z._checkpointY;
                    const curX = (this.checkpointSpawn && this.checkpointSpawn.x) ?? -1;
                    if (cx > curX) {
                        this.checkpointSpawn = { x: cx, y: cy };
                    }
                    z._checkpointIndex = null;
                });
                this.art.push(zone);
            }
        }
        if (LEVEL && LEVEL.spikes && LEVEL.spikes.length) {
            for (const sp of LEVEL.spikes) {
                const zone = this.add.rectangle(
                    sp.x + sp.width / 2,
                    sp.y + sp.height / 2,
                    sp.width,
                    sp.height
                );
                this.physics.add.existing(zone, true);
                this.physics.add.overlap(this.player, zone, () => {
                    if (this.gameOver || this.tipsShowing) return;
                    this.triggerFallDeath();
                });
                this.art.push(zone);
            }
        }
        if (LEVEL && LEVEL.gravity != null) {
            this.physics.world.gravity.y = LEVEL.gravity;
        } else {
            this.physics.world.gravity.y = 500;
        }
        // Level 4: smaller character; keep zoom 1 so frame aligns (no letterboxing)
        if (LEVEL && LEVEL.playerScale != null) {
            this.player.setScale(LEVEL.playerScale);
            this.cameras.main.setZoom(1);
        } else {
            this.player.setScale(1);
            this.cameras.main.setZoom(1);
        }
        if (lvl === 0) {
            this.tutorial = new TUTORIAL(this, 512, -700);
            if (LEVEL && LEVEL.plats && LEVEL.plats.length) {
                this.platforms.build(LEVEL.plats);
                this.platforms.setTint(this.theme.platforms);
            }
        } else {
            this.platforms.build(LEVEL.plats);  
            this.platforms.setTint(this.theme.platforms);
            // Moving platforms (level 4)
            if (LEVEL.movingPlats && LEVEL.movingPlats.length) {
                for (const mp of this.movingPlats) {
                    if (mp && mp.body) mp.destroy();
                }
                this.movingPlats.length = 0;
                for (const def of LEVEL.movingPlats) {
                    const px = def.fromX != null ? def.fromX : def.x;
                    const py = def.fromY != null ? def.fromY : def.y;
                    const spr = this.add.image(px, py, def.key).setOrigin(0, 0).setDepth(0).setTint(this.theme.platforms);
                    this.physics.add.existing(spr, true);
                    spr.body.setSize(spr.width, spr.height);
                    spr.body.allowGravity = false;
                    spr.body.immovable = true;
                    spr.body.checkCollision.down = false;
                    this.physics.add.collider(this.player, spr);
                    this.physics.add.collider(this.mobs, spr);
                    const dur = (def.duration || 3000) / 2;
                    if (def.fromX != null && def.toX != null) {
                        this.tweens.add({
                            targets: spr,
                            x: def.toX,
                            duration: dur,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                        });
                    } else if (def.fromY != null && def.toY != null) {
                        this.tweens.add({
                            targets: spr,
                            y: def.toY,
                            duration: dur,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                        });
                    }
                    spr._prevX = spr.x;
                    spr._prevY = spr.y;
                    this.movingPlats.push(spr);
                }
            }
        }

        // Level-specific coin placement (e.g. level 3: two hearts only, hard to reach)
        if (LEVEL && LEVEL.coinPositions && LEVEL.coinPositions.length) {
            this.coins.clear(true, true);
            for (const pos of LEVEL.coinPositions) {
                const [x, y] = pos;
                const c = this.coins.create(x, y, 'heart');
                c.setOrigin(0.5, 0.5).setTint(this.theme.coins).setDepth(20);
                c.body.setAllowGravity(false);
                c.body.setImmovable(true);
            }
        }

        if (LEVEL && LEVEL.art) {
            for (let i = 0; i < LEVEL.art.length; i++) {
                let art = LEVEL.art[i];
                let img = this.add.image(art.x, art.y, art.key).setDepth(0).setOrigin(0, 1)
                    .setTint(this.theme.art);
                this.art.push(img);
            }
        }

        const decoLines = ['₊˚⊹♡', ' ‹𝟹 ', '𐙚⋆°｡⋆♡', '⸜(｡˃ ᵕ ˂ )⸝♡', '｡ ₊°༺❤︎༻°₊ ｡'];
        if (LEVEL && LEVEL.deco && LEVEL.deco.length >= decoLines.length) {
            const grey = '#888888';
            const style = { fontSize: '14px', color: grey, fontFamily: 'sans-serif' };
            for (let i = 0; i < decoLines.length; i++) {
                let pos = LEVEL.deco[i];
                let txt = this.add.text(pos.x, pos.y, decoLines[i], style).setDepth(0).setOrigin(0, 0);
                txt._cornerDeco = true;
                this.art.push(txt);
            }
        }

        if (this.valentineChoiceLevel) {
            const L = LEVELS[parseInt(this.level, 10)];
            this.valentineChoiceGraceUntil = this.time.now + 2500;
            if (L && L.spawn) {
                this.player.x = L.spawn.x;
                this.player.y = L.spawn.y;
                this.player.body.setVelocity(0, 0);
            }
            // Arrow at start: points right toward the heart
            if (L && L.spawn) {
                const arrow = this.add.text(L.spawn.x + 120, L.spawn.y - 50, '→ YES', {
                    fontSize: '32px', color: '#c2185b', fontFamily: 'sans-serif',
                }).setDepth(12).setOrigin(0, 0.5);
                this.art.push(arrow);
            }
            // YES zone: only trigger after grace period so player must actually reach the heart
            if (L && L.yesZone) {
                const yz = L.yesZone;
                const w = yz.width || 120;
                const h = yz.height || 100;
                const zone = this.add.rectangle(yz.x + w / 2, yz.y + h / 2, w, h);
                this.physics.add.existing(zone, true);
                this.physics.add.overlap(this.player, zone, () => {
                    if (this.valentineChoiceShown || this.gameOver) return;
                    if (this.time.now < this.valentineChoiceGraceUntil) return;
                    zone.destroy();
                    this.triggerValentineChoice(true);
                });
            }
            // Heart at the end (visual + coin does the same)
            const yesCenter = L && L.yesZone ? L.yesZone.x + (L.yesZone.width || 0) / 2 : 1010;
            const heartY = L && L.yesZone ? L.yesZone.y - 20 : 280;
            const heart = this.add.text(yesCenter, heartY, '♥', {
                fontSize: '64px', color: '#c2185b', fontFamily: 'sans-serif',
            }).setDepth(9).setOrigin(0.5, 0.5);
            this.tweens.add({
                targets: heart,
                scale: { from: 1, to: 1.2 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
            const yesLabel = this.add.text(yesCenter - 70, heartY + 50, 'YES', {
                fontSize: '24px', color: '#c2185b', fontFamily: 'sans-serif',
            }).setDepth(10).setOrigin(0.5, 0);
            this.art.push(heart, yesLabel);
        }
    }

    addMobs(type) {
        let lvl = parseInt(this.level);   
        let mobs = LEVELS[lvl][type];
        if(mobs) {
            let n = mobs.length;
            for(let i = 0; i < n; i++) {
                this.mobs.spawn(...mobs[i]);
            }
        }
    }

    killMobs() {
        if(this.mobs) this.mobs.clear(true, true);
    }

    demoLevel() {
        if(this.tutorial) this.tutorial.destroy(); //doesn't actually destroy, just sets .active to false
        if(this.platforms) this.platforms.clear(true, true);
        if (this.movingPlats && this.movingPlats.length) {
            for (const mp of this.movingPlats) {
                if (mp && mp.body) mp.destroy();
            }
            this.movingPlats.length = 0;
        }
        if(this.art) {
            let n = this.art.length;
            for(let i = 0; i < n; i++) {
                this.art[i].destroy();
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    //                            Tween Timeline                               //
    /////////////////////////////////////////////////////////////////////////////

    // tween scenes
    playTween() {
        let params = [{
            at: 0,
            run: () => {
                this.tweening = true;
                if (!this.devMode && this.asciiRain) {
                    if (this.nextLevelIsValentine) {
                        this.asciiRain.rainUp();
                        this.showValentineFlashText();
                    } else {
                        this.asciiRain.rain();
                    }
                }
            }
        }, {
            at: 1500,
            run: () => {
                const L = LEVELS[parseInt(this.level, 10)];
                if (!this.nextLevelIsValentine && !(L && L.coinPositions)) this.coins.rain();
            }
        }, {
            at: 3000,
            run: () => {
                this.tweening = false;
            }
        }];

        if(this.level == 0) {
            params.push({
                at: 1000,
                tween: {
                    targets: this.tutorial,
                    y: 0, 
                    ease: 'Power0',
                    duration: 2000
                }
            });
        } else {
            this.nextLevelIsValentine = !!(LEVELS[parseInt(this.level)] && LEVELS[parseInt(this.level)].valentineChoiceLevel);
            const LEVEL = LEVELS[parseInt(this.level)];
            const isScrollingLevel = LEVEL && typeof LEVEL.worldWidth === 'number' && LEVEL.worldWidth > 1024;
            const gravityDelay = isScrollingLevel ? 4000 : 3000;
            params.push({
                at: 0,
                run: () => {
                    this.player.setDepth(75);
                    this.player.body.setVelocity(0, 0);
                    this.player.body.setAllowGravity(false);
                    this.killMobs();
                    this.demoLevel();
                    this.buildLevel();
                    this.addMobs("staticMobs");
                    let spawnX = 350;
                    let spawnY = 660;
                    if (this.checkpointSpawn) {
                        spawnX = this.checkpointSpawn.x;
                        spawnY = this.checkpointSpawn.y;
                    } else if (LEVEL && LEVEL.spawn) {
                        spawnX = LEVEL.spawn.x;
                        spawnY = LEVEL.spawn.y;
                    } else {
                        spawnY = Math.min(this.player.y, 660);
                    }
                    this.player.x = spawnX;
                    this.player.y = spawnY - 200;
                    this.time.delayedCall(gravityDelay, () => {
                        if (this.player && this.player.body) {
                            this.player.body.setAllowGravity(true);
                        }
                    });
                }
            }, {
                at: 2500,
                run: () => {
                    this.addMobs("staticMobs");
                }
            }, {
                at: 4000,
                run: () => {
                    this.addMobs("dynamicMobs");
                }
            }, {
                at: 4200,
                run: () => {
                    const lvl = parseInt(this.level, 10);
                    if (lvl === 2 && LEVELS[2] && LEVELS[2].doubleJump) {
                        this.showDoubleJumpPopup();
                    }
                }
            }, {
                at: 5000,
                run: () => {
                    if (this.nextLevelIsValentine) this.hideValentineFlashText();
                }
            });
        }

        const timeline = this.add.timeline(params);
        timeline.play();
    }

    /////////////////////////////////////////////////////////////////////////////
    //                            Loading Screen                               //
    /////////////////////////////////////////////////////////////////////////////
    
    showLoadingScreen() {        
        //src: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/ 
        //I just modified this to center it properly, and
        //didn't include the fileprogress part cuz the event wasn't triggering and game loads fast anyway

        var width = this.cameras.main.width / 2;
        var height = this.cameras.main.height / 2;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width - 160, height - 25, 320, 50); //x, y, w, h

        var loadingText = this.make.text({
            x: width,
            y: height - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width,
            y: height,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            //console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width - 150, height - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        }); 

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }
}