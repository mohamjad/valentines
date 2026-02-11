export default class ASCIIRAIN extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.bg = scene.physics.add.image(0, 0, 'rainBG').setOrigin(0, 1);
        this.bg.setTint(scene.theme.bg).setDepth(1);
        let dropWidth = 16.2;   
        let numDrops = 1024 / dropWidth;
        this.rainUpActive = false;
        for(let i = 0; i < numDrops; i++) {
            let x = i * dropWidth;
            let drop = scene.physics.add.sprite(x, 0, 'asciiRain');
            drop.setDepth(50);  
            drop.setTint(scene.theme.rain)
            drop.disableBody(true, true); 
            this.add(drop);
        } 
    }

    rain() {
        this.rainUpActive = false;
        this.bg.enableBody(true, 0, 0, true, true).setTint(this.scene.theme.bg);
        this.children.iterate((child) => {
            child.enableBody(true, child.x, Phaser.Math.Between(-750, -1000), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-150, 300));    
            child.setFrame(Phaser.Math.Between(0, 4));
            child.setTint(this.scene.theme.rain);
        }); 
    }

    rainUp() {
        this.rainUpActive = true;
        this.bg.disableBody(true, true);
        const threatTint = 0x556666;
        this.children.iterate((child) => {
            child.enableBody(true, child.x, Phaser.Math.Between(720, 820), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-160, -100));
            child.setVelocityX(0);
            child.setFrame(Phaser.Math.Between(0, 4));
            child.setTint(threatTint);
            child.setAlpha(0.92);
            child.setDepth(45);
        });
    }

    rainUpWrap() {
        this.children.iterate((child) => {
            if (child.body && child.body.enable && child.y < -100) {
                child.y = Phaser.Math.Between(750, 820);
                child.body.velocity.y = Phaser.Math.FloatBetween(-160, -100);
            }
        });
    }

    changeTint() {
        this.setTint(this.scene.theme.rain);
        this.bg.setTint(this.scene.theme.bg);
    }
}