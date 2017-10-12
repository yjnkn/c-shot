TNkBoard = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        this.A = new Group();
        this.addChild(this.A);
        var label = new Label("you're score");
        label.font = "20px 'Audiowide'";
        label.textAlign = "center";
        label.y = 160 - 48;
        this.A.addChild(label);
        this.score = new TNkScore(6, 32);
        this.score.x = 64;
        this.score.y = 160 - 16;
        this.A.addChild(this.score);
        this.A.addEventListener(TNkScoreChip.COUNT_UP, function() {
            this.addEventListener(Event.TOUCH_START, function() {
                this.removeEventListener(Event.TOUCH_START, arguments.callee);
                this.parentNode.dispatchEvent(new Event(TNkScoreChip.COUNT_UP));
            });
        });
        this.addEventListener(TNkScoreChip.COUNT_UP, this.addMenu);

        this.card = Group();
        this.addChild(this.card);
        
        this.B = new Sprite(320,320);
        this.B.image = new Surface(320,320);
        this.B.image.context.translate(160, 160);
        this.B.image.context.translate(0, 0);
        this.B.image.context.textAlign = "center";
        this.B.image.context.textBaseline = "middle";
        this.B.image.context.font = "48px 'Audiowide'";
        this.B.image.context.fillText("next game?",0,0);
        this.card.addChild(this.B);
        
        this.r = new TNkButton("retry");
        this.r.x = 48;
        this.r.y = 200;
        this.r.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.parentNode.dispatchEvent(new Event(TNkFaild.RETRY));
        });
        this.card.addChild(this.r);
        this.e = new TNkButton("next");
        this.e.x = 160 + 16;
        this.e.y = 200;
        this.e.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.parentNode.dispatchEvent(new Event(TNkFaild.EXIT));
        });
        this.card.addChild(this.e);
        this.rear();
    },
    addMenu : function() {
        this.A.y = -320;
        this.addChild(this.card);
        this.B.tl.fadeIn(20);
        this.r.tl.fadeIn(20);
        this.e.tl.fadeIn(20);
    },
    rear : function() {
        this.A.y = 0;
        this.B.opacity = 0.0;
        this.r.opacity = 0.0;
        this.e.opacity = 0.0;
        this.removeChild(this.card);
    },
});

TNkScore = enchant.Class.create(enchant.Group, {
    initialize : function(digit, size) {
        enchant.Group.call(this);
        for (var i = 0; i < digit; i++) {
            var num = new TNkScoreChip(size);
            num.x = i * (size - ~~(size / 10));
            this.addChild(num);
        }
        this.value = undefined;
        this.child = -1;
        this.index = -1;
        this.addEventListener(TNkScoreChip.COUNT_UP, this._add);
    },
    _add : function() {
        if (this.index < 0) {
            this.parentNode.dispatchEvent(new Event(TNkScore.COUNT_UP));
            return;
        }
        var num = this.value[this.index--] * 1;
        this.childNodes[this.child--].add(num);
    },
    add : function(value) {
        this.value = String(value);
        this.child = this.childNodes.length - 1;
        this.index = this.value.length - 1;
        this._add();
    },
    score : function() {
        var score = "";
        var length = this.childNodes.length;
        for (var i = 0; i < length; i++) {
            score += this.childNodes[i].frame;
        }
        return score;
    }
});
TNkScore.COUNT_UP = "count_up";
TNkScoreChip = enchant.Class.create(enchant.Sprite, {
    initialize : function(size) {
        enchant.Sprite.call(this, size - ~~(size / 10), size);
        this.image = enchant.Core.instance.assets[SCORE_CHIP];
    },
    add : function(value) {
        this.sign = value < 0 ? -1 : 1;
        this.next = Math.abs(value);
        if (1 !== String(this.next).length) return;
        this.addEventListener(Event.ENTER_FRAME, this._add);
    },
    _add : function() {
        this.frame = this.frame + this.sign < 0 ? 9 :
                     9 < this.frame + this.sign ? 0 :
                     this.frame + this.sign;
        if (this.frame === this.next) {
            this.removeEventListener(Event.ENTER_FRAME, this._add);
            this.parentNode.dispatchEvent(new Event(TNkScoreChip.COUNT_UP));
        }
    }
});
TNkScoreChip.COUNT_UP = "count_up";
var makeChip = function(size) {
    var width = size - ~~(size / 10);
    var chip = new Surface(width * 10, size);
    chip.context.textAlign = 'center';
    chip.context.textBaseline = 'middle';
    chip.context.font = size + "px 'Audiowide'";
    for (var i = 0; i < 10; i++) {
        chip.context.fillText(i, width * i + width / 2, size / 2);
    }
    enchant.Core.instance.assets[SCORE_CHIP] = chip;
};
SCORE_CHIP = "score_chip";
