TNkButton = enchant.Class.create(enchant.Sprite, {
    initialize : function(text) {
        enchant.Sprite.call(this, 96, 48);
        this.image = new Surface(192, 48);
        this.image.context.textAlign = "center";
        this.image.context.textBaseline = "middle";
        this.image.context.font = "16px sans-serif";
        // 通常ボタンを描画
        this.drawButton(text);
        // 押下状態のボタンを描画
        this.image.context.translate(96, 0);
        this.image.context.strokeStyle = "rgb(255,255,102)";
        this.image.context.fillStyle = "rgb(255,255,102)";
        this.drawButton(text);
        
        this.addEventListener(Event.TOUCH_START, this.onTouched);
        this.addEventListener(Event.TOUCH_END, this.onTouched);
    },
    drawButton : function(text) {
        this.image.context.fillText(text, 48, 24);
        this.image.context.beginPath();
        this.image.context.moveTo(2,24);
        this.image.context.quadraticCurveTo(2, 2, 24, 2);
        this.image.context.lineTo(74 ,2);
        this.image.context.quadraticCurveTo(94, 2, 94, 24);
        this.image.context.quadraticCurveTo(94, 46, 74, 46);
        this.image.context.lineTo(24 ,46);
        this.image.context.quadraticCurveTo(2, 46, 2, 24);
        this.image.context.closePath();
        this.image.context.stroke();
    },
    onTouched : function() {
        this.frame = this.frame === 0 ? 1 : 0;
    }
});
