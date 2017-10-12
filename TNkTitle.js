TNkTitle = enchant.Class.create(enchant.Scene, {
    initialize : function() {
        enchant.Scene.call(this);
        this.list = [];
        this.index = 0;
        
        var menu = new TNkMenu();
        menu.originX = menu.originY = 320;
        menu.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.dispatchEvent(new Event(TNkTitle.TURN_LIST));
        });
        this.list.push(menu);
        this.addChild(menu);
        
        var camera = new TNkCatalog();
        camera.load(json);
        camera.originX = camera.originY = 320;
        camera.scaleX = 0;
        camera.rBtn.addEventListener(Event.TOUCH_START, function() {
            this.parentNode.parentNode.dispatchEvent(new Event(TNkTitle.TURN_LIST));
        });
        this.list.push(camera);
        this.addChild(camera);
        
        this.addEventListener(TNkTitle.TURN_LIST, this.touched);
        this.addEventListener(TNkLine.TOUCHED, function() {
        	var index = camera.touchLine;
        	var info = camera.lines[index.line].picts[index.num].info;
            this.next.setup(info);
            this.tl.delay(30).then(function() {
                enchant.Core.instance.replaceScene(this.next);
            });
        });
    },
    touched : function() {
        var next = this.index + 1 < this.list.length ? this.index + 1 : 0;
        this.removeChild(this.list[this.index]);
        this.insertBefore(this.list[this.index], this.list[next]);
        this.list[this.index].tl.scaleTo(0.0,1,10);
        this.list[next].tl.scaleTo(1.0,1,10);
        this.index = next;
    }
});
TNkTitle.TURN_LIST = "turn_list";

TNkMenu = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        
        // タイトル画像
        // タイトル
        this.B = new Sprite(320,320);
        this.B.image = new Surface(320,320);
        this.B.image.context.translate(160, 160);
        this.B.image.context.translate(0, 0);
        this.B.image.context.textAlign = "center";
        this.B.image.context.textBaseline = "middle";
        this.B.image.context.font = "44px 'Audiowide'";
        this.B.image.context.fillText("Circle Shot!",0,-16);
        this.addChild(this.B);
        
    }
});
