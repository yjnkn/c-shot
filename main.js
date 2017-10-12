enchant();

window.onload = function(){
    var game = new Core(320, 320);
    game.preload(JSON_PNG1,JSON_PNG2,JSON_PNG3,JSON_PNG4,JSON_PNG5,JSON_PNG6);
    game.fps = 30;
    game.onload = function(){
        makeChip(32);
        var title = new TNkTitle();
        var shot = new TNkScene();
        title.next = shot;
        shot.next = title;
        game.replaceScene(title);
    };
    game.start();
};

