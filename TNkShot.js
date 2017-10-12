TNkShot = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        this.A = new Sprite(320,320);
        this._setupSprite(this.A);
        this.A.image.context.fillText("Shot !",0,0);
        this.A.x = -300;
        this.A.y =  110;
        this.addChild(this.A);
        this.B = new Sprite(320,320);
        this._setupSprite(this.B);
        this.B.image.context.strokeText("Shot !",0,0);
        this.B.x =  300;
        this.B.y = -110;
        this.addChild(this.B);
        this.addEventListener(TNkShot.SHOT_END, this.dispatch);
    },
    _setupSprite : function(sprite) {
        sprite.image = new Surface(320, 320);
        sprite.image.context.translate(160, 160);
        sprite.image.context.rotate(-20 * Math.PI / 180);
        sprite.image.context.translate(0, 0);
        sprite.image.context.textAlign = "center";
        sprite.image.context.textBaseline = "middle";
        sprite.image.context.font = "72px 'Audiowide'";
    },
    setup : function() {
        this.A.x = -300;
        this.A.y =  110;
        this.B.x =  300;
        this.B.y = -110;
        this.A.tl.
            moveBy(300,-110,10,enchant.Easing.QUINT_EASEOUT).
            moveBy(300,-110,10,enchant.Easing.QUINT_EASEIN);
        this.B.tl.
            moveBy(-300,110,10,enchant.Easing.QUINT_EASEOUT).
            moveBy(-300,110,10,enchant.Easing.QUINT_EASEIN).
            then(function() {
                this.parentNode.dispatchEvent(new Event(TNkShot.SHOT_END));
            });
    },
    dispatch : function() {
        this.parentNode.dispatchEvent(new Event(TNkShot.SHOT_END));
    }
});
TNkShot.SHOT_END = "shot_end";
