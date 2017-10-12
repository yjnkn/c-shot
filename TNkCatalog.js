TNkLine = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        this.name = new Label('');
        this.name.font = "20px 'Audiowide'";
        this.addChild(this.name);
        this.picts = [];
        this.touchNum = -1;
        this.addEventListener(TNkLine.TOUCHED, function() {
            this.parentNode.dispatchEvent(new Event(TNkLine.TOUCHED));
        });
    },
    addPict : function(data) {
        var pict = new Sprite(48, 48);
        pict.image = new Surface(96, 48);
        pict.image.draw(enchant.Core.instance.assets[data.canvas],
                        0,0,320,320,2,2,44,44);
        pict.image.draw(enchant.Core.instance.assets[data.canvas],
                        0,0,320,320,48,0,48,48);

//        pict.image.context.fillStyle = data.canvas;
//        pict.image.context.fillRect(2,2,44,44);
//        pict.image.context.fillRect(48,0,48,48);
        pict.num = this.picts.length;
        pict.ontouchstart = function() {
            this.frame = 1;
            this.parentNode.touchNum = pict.num;
            this.parentNode.dispatchEvent(new Event(TNkLine.TOUCHED));
        };
        pict.ontouchend = function() {
            this.frame = 0;
        };
        pict.info = data;
        pict.x = 52 * this.picts.length;
        pict.y = 20;
        this.addChild(pict);
        this.picts.push(pict);
    },
    getPict : function(index) {
        if (this.picts.length <= index) return undefined;
        return this.picts[index].info;
    }
});
TNkLine.TOUCHED = "touched";

TNkCatalog = enchant.Class.create(enchant.Group, {
    initialize : function() {
        enchant.Group.call(this);
        this.lines = [];
        this.touchLine = [];
        this.addEventListener(TNkLine.TOUCHED, function() {
            var length = this.lines.length;
            for (var i = 0; i < length; i++) {
                if (this.lines[i].touchNum !== -1) {
                	this.touchLine = {line:i, num:this.lines[i].touchNum};
                    break;
                }
            }
            this.parentNode.dispatchEvent(new Event(TNkLine.TOUCHED));
        });
        this.rBtn = new TNkButton("return");
        this.rBtn.x = 200;
        this.rBtn.y = 260;
        this.addChild(this.rBtn);
    },
    setup : function() {
        this.touchLine = [];
        var length = this.lines.length;
        for (var i = 0; i < length; i++) this.lines[i].touchNum = -1;
    },
    addLine : function(data) {
        var line = new TNkLine();
        line.x = 32;
        line.y = this.lines.length * 80 + 8;
        line.name.text = data.name;
        var catalog = data.catalog;
        var length = catalog.length;
        for (var i = 0; i < length; i++) {
            var pict = catalog[i];
            line.addPict(pict);
        }
        this.lines.push(line);
        this.addChild(line);
    },
    load : function(data) {
        var length = data.length;
        for (var i = 0; i < length; i++) this.addLine(data[i]);
    },
    
});
