(function(){

    var Manager = function(){

        (arguments.length > 0) && this.init.apply(this, arguments);

    };

    Manager.prototype.initProperties = function(){

        this.config              = {};

        this.isInited            = false;


        this.scene               = null;

        this.clock               = null;

        this.camera              = null;

        this.loader              = null;

        this.renderer            = null;

        this.modelsPath          = null;

        this.diceManager         = null;

        this.domContainer        = null;

        this.objectPicker        = null;

        this.domContainer        = null;

        this.cameraControls      = null;

        this.checkerManager      = null;

        this.onLoadComplete      = function(){};

        this.animationFrameID    = null;

        this.platformDetector    = null;

        this.eventSource         = null;

    };

    Manager.prototype.init = function(domContainer, eventSource, mainPath, initialConfig) {


        if (!mainPath) console.error('Manger: Objects path is required!');

        this.eventSource = eventSource;

        this.mainPath = mainPath;

        this.initialConfig = initialConfig || {

            rotationState: 0,

            isColorSwitched: false,

            isMirrored: false,

            outPlaces: {

                placeOfOut1: 0,
                placeOfOut2: 25

            }

        };

        this.initConfig(mainPath);

        this.initStats();

        this.modelsPath = this.config || '';

        this.initDomContainer(domContainer);

        this.initPlatformDetector();

        this.initOptimizationManager();

        this.initRenderer();

        this.initCamera();

        this.initLoader();

    };

    Manager.prototype.initConfig = function(mainPath){

        this.config = {

            mainPath:           mainPath,

            board: {
                objectPath:     mainPath + 'board/board.json',
                texturesPath:   mainPath + 'board/'
            },

            plane: {
                objectPath:     mainPath + 'plane/opt-plane-01.json',
                texturesPath:   mainPath + 'plane/',
                name:           'Plane001'
            },

            checker: {
                objectPath:     mainPath + 'checker/checker-high.json',
                objectPathLow:  mainPath + 'checker/checker.json',
                texturesPath:   mainPath + 'checker/',
                name:           'Checker_High_001',
                nameLow:        'Checker_01.001'
            },

            dice: {
                objectPath:     mainPath + 'dice/dice.json',
                texturesPath:   mainPath + 'dice/',
                animationsPath: mainPath + 'dice/animations/',
                name:           'Dice_01'
            },

            double_cube: {
                texturesPath:   mainPath + 'double_cube/',
                name:           'double_cube'
            },

            renderer : {
                antialias: true,
                alpha:     true,
                clearColor: 0x595d69,
                shadowMap : {
                    enabled: true,
                    soft:    true
                }
            },

            camera: {
                position: new THREE.Vector3( 0, 13, 6 ),
                zoom : 1.38
            }
        };

    };


    Manager.prototype.initDomContainer = function(domContainer) {

        this.domContainer = domContainer  || document.createElement('div');

    };

    Manager.prototype.initCamera = function() {

        var el = this.domContainer;
        var WIDTH = el.clientWidth || el.width;
        var HEIGHT = el.clientHeight || el.height;

        var config = this.config.camera;

        this.camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10000);

        this.camera.position.copy(config.position);

        this.camera.lookAt(new THREE.Vector3(0, 0, 0.3));

        this.camera.zoom = config.zoom;

        this.camera.updateProjectionMatrix();

    };



    Manager.prototype.initScene = function(loadedScene) {

            if (loadedScene) {
                    this.scene = loadedScene;
            } else {
                    this.scene = new THREE.Scene();
            }

    };

    Manager.prototype.initRenderer = function() {

        this.renderer = this.platformDetector.getRenderer();

    };



    Manager.prototype.initLoader = function() {

        var config = this.config;

        this.loader = new Backgammon3DBoard.BoardLoader(config);

    };

    Manager.prototype.initMovementManager = function () {

        this.movementManager = new Backgammon3DBoard.MovementManager(this);

    };

    Manager.prototype.initPlatformDetector = function () {

        var domContainer = this.domContainer;
        var eventSource  = this.eventSource;
        var config       = this.config;

        this.platformDetector = new Backgammon3DBoard.PlatformDetector(domContainer, eventSource, config);

    };


    Manager.prototype.fullInit = function(boardScene, animations) {

        var self = this;

        this.initScene(boardScene);

        this.initDiceManager(animations);

        this.initEvents();

        this.initLights();

        this.initCameraControls();

        this.scene.getObjectByName('Board_03')  && this.beautifyScene();

        this.initCheckerManager();

        this.initDoubleCube();

        this.initMovementManager();

        this.initTextWriter();

        this.applyInitialConfig();

        this.initGameHelper();

        this.initAPI();

        //this.initPhysics();

        this.onLoadComplete();

        this.isInited = true;


    };

    Manager.prototype.applyInitialConfig = function(){

        var initialConfig = this.initialConfig;

        var checkerManager = this.checkerManager;

        var isMirrored = initialConfig.isMirrored;

        var rotationState = initialConfig.rotationState;

        this.setRotationState(rotationState, false);

        isMirrored && checkerManager.mirrorPositionMap();

    };


    Manager.prototype.initCameraControls = function() {

        var camera = this.camera;

        //THREE.OrbitControls = null;

        this.cameraControls = THREE.OrbitControls ? new THREE.OrbitControls(camera, this.renderer.domElement) : {};

        this.cameraControls.target = new THREE.Vector3(0, -0.6, 0);


     };

    Manager.prototype.initStats = function(){

        this.stats = new Stats();

    };

    Manager.prototype.initOptimizationManager = function () {

        this.optimizationManager = new Backgammon3DBoard.OptimizationManager(this);

    };

    Manager.prototype.initCheckerManager = function(isMirrored) {

        var scene = this.scene;

        var checkerName = this.config.checker.name;

        var checker = scene.getObjectByName(checkerName);

        checker.scale.set(0.019, 0.019, 0.021);

        this.checkerManager = new Backgammon3DBoard.CheckerManager(this, isMirrored);

        scene.remove(checker);

    };

    Manager.prototype.initDiceManager = function(animations) {

        var diceManagerParams = {mass: 0.3, diceParams: {x: 0.2, y: 0.2, z: 0.2}};

        var modelsPath = this.modelsPath;

        this.diceManager = new Backgammon3DBoard.DiceManager(this, diceManagerParams, modelsPath.dice, animations);

    };

    Manager.prototype.initTextWriter = function () {

        this.textWriter = new Backgammon3DBoard.TextWriter(this);

    };

    Manager.prototype.initDoubleCube = function () {

        this.doubleCubeManager = new Backgammon3DBoard.DoubleCubeManager(this);

    };


    Manager.prototype.initEvents = function() {

        var self = this;
        var domContainer = this.domContainer;

        var platformDetector = this.platformDetector;

        if(!domContainer) return;




        var onresize = function (event) {

            self.stopRendering = false;

            var renderer = self.renderer;

            var WIDTH = self.domContainer.clientWidth   || self.domContainer.width;
            var HEIGHT = self.domContainer.clientHeight || self.domContainer.height;

            if(self.platformDetector.isMobile) {
                WIDTH = window.innerWidth;
                HEIGHT = window.innerHeight;
            }

            self.camera.aspect = WIDTH / HEIGHT;
            self.camera.updateProjectionMatrix();
            renderer.setSize(WIDTH, HEIGHT);


            if(
                self.platformDetector.isMobile &&
                window.innerWidth < window.innerHeight
            ){

                return;

            }

            if(!self.platformDetector.isMobile) return;


            self.camera.position.set(0, 9.364, 3.414);
            self.camera.lookAt(new THREE.Vector3(0,-0.6,0));



        };

        platformDetector.connectResize(onresize);

    };


    Manager.prototype.load = function() {

        var self = this;

        var loader = this.loader;

        loader.config = this.config;

        loader.loadAll( function (scene, animations) {

            self.fullInit(scene, animations);

        })
    };

    Manager.prototype.beautifyScene  = function() {

        var scene = this.scene;

        var main = scene.getObjectByName('Object001');
            main.receiveShadow = true;
            main.castShadow = true;

        var board = scene.getObjectByName('Board_03');
            board.receiveShadow = true;
            board.castShadow = true;

        var boardTexturesPath = this.config.board.texturesPath;
        var planeTexturesPath = this.config.plane.texturesPath;

        var textureLoader = THREE.ImageUtils;
        var map = textureLoader.loadTexture( boardTexturesPath + 'bg_board_tex_2000px.jpg', function(){});
            map.minFilter = THREE.LinearFilter;

        var material;
        material = new THREE.MeshPhongMaterial({color: 0xffffff});
        material.map = map;
        material.bumpMap = map;

        material.bumpScale = 0.01;
        material.shininess = 50;

        board.material = material;

        var plane = new THREE.Mesh(new THREE.PlaneGeometry(8.9,5.9), new THREE.MeshBasicMaterial());
            plane.name = 'ProjectionObject';
            plane.rotateX( -Math.PI / 2);
            plane.position.y = 0.5;
            plane.material.transparent = true;
            plane.material.opacity = 0;

            var shadowPlane = new THREE.Mesh(
                                    new THREE.PlaneGeometry(11.8,11.8),
                                    new THREE.MeshPhongMaterial({
                                                    map: THREE.ImageUtils.loadTexture(planeTexturesPath + 'flor_alpha_01.png'),
                                                    side: THREE.DoubleSide,
                                                    color: new THREE.Color(0xffffff)
                                            })
                                    );

            shadowPlane.rotateX( - Math.PI / 2);
            shadowPlane.material.shininess      = 150;
            shadowPlane.material.specular       = 0;
            shadowPlane.material.transparent    = true;
            shadowPlane.name                    = 'ShadowPlane';

        //if(this.platformDetector.isMobile) {
        //
        //    var boardImagePlane = new THREE.Mesh(
        //        new THREE.PlaneGeometry(9.3,6.2),
        //        new THREE.MeshPhongMaterial({
        //            map: THREE.ImageUtils.loadTexture(boardTexturesPath + 'BI.png'),
        //            side: THREE.DoubleSide,
        //            color: new THREE.Color(0xffffff)
        //        })
        //    );
        //
        //    boardImagePlane.name = 'BI';
        //    boardImagePlane.rotateX(-Math.PI / 2);
        //
        //    //var board = scene.getObjectByName("BI");
        //    //    board.visible = false;
        //
        //    scene.traverse(function (child) {
        //
        //        if(child instanceof THREE.Mesh) {
        //
        //            if(child.name == "BI") return;
        //
        //            child.visible = false;
        //
        //        }
        //
        //    });
        //    scene.add(boardImagePlane);
        //
        //}

            scene.add(plane);
            //!this.platformDetector.isMobile &&
            scene.add(shadowPlane);


    };

    Manager.prototype.initLights = function() {

        var scene = this.scene;

        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
            hemisphereLight.position.set(0, 50, 0);
            hemisphereLight.name        = 'hLight';
            hemisphereLight.intensity   = 0.1;
            hemisphereLight.visible     = true;


        var light = new THREE.DirectionalLight(0xffffff, 0.1);
            light.position.set(0, 5, 5);
            light.name                  = 'dLight1';
            light.castShadow            = false;
            light.shadowCameraNear      =  3;
            light.shadowCameraFar       =  15;
            light.shadowCameraLeft      = -5;
            light.shadowCameraRight     =  5;
            light.shadowCameraTop       =  5;
            light.shadowCameraBottom    = -5;
            light.shadowDarkness        =  0.3;
            light.shadowBias            =  0;
            light.shadowMapHeight       = light.shadowMapWidth = 1024;
            light.intensity             =  0.6;
            light.visible               = true;

        scene.add(light);

        var light2 = new THREE.DirectionalLight(0xffffff, 0.1);
            light2.position.set(5, 5, -5);
            light2.name                 = 'dLight2';
            light2.castShadow           = !this.platformDetector.isMobile;
            light2.shadowCameraNear     =  3;
            light2.shadowCameraFar      =  15;
            light2.shadowCameraLeft     = -5;
            light2.shadowCameraRight    =  5;
            light2.shadowCameraTop      =  5;
            light2.shadowCameraBottom   = -5;
            light2.shadowDarkness       =  0.3;
            light2.shadowBias           =  0;
            light2.shadowMapHeight      = light2.shadowMapWidth = 1024;
            light2.intensity            =  0.6;
            light2.visible              = true;
            light2.position.z = -light.position.z;
            light2.position.x = -light.position.x;

        scene.add(light2);

        scene.add(hemisphereLight);

    };

    Manager.prototype.initGameHelper = function () {

        this.gameHelper = Backgammon3DBoard.GameHelper && new Backgammon3DBoard.GameHelper(this);

    };

    Manager.prototype.start = function() {

        var self = this;

        var then;

        function animate() {

            self.stats.begin();
            var now = Date.now();
            var delta = now - then;

            try{

                self.animationFrameID = requestAnimationFrame(animate);
                self.animate(delta / 20);


            }catch(e){

                console.error(e);

            }

            then = now;

            self.stats.end();

        }

        animate();

    };

    Manager.prototype.destroy = function(){

        if(!this.platformDetector.isWeb) return;

        this.renderer.clear();

        this.animationFrameID && cancelAnimationFrame(
			this.animationFrameID.data && this.animationFrameID.data.handleId || this.animationFrameID
		);

        this.renderer.domElement.addEventListener('dblclick', null, false);

        this.platformDetector.removeEvents();

        this.scene              = null;
        this.camera             = null;
        this.cameraControls     = null;
        this.checkerManager     = null;
        this.diceManager        = null;

    };

    Manager.prototype.animate = function(delta){

        var self = this;

        if (self.stopRendering) return;
        if (!self.isInited) return;
        //if (!self.needRendering) return;

        var renderer    = self.renderer;

        var scene       = self.scene;

        var camera      = self.camera;

        var diceManger  = self.diceManager;

        var physics     = self.physics;

        var textWriter = self.textWriter;

        var optimizationManager = self.optimizationManager;

        var cameraControls = self.cameraControls || { update: function(){} };

        renderer.clear();

        renderer.render(scene, camera);

        TWEEN.update();

        diceManger.update(delta);

        cameraControls.update();


        //optimizationManager.update();

    };

    //Manager.prototype.optimizeForLowFPS = function () {
    //
    //    var stats = this.stats;
    //
    //    if(!stats) return;
    //
    //    var fps = +stats.fps;
    //    var dLight2 = this.scene.getObjectByName("dLight2");
    //
    //    if(dLight2.shadowDarkness == 0) {
    //        dLight2.castShadow = false;
    //    }else{
    //        dLight2.castShadow = true;
    //    }
    //
    //    if(20 < fps && fps < 30){
    //
    //            dLight2.shadowDarkness = 0;
    //    }
    //    else{
    //            dLight2.shadowDarkness = 0.3;
    //    }
    //
    //};

    Manager.prototype.setRotationState = function(state, isAnimated){

        var movementManager = this.movementManager;

        movementManager.rotateBoard(+state, isAnimated);

    };

    Manager.prototype.setPlaceOfOut = function (type, place) {

        this.checkerManager.setPlaceOfOut(type, place)

    };

    Manager.prototype.setDoubleCubeReadOnly = function (state) {

        this.doubleCubeManager.setReadOnly(state);

    };

    Manager.prototype.setDegreeState = function (state, isAnimated) {

       var movementManager = this.movementManager;

        movementManager.setBoardDegreeState(+state, isAnimated);


    };

    Manager.prototype.initPhysics = function () {

        var dice1 = this.diceManager.getDice1();
        var dice2 = this.diceManager.getDice2();

        var physics = new DAC.PhysicsManager(this);
            //physics.createPhysicsForMesh(dice1.three);
            //physics.createPhysicsForMesh(dice2.three);

        this.physics = physics;

    };

    Manager.prototype.initAPI = function () {


        var movementManager     = this.movementManager;

        var checkerManager      = this.checkerManager;

        var doubleCubeManager   = this.doubleCubeManager;

        var diceManager         = this.diceManager;

        var textWriter          = this.textWriter;

        var checkerPicker       = checkerManager.checkerPicker;

        var doubleCubePicker    = doubleCubeManager.doubleCubePicker;

        var gameHelper          = this.gameHelper;

        this.api = {

            /**
             *
             * Call backs
             *
             * */
            set moved(callback) {

                checkerPicker.moved = callback;
            },

            set maxStep(callback) {

                checkerPicker.maxStep = callback;

            },

            set minStep(callback) {

                checkerPicker.minStep = callback;

            },

            set allPossibleSteps(callback) {

                checkerPicker.allPossibleSteps = callback;

            },

            set doubleCubeMoved(callback) {

                doubleCubePicker.doubleCubeMoved = callback;

            },

            set playCheckerSound(callback) {

                checkerPicker.playSound = callback;

            },

            set playDiceSound(callback) {

                diceManager.playSound = callback;

            },

            set playDoubleCubeSound(callback) {

                doubleCubeManager.playSound = callback;

            },



            /**
             *
             * Board
             *
             * */
            setRotationState: function (state, isAnimated) {

                state = +state;
                movementManager.rotateBoard.apply(movementManager, arguments);

            },

            setDegreeState: function (state, isAnimated) {

                state = +state;
                movementManager.setBoardDegreeState.apply(movementManager, arguments);

            },


            /**
             *
             * Checkers
             *
             * */
            setPlaceOfOut: function (type, place) {

                checkerManager.setPlaceOfOut.apply(checkerManager, arguments);

            },

            setCheckersInPoint: function (point, collection) {

                checkerManager.setCheckersInPoint.apply(checkerManager, arguments);

            },

            move: function (moveCollection, isAnimated) {

                checkerPicker.moveCollection.apply(checkerPicker, arguments);

            },

            setReadOnly : function (checkerType, isReadOnly) {

                checkerManager.setReadOnly.apply(checkerManager, arguments);

            },

            switchColors: function(state){

                checkerManager.switchCheckersColors.apply(checkerManager, arguments);
                diceManager.switchDiceColors.apply(diceManager, arguments);

            },

            setMirroredState: function(state, isAnimated){

                checkerManager.mirrorPositionMap.apply(checkerManager, arguments);

            },


            /**
             *
             * Double Cube
             *
             * */
            setDoubleCubeReadOnly: function (state) {

                doubleCubeManager.setReadOnly.apply(doubleCubeManager, arguments);
            },

            moveDoubleCubeTo: function(index, isAnimated){

                doubleCubePicker.move.apply(doubleCubePicker, arguments);

            },

            changeDoubleCubeTo : function (place, number, isAnimated) {

                doubleCubeManager.setDoubleCube.apply(doubleCubeManager, arguments);

            },

            isDoubleCubeExist: function(state){

                doubleCubeManager.isDoubleCubeExist.apply(doubleCubeManager, arguments);

            },


            /**
             *
             * Dices
             *
             * */
            roll : function(num1, num2, rollType, isAnimated) {

                diceManager.drop.apply(diceManager, arguments);
            },

            setDiceState: function(dice, state) {

                diceManager.setDiceState.apply(diceManager, arguments);

            },

            /**
             *
             * Pips
             *
             * */
            showPips : function() {

                textWriter.showPips();
            },

            hidePips: function() {

                textWriter.hidePips();
            },

            writePips: function(pips, text){

                textWriter.write(pips, text);

            },

            setPips: function(pips1, pips2){

                textWriter.write(0, ""+pips1);
                textWriter.write(1, ""+pips2);

            },

            setPipsVisibility: function(state){

                textWriter.setPipsVisibiliyState(state);

            },

            /**
             *
             * Hints
             *
             * */
            turnAllHintsOff: function () {

                gameHelper.turnOffAllLights();

            },

            setHintForIndex: function (index) {

                gameHelper.turnLightOnForIndex(index);

            },

            removeHintForIndex: function(index){

                gameHelper.turnLightOffForIndex(index);

            },

            setHintsForIndexes: function(index1OrArray, index2){

                gameHelper.turnOffAllLights();

                if(index1OrArray[0]){
                    gameHelper.turnLightOnForIndex(index1OrArray[0]);
                    gameHelper.turnLightOnForIndex(index1OrArray[1]);
                }
                else{

                    gameHelper.turnLightOnForIndex(index1OrArray);
                    gameHelper.turnLightOnForIndex(index2);

                }

            },

            /**
            *
            * Helpers
            *
            * */

            short: function () {
                gameHelper.short();
            }


        };

    };


    Backgammon3DBoard.Manager = Manager;

})();
