TNkFaild = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        this.A = new Sprite(320,320);
        this.A.image = new Surface(320,320);
        this.A.image.context.textAlign = "center";
        this.A.image.context.textBaseline = "middle";
        this.A.image.context.font = "64px 'Audiowide'";
        this.A.image.context.fillText("Faild...",160,160);
        this.A.y = -320;
        this.addChild(this.A);
        
        this.card = Group();
        this.addChild(this.card);
        
        this.B = new Sprite(320,320);
        this.B.image = new Surface(320,320);
        this.B.image.context.translate(160, 160);
        this.B.image.context.translate(0, 0);
        this.B.image.context.textAlign = "center";
        this.B.image.context.textBaseline = "middle";
        this.B.image.context.font = "48px 'Audiowide'";
        this.B.image.context.fillText("continue?",0,0);
        this.card.addChild(this.B);
        
        this.r = new TNkButton("retry");
        this.r.x = 48;
        this.r.y = 200;
        this.r.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.parentNode.dispatchEvent(new Event(TNkFaild.RETRY));
        });
        this.card.addChild(this.r);
        this.e = new TNkButton("exit");
        this.e.x = 160 + 16;
        this.e.y = 200;
        this.e.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.parentNode.dispatchEvent(new Event(TNkFaild.EXIT));
        });
        this.card.addChild(this.e);
    	this.rear();
        
        this.addEventListener(TNkFaild.FAILD_END, this.addMenu);
    },
    setup : function() {
        this.A.tl.
            moveBy(0,320,25,enchant.Easing.ELASTIC_EASEOUT).
            moveBy(0,320,10,enchant.Easing.QUINT_EASEIN).
            then(function() {
                this.parentNode.dispatchEvent(new Event(TNkFaild.FAILD_END));
            });
    },
    addMenu : function() {
        this.addChild(this.card);
        this.B.tl.fadeIn(20);
        this.r.tl.fadeIn(20);
        this.e.tl.fadeIn(20);
    },
	rear : function() {
        this.A.y = -320;
        this.B.opacity = 0.0;
        this.r.opacity = 0.0;
        this.e.opacity = 0.0;
        this.removeChild(this.card);
	},
    dispatch : function() {
        this.parentNode.dispatchEvent(new Event(TNkFaild.FAILD_END));
    }
});
TNkFaild.FAILD_END = "faild_end";
TNkFaild.RETRY = "game_retry";
TNkFaild.EXIT = "game_exit";
