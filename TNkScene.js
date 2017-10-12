TNkScene = enchant.Class.create(enchant.Scene, {
    initialize : function() {
        enchant.Scene.call(this);
        
        this.canvas = new TNkCanvas();
        this.addChild(this.canvas);
        
        this.cover = new TNkCover();
        this.addChild(this.cover);
        
        this.effect = new Sprite(320, 320);
        this.effect.image = new Surface(320, 320);
        this.effect.image.context.strokeStyle = "yellow";//"rgba(0,0,0,0)";
        this.effect.image.context.shadowBlur = 3;
        this.effect.image.context.shadowColor = "yellow";
        this.effect.drawRing = function(r, x, y) {
            this.scaleX = this.scaleY = 1;
            this.opacity = 1.0;
            this.originX = x;
            this.originY = y;
            this.image.context.clearRect(0,0,320,320);
            this.image.context.beginPath();
            this.image.context.arc(x, y, r, 0, Math.PI*2, false);
            this.image.context.stroke();
            this.tl.scaleTo(1.5,1.5,5).and().fadeOut(5).then(function() {
                this.parentNode.dispatchEvent(new Event("ring_end"));
            });
        };
        this.addChild(this.effect);
        
        this.gameUI = new TNkGameUI();
        this.addChild(this.gameUI);
        
        this.ui_ctrl = false;
        
        this.faild = new TNkFaild();
        this.shot = new TNkShot();
        this.board = new TNkBoard();
        this.count = 0;
        
        this.addEventListener(TNkGameUI.DRILL, this.drilled);
        this.addEventListener(TNkGameUI.SHOT, this.shoted);
        this.addEventListener(TNkCover.INTRO_END, this.intro);
        this.addEventListener("ring_end", this._drilled);
        this.addEventListener(TNkFaild.RETRY, this.resetup);
        this.addEventListener(TNkFaild.EXIT, this.exitAct);
        this.addEventListener(TNkShot.SHOT_END, this.hited);
        
    },
    setup : function(data) {
        this.canvas.setup(
            enchant.Core.instance.assets[data.canvas],
            enchant.Core.instance.assets[data.hitmap],
            enchant.Core.instance.assets[data.notmap]
            );
        this.resetup();
    },
    resetup : function() {
        if (this.board.parentNode === this) this.removeChild(this.board);
        if (this.faild.parentNode === this) this.removeChild(this.faild);
        this.board.rear();
        this.faild.rear();
        this.cover.setup();
        this.cover.intro();
        this.gameUI.y = 0;
        this.count = 0;
    },
	exitAct : function() {
        if (this.board.parentNode === this) this.removeChild(this.board);
        if (this.faild.parentNode === this) this.removeChild(this.faild);
		enchant.Core.instance.replaceScene(this.next);
	},
    drilled : function() {
        if (!this.ui_ctrl) return;
        this.ui_ctrl = false;
        // 切り抜き座標と半径を取得
        var p = this.gameUI.getTarget();
        // 切り抜き処理
        this.cover.drill(p.r, p.x, p.y);
        this.effect.drawRing(p.r, p.x, p.y);
        this.count++;
    },
    _drilled : function() {
        // NG領域の抵触判定
        if (this.canvas.isOver(this.cover.image)) {
            // コントロール切り離し
            this.gameUI.y = 320;
            this.faild.setup();
            this.addChild(this.faild);
        } else {
            this.ui_ctrl = true;
        }
    },
    shoted : function() {
        if (!this.ui_ctrl) return;
        // コントロール切り離し
        this.ui_ctrl = false;
        this.gameUI.y = 320;
        // エフェクト
        this.shot.setup();
        this.addChild(this.shot);
    },
    intro : function() {
        this.ui_ctrl = true;
    },
    hited : function() {
        this.removeChild(this.shot);
        var score = ~~((this.canvas.getScore(this.cover.image) * 10000));
        score += ~~(score / this.count);
        this.addChild(this.board);
        this.board.score.add(score);
        console.log(score, this.count);
    }
});

TNkGameUI = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        // パッド
        this.pad = new TNkPad();
        this.pad.isTap = false;
        this.pad.addEventListener(Event.TOUCH_START, function() {
            this.isTap = true;
        });
        this.pad.addEventListener(Event.TOUCH_MOVE, function() {
            this.isTap = false;
        });
        this.pad.addEventListener(Event.TOUCH_END, function(e) {
            if (this.isTap && this.cx === e.x && this.cy === e.y) {
                this.parentNode.parentNode.dispatchEvent(new Event(TNkGameUI.DRILL));
            }
            this.isTap = false;
        });
        this.addChild(this.pad);
        // ボタン類
        // シャッター
        this.shot = new TNkButton("shot");
        this.shot.x = 160 - 48;
        this.shot.y = 320 - 48;
        this.shot.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.dispatchEvent(new Event(TNkGameUI.SHOT));
        });
        this.addChild(this.shot);
        // 拡大
        this.zoomOut = new TNkButton("zoom out");
        this.zoomOut.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.pad.radius(TNkPad.RADIUS_OUT);
        });
        this.zoomOut.x = 40;
        this.zoomOut.y = 0;
        this.addChild(this.zoomOut);
        // 縮小
        this.zoomIn = new TNkButton("zoom in");
        this.zoomIn.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.pad.radius(TNkPad.RADIUS_IN);
        });
        this.zoomIn.x = 320 - 96 - 40;
        this.zoomIn.y = 0;
        this.addChild(this.zoomIn);
    },
    getTarget : function() {
        return {r:this.pad.radius(), x:this.pad.cx, y:this.pad.cy};
    }
});
TNkGameUI.DRILL = "drilled";
TNkGameUI.SHOT  = "shot";

