export default class TIPS {
    constructor(scene) {  
        this.scene = scene;

        scene.input.keyboard.on('keydown-ENTER', () => {
            if(this.scene.tipsShowing) {
                this.payFine();
            }
        });
    }

    showTips(mob) {
        if (!mob || !mob.key) return;
        this.mob = mob;
        this.scene.tipsShowing = true;
        this.tips = [];
        const cx = 512, cy = 384;
        this.tips.push(this.scene.add.image(cx, cy, 'scrollBG').setDepth(97).setTint(this.scene.theme.bg).setScrollFactor(0));
        this.tips.push(this.scene.add.image(cx, cy, 'scroll').setDepth(98).setTint(this.scene.theme.scroll).setScrollFactor(0));

        this.tips.push(this.scene.add.image(cx - 12, cy - 134, mob.key).setDepth(99).setTint(this.scene.theme.scroll).setOrigin(0.5, 0.5).setScrollFactor(0));
        this.tips.push(this.scene.add.text(cx, cy - 59, mob.tip || 'Ouch!', {
            color: 'white', fontSize: 'xx-large', align: 'center',
        }).setDepth(99).setTint(this.scene.theme.scroll).setOrigin(0.5, 0.5).setScrollFactor(0));

        const payBtn = this.scene.add.text(cx, cy + 36, `[${mob.button || 'Continue'}]`, {
            color: 'white', fontSize: 'xx-large',
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.scene.theme.scroll).setScrollFactor(0);
        payBtn.on('pointerup', () => {
            this.payFine();
        });
        this.tips.push(payBtn);
    }

    hideTips() {
        if (Array.isArray(this.tips)) {
            this.tips.forEach((t) => t.destroy());
            this.tips = [];
        }
        this.scene.physics.resume();
        this.scene.tipsShowing = false;
        if (this.mob && this.mob.scene) this.mob.destroy();
        this.mob = null;
        if (this.scene.checkpointSpawn && this.scene.player) {
            const cp = this.scene.checkpointSpawn;
            this.scene.player.x = cp.x;
            this.scene.player.y = cp.y;
            this.scene.player.body.setVelocity(0, 0);
            this.scene.player.anims.play('turn');
        }
    }

    payFine() {
        const fine = (this.mob && typeof this.mob.fine === 'number') ? this.mob.fine : 5;
        this.scene.ui.updateScore(this.scene.score - fine);
    }
}