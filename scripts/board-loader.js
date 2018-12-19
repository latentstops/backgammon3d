(function(){

    var BoardLoader = function(){

        this.init.apply(this, arguments);

    };

    BoardLoader.prototype.initProperties = function() {

        this.loader = null;
        this.config = null;

    };

    BoardLoader.prototype.init = function(config){

        this.initProperties();

        this.config = config;

        this.loader = new THREE.ObjectLoader();

    };

    BoardLoader.prototype.loadAll = function(callback){

            var self = this;

            this.loadBoard( function (boardScene){

                    self.loadChecker( function (checkerScene){

                            var checkerName = self.config.checker.name;

                            var checker = checkerScene.getObjectByName(checkerName);

                            //checker.geometry.rotateX(-Math.PI / 2);

                            boardScene.add(checker);

                            self.loadDice( function (diceScene){

                                    var diceName = self.config.dice.name;

                                    var dice = diceScene.getObjectByName(diceName);

                                    boardScene.add(dice);


                                    self.loadDiceAnimations(function (animations) {

                                            if(callback) callback(boardScene, animations);

                                    });

                            });

                    });

            })

    };

    BoardLoader.prototype.xhrGet = function (url, success, error) {

        var loadingManager = new THREE.LoadingManager();

        var xhr = new THREE.XHRLoader(loadingManager);

        xhr.load(url, success, error);

    };

    BoardLoader.prototype.loadBoard = function(callback){

        var boardPath = this.config.board.objectPath;

        var texturesPath = this.config.board.texturesPath;

        var loader = this.loader;

            loader.setTexturePath(texturesPath);

            loader.load(boardPath, callback);

    };

    BoardLoader.prototype.loadChecker = function(callback){

        var checkerPath = this.config.checker.objectPath;

        var texturesPath = this.config.checker.texturesPath;

        var loader = this.loader;

            loader.setTexturePath(texturesPath);

            loader.load(checkerPath, callback);

    };

    BoardLoader.prototype.loadDice = function(callback){

        var dicePath = this.config.dice.objectPath;

        var texturesPath = this.config.dice.texturesPath;

        var loader = this.loader;

            loader.setTexturePath(texturesPath);

            loader.load(dicePath, callback);

    };

    BoardLoader.prototype.loadPlane = function (callback) {

        var planePath = this.config.plane.objectPath;

        var texturesPath = this.config.plane.texturesPath;

        var loader = this.loader;

            loader.setTexturePath(texturesPath);

            loader.load(planePath, callback)

    };

    BoardLoader.prototype.loadDiceAnimations = function (success) {

        var self = this;

        var animationsFiles = [
            '0.json',
            '1.json'
        ];
        var animationsPath = this.config.dice.animationsPath;

        var animationsCount = animationsFiles.length;

        var animations = {};

        for(var i = 0; i < animationsCount; i++){

            (function (_i) {

                var fileName = animationsFiles[_i];
                var fullFileName = animationsPath + fileName;

                self.xhrGet(fullFileName, function (r) {

                    r = JSON.parse(r);
                    animations[_i] = r;

                    if(Object.keys(animations).length == animationsCount){

                        success && success(animations);

                    }

                });

            }(i));

        }

    };

    BoardLoader.prototype.setTexturePath = function(path){

        this.loader.setTexturePath.apply(this, arguments);

    };

    Backgammon3DBoard.BoardLoader = BoardLoader;

})();
