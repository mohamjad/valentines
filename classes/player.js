export default class PLAYER extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); //calls constructor of the class being extended
        
        this.scene.add.existing(this); //so this will show up in the scene
        this.scene.physics.add.existing(this);
        this.setInteractive();
        this.setBounce(0.25);
        this.setDepth(25); //z-index
        this.setTint(scene.theme.player);
        this.createAnims();

        //  Input Events
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,S,A,D,SPACE');
        scene.input.addPointer(1); //for multi-touch
        this.touchY = 0;
        this.click = 0; //duration of last click
        this.jumpsUsed = 0;       // 0 = 2 jumps left (ground + 1 air), 1 = 1 air left, 2 = none
        this.doubleJumpLevel = false;
        this._rechargeGraceFrames = 0; // after coin recharge, don't reset jumpsUsed for N frames
    }

    createAnims() {
        //  Player animations, turning, walking left and walking right.    
        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'dance',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: -1
        });        

        this.scene.anims.create({
            key: 'jump',
            frames: [ { key: 'dude', frame: 11 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.scene.anims.create({
            key: 'jumpRight',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.scene.anims.create({
            key: 'jumpLeft',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'stomp',
            frames: [ { key: 'dude', frame: 12 } ],
            frameRate: 20,
            repeat: -1
        });
    }

    playAnims(dir, jump, stomp, touch) {
        if(dir === 'left') {
            this.setVelocityX(-260);
            if(jump) {
                this.anims.play('jumpLeft', true);
            } else {
                this.anims.play('left', true);
            }
        } else if(dir === 'right') {
            this.setVelocityX(260);
            if(jump) {
                this.anims.play('jumpRight', true);
            } else {
                this.anims.play('right', true);
            }
        } else {
            this.setVelocityX(0);
            if(jump) {                
                this.anims.play('jump');
            } else if(stomp) {
                this.anims.play('stomp');
                this.setVelocityY(330);
            } else {
                this.anims.play('turn');
            }
        }        
    
        // Only reset to "full jumps" when clearly on ground (not rising). Avoids spurious reset when leaving a platform.
        if (this._rechargeGraceFrames > 0) this._rechargeGraceFrames--;
        const onGround = this.body.touching.down && this.body.velocity.y >= -80;
        if (onGround && this._rechargeGraceFrames === 0) {
            this.jumpsUsed = 0;
        }
        if (jump) {
            const jumpPressed = touch || Phaser.Input.Keyboard.JustDown(this.cursors.up)
                || Phaser.Input.Keyboard.JustDown(this.wasd.W)
                || Phaser.Input.Keyboard.JustDown(this.wasd.SPACE);
            if (this.body.touching.down && jumpPressed) {
                this.setVelocityY(-400);
                this.jumpsUsed = 1;
            } else if (this.doubleJumpLevel && !this.body.touching.down && jumpPressed && this.jumpsUsed < 2) {
                this.setVelocityY(-380);
                this.jumpsUsed++;
            }
        }
    }

    //based on user input
    move() {
        let touch = false; //track whether input is keyboard or touch

        let dirPointer = this.scene.input.pointer1;
        let jumpPointer = this.scene.input.pointer2;
    
        let jump = touch = jumpPointer.isDown ? true : false;
        let stomp = false;
        let dir;
    
        //touch controls
        if(dirPointer.isDown) {
            let x = dirPointer.position.x;
            let y = dirPointer.position.y;
            if(this.scene.touchY === 0) {
                this.scene.touchY = y;
            } else if(y > this.scene.touchY + 50) {                
                stomp = true;
                //console.log('touchY: ' + this.touchY);
            } else {
                if(x > 400) {
                    dir = 'right';
                } else {            
                    dir = 'left';
                }
            }
        } else {            
            this.scene.touchY = 0;
            dir = false;
            let dur = dirPointer.getDuration();
            if((this.click !== dur) && (dur > 0) && (dur < 150)) {
                //if dirPointer isn't down and screen is tapped, jump
                jump = touch = true;
                this.click = dur; //to disable autojumping
            }
        }

        //keyboard controls
        if(this.cursors.left.isDown || this.wasd.A.isDown) {
            dir = 'left';
        } else if(this.cursors.right.isDown || this.wasd.D.isDown) {
            dir = 'right';
        }

        if(this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) {
            jump = true;
            touch = false;
        } else if(this.cursors.down.isDown || this.wasd.S.isDown) {
            stomp = true;
        }
    
        this.playAnims(dir, jump, stomp, touch);
    }
}