TNkPad = enchant.Class.create(enchant.Sprite, {
    initialize : function() {
        enchant.Sprite.call(this, 320, 320);
        this.image = new Surface(320, 320);
        this.radiusArray = [32, 48, 64, 96, 128];
        this.radiusIndex = 0;
        this.cx = -160;
        this.cy = -160;
        this.isTap = false;
        this.addEventListener(Event.TOUCH_START, this.drawCircle);
        this.addEventListener(Event.TOUCH_MOVE, this.drawCircle);
        this.addEventListener(Event.TOUCH_END, this.drawCircle);
    },
    radius : function(cmd) {
        switch (cmd) {
            case TNkPad.RADIUS_IN :
                this.radiusIndex = this.radiusIndex < this.radiusArray.length ? this.radiusIndex + 1 : this.radiusIndex;
                this.drawCircle({x:this.cx, y:this.cy});
                break;
            case TNkPad.RADIUS_OUT :
                this.radiusIndex = 0 < this.radiusIndex ? this.radiusIndex - 1 : this.radiusIndex;
                this.drawCircle({x:this.cx, y:this.cy});
                break;
            default:
        }
        return this.radiusArray[this.radiusIndex];
    },
    center : function() {
        return {x:this.cx, y:this.cy};
    },
    drawCircle : function(e) {
        if (this.isTap) return;
        this.image.context.clearRect(0, 0, 320, 320);
        this.image.context.beginPath();
        this.image.context.arc(e.x, e.y, this.radius(), 0, Math.PI * 2, false);
		this.image.context.stroke();
        this.cx = e.x;
        this.cy = e.y;
    }
});
TNkPad.RADIUS_IN  = "radius_in";
TNkPad.RADIUS_OUT = "darius_out";

TNkCover = enchant.Class.create(enchant.Sprite, {
    initialize : function() {
        enchant.Sprite.call(this, 320, 320);
        this.image = new Surface(320, 320);
        this.alpha = new Surface(320, 320);
    },
    setup : function() {
        this.image.context.fillStyle = "gray";
        this.image.context.fillRect(0, 0, 320, 320);
    },
    drill : function(r, x, y) {
        this.alpha.context.fillStyle = "white";
        this.alpha.context.fillRect(0, 0, 320, 320);
        this.alpha.context.fillStyle = "black";
        this.alpha.context.beginPath();
        this.alpha.context.arc(x, y, r, 0, Math.PI * 2, false);
        this.alpha.context.fill();
        this._drill();
    },
    _drill : function() {
        var data = this.image.context.getImageData(0, 0, 320, 320);
        var mask = this.alpha.context.getImageData(0, 0, 320, 320);
        var length = mask.data.length;
        for (var i = 0; i < length; i += 4) {
            if (data.data[i+3] > mask.data[i]) data.data[i+3] = mask.data[i];
        }
        this.image.context.putImageData(data, 0, 0);
    },
    intro : function() {
        this.opacity = 0.0;
        this.tl.fadeIn(30).then(function() {
            this.parentNode.dispatchEvent(new Event(TNkCover.INTRO_END));
        });
    }
});
TNkCover.INTRO_END = "intro_end";

TNkCanvas = enchant.Class.create(enchant.Sprite, {
    initialize : function() {
        enchant.Sprite.call(this, 320, 320);
        this.image = new Surface(320, 320);
        this.score = new Surface(320, 320);
        this.minus = new Surface(320, 320);
    },
    setup : function(img, scr, mns) {
        this.image.draw(img);
        this.score.draw(scr);
        this.minus.draw(mns);
    },
    isOver : function(test) {
        var data = this.minus.context.getImageData(0, 0, 320, 320);
        var mask = test.context.getImageData(0, 0, 320, 320);
        var length = mask.data.length;
        for (var i = 0; i < length; i += 4) {
            if (data.data[i] === 0 && mask.data[i+3] === 0) return true;
        }
        return false;
    },
    getScore : function(cover) {
        var count = 0;
        var total = 0;
        var data = this.score.context.getImageData(0, 0, 320, 320);
        var mask = cover.context.getImageData(0, 0, 320, 320);
        var length = mask.data.length;
        for (var i = 0; i < length; i += 4) {
            if (data.data[i] === 0 && mask.data[i+3] === 0) count += 1;
            if (data.data[i] === 0) total += 1;
        }
        console.log(count , total);
        return count / total;
    }
});
