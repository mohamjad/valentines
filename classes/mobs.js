export default class MOBS extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this); 
    }

    spawn(x, y, key, dir) {
        let mob = this.create(x, y, key).setTint(this.scene.theme.mobs);
        mob.key = key;
        if(key === 'bomb') {
            mob.setBounce(1);
        } else {
            mob.setBounce(0.2);
        }
        
        switch(key) {
            case "mob0":
                mob.setMass(1);
                mob.tip = `Don't step on this!
That thorn will get you.`;
                mob.fine = 5;
                mob.button = `BUY ANTIDOTE`;
            break;
            case "bouncer":
                mob.setBounce(0.85);
                mob.setVelocity(0, -220);
                mob.setCollideWorldBounds(false);
                mob.tip = `Don't step on this!
That thorn will get you.`;
                mob.fine = 5;
                mob.button = `BUY ANTIDOTE`;
            break;
            case "mob1":
                let x = (dir === 'right') ? 75 : -75;
                mob.setVelocity(x, 0);
                mob.setMass(20);
                mob.tip = `This one is dangerous —
stay out of its way!`;
                mob.fine = 10;
                mob.button = `PAY FINE`;
            break;
            case "bomb":
                mob.setCollideWorldBounds(true);
                mob.setVelocity(-100, 50);
                mob.tip = `Spiky bomb!
Don't touch — it'll get you.`;
                mob.fine = 15;
                mob.button = `RESURRECT`;
            break;
            default: break;
        }
    }
}