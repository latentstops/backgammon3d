(function () {

    var OptimizationManager = function (manager) {

        this.init.apply(this, arguments);

    };

    OptimizationManager.prototype = {

        init: function (manager) {

            this.manager = manager;

            this.priority = 0;

            this.initConfig();

            this.checkersOptimizationDone = false;
            this.textureOptimizationDone  = false;
            this.shadowsOptimizationDone  = false;

            this.interval = 3000;

            var stats = this.manager.stats;

            stats.functions = [{func: this.update, scope: this}];

            this.initOptimizations();


        },

        initConfig: function () {

            this.config = {
                FPS_MIN: 30,
                FPS_MAX: 45
            }

        },

        initOptimizations: function () {

            var optimizations = [];

            var manager = this.manager;
            var isWeb = manager.platformDetector.isWeb;

            optimizations.push({isOptimized: false, scope: this, func: this.optimizeShadows});
            isWeb && optimizations.push({isOptimized: false, scope: this, func: this.optimizeCheckers});
            optimizations.push({isOptimized: false, scope: this, func: this.optimizeTextures});

            this.optimizations = optimizations;

        },

        optimizeNext: function () {

            this.manipulateOptimization(false);

        },

        manipulateOptimization: function (condition) {

            var optimizations = this.optimizations;

            for(var i in optimizations){

                var optimization = optimizations[i];

                if(optimization.isOptimized == condition) {

                    var func = optimization.func;

                    var scope = optimization.scope;

                    func.call(scope, condition);

                    optimization.isOptimized = !condition;

                    break;
                }

            }

        },

        revertOptimizationNext: function () {

            this.manipulateOptimization(true);
        },

        update: function () {

            var config = this.config;

            var stats = this.manager.stats;

            var fps = stats.fps;

            //document.querySelector('#fps').innerHTML = fps;

            var scene   = this.manager.scene;

            if (! scene) {
                return;
            }

            if(config.FPS_MIN > fps ) {

                this.optimizeNext();

            } else if (fps > config.FPS_MAX ){

                this.revertOptimizationNext();

            }

        },

        optimizeShadows: function (condition) {

            var manager = this.manager;
            var stats   = manager.stats;
            var scene   = manager.scene;

            if(!stats) return;

            var dLight2 = scene.getObjectByName("dLight2");

            var fps = stats.fps;

            var config = this.config;

            if(!condition) {

                dLight2.castShadow = !(dLight2.shadowDarkness == 0);
                dLight2.shadowDarkness = 0;

            } else {

                dLight2.castShadow = true;
                dLight2.shadowDarkness = 0.3;

            }

        },

        optimizeCheckers: function (condition) {


            var self                    = this;
            var manager                 = this.manager;
            var stats                   = manager.stats;
            var fps                     = +stats.fps;
            var config                  = manager.config;
            var checkerName             = config.checker.name;
            var checkerObjectPathLow    = config.checker.objectPathLow;
            var loader                  = new THREE.ObjectLoader();
            var scene                   = manager.scene;
            var checkerNameLow          = config.checker.nameLow;
            var points                  = manager.checkerManager.points;
            this.checkerHighGeometry    = scene.getObjectByName(checkerName).geometry;

            //if(this.checkerLoadginStarted) return;


            !self.checkerGeometryLow && loader.load(checkerObjectPathLow, function (checkerScene) {

                self.checkerLoadginStarted = true;

                var checkerMesh = checkerScene.getObjectByName(checkerNameLow);

                var geometryLow = checkerMesh.geometry;
                geometryLow.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

                self.checkerGeometryLow = geometryLow;

                doAction();

            });

            self.checkerGeometryLow && doAction(self.checkerGeometryLow);

            function doAction(){

                if(!condition){

                    self.checkerGeometry = self.checkerGeometryLow;

                } else {

                    self.checkerGeometry = self.manager.checkerManager.checkerGeometryHigh;

                }

                points.children.forEach(function (point, i) {

                    point.children.forEach(function (checker, j) {

                        checker.geometry = self.checkerGeometry;

                    });

                });
            }

        },

        optimizeTextures: function (condition) {



            if(this.textureOptimizationDone) return;

            var manager             = this.manager;
            var scene               = manager.scene;
            var config              = manager.config;
            var boardTexturesPath   = config.board.texturesPath;

            var boardImagePlane = this.boardImagePlane || new THREE.Mesh(
                    new THREE.PlaneGeometry(9.3,6.2),
                    new THREE.MeshPhongMaterial({
                        map: THREE.ImageUtils.loadTexture(boardTexturesPath + 'BI.png'),
                        side: THREE.DoubleSide,
                        color: new THREE.Color(0xffffff)
                    })
                );

            boardImagePlane.name = 'BI';
            boardImagePlane.rotateX(-Math.PI / 2);
            this.boardImagePlane = boardImagePlane;

            if(!scene.getObjectByName(boardImagePlane.name)) {
                scene.add(boardImagePlane)
            }

            var board = scene.getObjectByName('Board_03');

            var shadowPlane = scene.getObjectByName('ShadowPlane');
            shadowPlane.visible = false;

            if(!condition){

                board.visible       = false;
                shadowPlane.visible = false;
                scene.getObjectByName(boardImagePlane.name).visible = true;

            } else {

                board.visible       = true;
                shadowPlane.visible = true;
                scene.getObjectByName(boardImagePlane.name).visible = false;

            }


        }

    };

    Backgammon3DBoard.OptimizationManager = OptimizationManager;

})();