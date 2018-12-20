var Stats = function () {



    var beginTime = ( Date ).now(),
        prevTime = beginTime,
        frames = 0;

    return {

        functions:[],

        begin: function () {

            beginTime = ( Date ).now();

        },

        end: function () {

            frames++;

            var time = ( Date ).now();

            var interval = this.interval;

            if (time > prevTime + interval) {

                this.fps = Math.round(( frames * 1000 ) / ( time - prevTime ));

                prevTime = time;

                this.functions.forEach(function (funcObject) {

                    if(!funcObject) return;

                    var func = funcObject.func;
                    var scope = funcObject.scope;

                    if(!func || !scope) return;

                    func.call(scope);

                });

                frames = 0;

            }

            return time;

        },

        update: function () {

            beginTime = this.end();

        },

        interval: 3000

    };

};

/*
 * API is inside of board_manager.api
 */

/* Callbacks */
//moved:                  function (from, to)
//maxStep:                function (from)
//minStep:                function (from)
//allPossibleSteps:       function (from)

/* Board */
//setRotationState:       function (state, isAnimated)
//setDegreeState:         function (state, isAnimated)

/* Checkers */
//setPlaceOfOut:          function (type, place)
//setCheckersInPoint:     function (point, collection)
//move:                   function (moveCollection, isAnimated)
//setReadOnly :           function (checkerType, isReadOnly)
//switchColors:           function (state)
//setMirroredState:       function (state, isAnimated)

/* Double Cube */
//setDoubleCubeReadOnly:  function (state)
//moveDoubleCubeTo:       function (index, isAnimated)
//changeDoubleCubeTo:     function (place, number, isAnimated)
//isDoubleCubeExist:      function (state)

/* Dices */
//roll :                  function(num1, num2, rollType, isAnimated)
//setDiceState:           function(dice, state)

/* PIPS */
//setPipsVisibilityState  function(state)
//showPips :              function()
//hidePips:               function()
//writePips:              function(pips, text) /* pips argument can be 0,1 OR 'pips1','pips2' */

var Backgammon3DBoard;

(function(){

    var BackgammonBoard = function(){};

    Backgammon3DBoard = new BackgammonBoard();

})();

(function(){

    var PositionMapGenerator = function(){

        this.init.apply(this, arguments);

    };

    PositionMapGenerator.prototype.initProperties = function() {

        this.horizontalStep         = null;
        this.verticalStep           = null;
        this.verticalStepOut        = null;
        this.positionMap            = null;
        this.positionMapIterator    = null;
        this.positions              = {};
        this.points                 = null;
        this.dot                    = null;

    };

    PositionMapGenerator.prototype.init = function(scene) {

        this.initProperties();

        this.scene = scene;

        this.horizontalStep = 0.54;

        this.verticalStep = 0.48;

        this.verticalStepOut = 0.142;

        this.positionMap = [];

        this.positionMapIterator = 0;

        this.initPoints();

        this.initPositions();

        this.initDot();

    };

    PositionMapGenerator.prototype.initDot  = function() {

        this.dot = new THREE.Mesh(new THREE.SphereGeometry(0.01), new THREE.MeshLambertMaterial({wireframe: true}));

    };


    PositionMapGenerator.prototype.initPoints = function() {

        this.points = new THREE.Object3D();
        this.points.name = 'Points';

    };



    PositionMapGenerator.prototype.initPositions = function() {

        this.positions = {

            rightDownOut:   new THREE.Vector3(  4.04,   0.3 ,  2.57 ),

            rightDown:      new THREE.Vector3(  3.3 ,   0.04,  2.55 ),
            leftDown:       new THREE.Vector3( -0.6 ,   0.04,  2.55 ),
            leftUp:         new THREE.Vector3( -3.3 ,   0.04, -2.55 ),
            rightUp:        new THREE.Vector3(  0.6 ,   0.04, -2.55 ),

            rightUpOut:     new THREE.Vector3(  4.04,   0.3 , -2.57 ),
            leftDownOut:    new THREE.Vector3( -4.04,   0.3 ,  2.57 ),
            leftUpOut:      new THREE.Vector3( -4.04,   0.3 , -2.57 ),

            hitUp:          new THREE.Vector3(  0   ,   0.31, -1    ),
            hitDown:        new THREE.Vector3(  0   ,   0.31,  1    )

        };

    };



    PositionMapGenerator.prototype.fillBoard = function() {

        this.fillRightDownOut();

        this.fillRightDown();
        this.fillLeftDown();
        this.fillLeftUp();
        this.fillRightUp();

        this.fillRightUpOut();

        this.fillHitDown();
        this.fillHitUp();

        this.fillLeftDownOut();
        this.fillLeftUpOut();


    };

    PositionMapGenerator.prototype.fillRightDown = function() {

        var rightDownPosition = this.positions.rightDown;
        var horizontalStep = -this.horizontalStep;
        var verticalStep = -this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 6;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: rightDownPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillRightDownOut = function() {

        var rightDownOutPosition = this.positions.rightDownOut;
        var horizontalStep = -this.horizontalStep;
        var verticalStep = -this.verticalStepOut;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: rightDownOutPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillLeftDown = function() {

        var leftDownPosition = this.positions.leftDown;
        var horizontalStep = -this.horizontalStep;
        var verticalStep = -this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 6;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: leftDownPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };

    PositionMapGenerator.prototype.fillLeftDownOut = function() {

        var leftDownPosition = this.positions.leftDownOut;
        var horizontalStep = -this.horizontalStep;
        var verticalStep = -this.verticalStepOut;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: leftDownPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillLeftUp = function() {

        var leftUpPosition = this.positions.leftUp;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 6;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: leftUpPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillLeftUpOut = function() {

        var leftUpPosition = this.positions.leftUpOut;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStepOut;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: leftUpPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillRightUp = function() {

        var rightUpPosition = this.positions.rightUp;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 6;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: rightUpPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillRightUpOut = function() {

        var rightUpPosition = this.positions.rightUpOut;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStepOut;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: rightUpPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillHitUp = function() {

        var hitDownPosition = this.positions.hitUp;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: hitDownPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fillHitDown = function() {

        var hitDownPosition = this.positions.hitDown;
        var horizontalStep = this.horizontalStep;
        var verticalStep = this.verticalStep;
        var verticalCheckersCount = 15;
        var horizontalCheckersCount = 1;

        var params = {

            horizontalStep: horizontalStep,
            verticalStep: verticalStep,
            startPosition: hitDownPosition,
            verticalCheckersCount: verticalCheckersCount,
            horizontalCheckersCount: horizontalCheckersCount

        };

        this.fill(params);

    };


    PositionMapGenerator.prototype.fill = function(params) {

        var self = this;

        var baseDot = this.dot;

        var verticalStepOut = this.verticalStepOut;

        var startPosition           = params.startPosition;
        var horizontalStep          = params.horizontalStep;
        var verticalStep            = params.verticalStep;
        var verticalCheckersCount   = params.verticalCheckersCount;
        var horizontalCheckersCount = params.horizontalCheckersCount;

        var cloneDot = baseDot.clone();
            cloneDot.position.copy(startPosition);

        var scene = this.scene;


        for (var i = 0; i < horizontalCheckersCount; i++) {

            for (var j = 0; j < verticalCheckersCount; j++) {

                var dot = cloneDot.clone();
                    dot.position.copy(cloneDot.position);

                //scene.add(dot);

                if (startPosition == this.positions.hitUp ||
                    startPosition == this.positions.hitDown) {

                    //dot.position.y += j * verticalStepOut;
                    //dot.position.y +=  verticalStepOut;

                    addToMap(this.positionMapIterator, dot.position);
                    continue;

                }
                else if (
                    j > 4 &&
                    startPosition != this.positions.hitUp &&
                    startPosition != this.positions.hitDown &&
                    Math.abs(verticalStep) == Math.abs(this.verticalStep)
                ) {

                    dot.position.x += i * horizontalStep;
                    dot.position.z += 4 * verticalStep;
                    //dot.position.y += (j - 4) * verticalStepOut;
                    dot.position.y +=  verticalStepOut;

                    //this.positionMap[this.positionMapIterator].push(dot.position);
                    addToMap(this.positionMapIterator, dot.position);
                    continue;

                }


                dot.position.x += i * horizontalStep;
                dot.position.z += j * verticalStep;

                //this.positionMap[this.positionMapIterator].push(dot.position);
                addToMap(this.positionMapIterator, dot.position);

            }

            this.positionMapIterator++;

        }

        function addToMap(index, position) {

            var map = self.positionMap;

            if (!map[index]) {

                map[index] = [];

            }

            map[index].push(position);

        }

    };

    Backgammon3DBoard.PositionMapGenerator = PositionMapGenerator;

})();

(function(){

    var CheckerManager = function(manager, isMirrored){

        this.manager = manager;

        var scene = this.manager.scene;

        var checker = scene.getObjectByName(this.manager.config.checker.name);

        var modelsPath = this.manager.config;

        this.init(scene, checker, modelsPath, isMirrored);

    };

    CheckerManager.prototype.initProperties = function() {

        this.scaleFactor         = null;

        this.positionMap         = null;

        this.materialMap         = null;

        this.positionMapIterator = null;

        this.points              = null;

        this.scene               = null;

        this.checker             = null;

        this.mirrorState         = 0;

        this.isColorSwitched     = 0;

    };

    CheckerManager.prototype.init = function(scene, checker, modelsPath, isMirrored) {

        this.initProperties();

        this.scene = scene;

        this.isMirrored = isMirrored;

        this.checker = checker;

        this.checkerGeometryHigh = checker.geometry;

        this.scaleFactor = new THREE.Vector3(0.01, 0.01, 0.01);

        this.modelsPath = modelsPath;

        this.initPositionMap();

        this.initPoints();

        this.initMaterialMap();

        this.initCheckerPicker();

        this.beautifyChecker();

    };

    CheckerManager.prototype.initPoints = function () {

        this.points = new THREE.Object3D();

        var points = this.points;

            points.name = 'Points';

        var map = this.positionMap;

        var scene = this.scene;

        for (var index in map) {

            var point = map[index];

            var pointTHREE = new THREE.Object3D();
                pointTHREE.name = 'point';
                pointTHREE.index = index;

            points.add(pointTHREE);

        }

        scene.add(points);

    };


    CheckerManager.prototype.initPositionMap = function() {

        var isMirrored = this.isMirrored;

        this.positionMapGenerator = new Backgammon3DBoard.PositionMapGenerator(this.scene);
        this.positionMapGenerator.fillBoard();

        this.positionMap = this.positionMapGenerator.positionMap.slice(0);


    };

    CheckerManager.prototype.mirrorPositionMap = function(state, isAnimated){

        if(state === undefined) return;

        if(this.mirrorState == state) return;

        this.mirrorState = state;

        var positionMap = this.positionMap;

        var first = positionMap.shift();
        var down  = positionMap.splice(0, 12);
        var up    = positionMap.splice(0, 12);

        down = down.reverse();
        up   = up.reverse();

        positionMap.unshift.apply(positionMap, up);
        positionMap.unshift.apply(positionMap, down);
        positionMap.unshift(first);

        var pMap0 = positionMap[0].slice(0);
        var pMap25 = positionMap[25].slice(0);

        positionMap[0] = positionMap[28];
        positionMap[28] = pMap0;

        positionMap[25] = positionMap[29];
        positionMap[29] = pMap25;

        this.recalculatePositions(isAnimated);

        this.manager.textWriter.updatePositions(isAnimated);

    };

    CheckerManager.prototype.initMaterialMap = function(){

        var colorsMap = {white: 0xDFCAB0, black: 0x222222};

        var blackMaterial = new THREE.MeshPhongMaterial({color: colorsMap.black});
            blackMaterial.shininess = 30;

        var whiteMaterial = new THREE.MeshPhongMaterial({color: colorsMap.white});
            whiteMaterial.shininess = 30;

        this.materialMap = [whiteMaterial, blackMaterial];

        this.colorsMap = colorsMap;

    };

    CheckerManager.prototype.initCheckerPicker = function () {

        var manager = this.manager;

        this.checkerPicker = new Backgammon3DBoard.CheckerPicker(manager, this.positionMap);

    };

    CheckerManager.prototype.beautifyChecker = function() {

        var checker = this.checker;

        if (!checker) return;

        checker.rotateX( - Math.PI / 2);

        var material = new THREE.MeshPhongMaterial();

        material.shininess = 0;
        material.bumpScale = 0.01;

        checker.material = material;

        checker.combine = THREE.MixOperation;
        checker.visible = true;
        checker.castShadow = true;
        checker.receiveShadow = true;

    };

    CheckerManager.prototype.recalculatePositions = function(isAnimated) {

        var self = this;

        var scene = this.scene;

        var points = scene.getObjectByName('Points');

        var textWriter = this.manager.textWriter;

        points.children.forEach(function (point, i) {

            point.children.forEach(function (checker, j) {

                self.checkerPicker.movementManager.animateCheckerMove(checker, self.positionMap[i][j], i, isAnimated);

            });

        });

        textWriter && textWriter.updateCheckersCounts();

    };

    CheckerManager.prototype.setCheckersInPoint = function(_point, _collection){

        var point = this.points.children[_point];
            point.children.length = 0;

        var map = this.positionMap[_point];

        var baseChecker = this.checker;

        var materialMap = this.materialMap;

        for(var i = 0; i < _collection.length; i++){

            var position = map[i];

            var cloneChecker             = baseChecker.clone();
                cloneChecker.material    = materialMap[+_collection[i]];
                cloneChecker.position.copy(position);
                cloneChecker.index       = _point;
                cloneChecker.readOnly    = true;
                cloneChecker.checkerType = +_collection[i];

                cloneChecker.rotation.x = this.manager.config.checker.name == "Checker_01.001" ? -Math.PI / 2 : cloneChecker.rotation.x;

            if(_point == 0) {

                cloneChecker.rotation.x =  -Math.PI ;

            }

            if(_point == 25) {

                cloneChecker.rotation.x =  0 ;

            }

            point.children[i] = cloneChecker;

        }

        var textWriter = this.manager.textWriter;

        textWriter.updateCheckersCounts();


    };

    CheckerManager.prototype.setReadOnly = function(checkerType, isReadOnly ){

        var scene = this.scene;

        var points = scene.getObjectByName('Points');

        var readOnlyPoints = points.children.filter(function(point){

            if(point.children.length == 0) return false;

            return point.children[point.children.length - 1].checkerType == checkerType;

        });

        readOnlyPoints.forEach(function (point) {

            point.children.forEach(function (child) {

                child.readOnly = isReadOnly;

            });

        });

    };

    CheckerManager.prototype.setPlaceOfOut = function (type, place) {

        if(this.mirrorState) {

            this.mirrorPositionMap(0, false);
            this.setPlaceOfOutForNormalMode(type, place);
            this.mirrorPositionMap(1, false);

        }else {

            this.setPlaceOfOutForNormalMode(type, place);

        }

    };

    CheckerManager.prototype.setPlaceOfOutForNormalMode = function (type, place) {

        var positionMap          = this.positionMap;

        var positionMapGenerator = this.positionMapGenerator;

        var textWriter           = this.manager.textWriter;

        if(type == 0) {

            switch(place){
                //case 0: {
                //    positionMap[0] = positionMapGenerator.positionMap[25].slice(0);
                //    positionMap[25] = positionMapGenerator.positionMap[0].slice(0);
                //    break;
                //}
                //case 1: {
                //    positionMap[0] = positionMapGenerator.positionMap[29].slice(0);
                //    positionMap[29] = positionMapGenerator.positionMap[0].slice(0);
                //    break;
                //}
                case 2: {
                    positionMap[0] = positionMapGenerator.positionMap[0].slice(0);
                    positionMap[25] = positionMapGenerator.positionMap[25].slice(0);
                    break;
                }
                case 3: {
                    positionMap[0] = positionMapGenerator.positionMap[28].slice(0);
                    positionMap[28] = positionMapGenerator.positionMap[0].slice(0);
                    break;
                }
            }

        }

        if(type == 1) {

            switch(place){
                case 0: {
                    positionMap[25] = positionMapGenerator.positionMap[25].slice(0);
                    positionMap[29] = positionMapGenerator.positionMap[29].slice(0);
                    break;
                }
                case 1: {
                    positionMap[25] = positionMapGenerator.positionMap[29].slice(0);
                    positionMap[29] = positionMapGenerator.positionMap[25].slice(0);
                    break;
                }
                //case 2: {
                //    positionMap[25] = positionMapGenerator.positionMap[0].slice(0);
                //    positionMap[0] = positionMapGenerator.positionMap[25].slice(0);
                //    break;
                //}
                //case 3: {
                //    positionMap[25] = positionMapGenerator.positionMap[28].slice(0);
                //    positionMap[28] = positionMapGenerator.positionMap[25].slice(0);
                //    break;
                //}
            }

        }

        textWriter && textWriter.updatePositions();
        this.recalculatePositions();



    };


    CheckerManager.prototype.switchCheckersColors = function(state){

        state = state || 0;

        this.isColorSwitched = this.isColorSwitched == state ? this.isColorSwitched : state;

        var colorSwitched = this.isColorSwitched;

        var scene = this.scene;

        var colorsMap = this.colorsMap;

        var points = this.points;

        var blackColor = new THREE.Color(colorsMap.black);
        var whiteColor = new THREE.Color(colorsMap.white);

        var self = this;

        points.traverse(function(child){

            if(child instanceof THREE.Mesh) {

                var checker = child;

                if(checker.checkerType == 1) {

                    if(colorSwitched){

                        checker.material = self.materialMap[0].clone();

                    }else{

                        checker.material = self.materialMap[1].clone();

                    }

                }else{

                    if(colorSwitched){

                        checker.material = self.materialMap[1].clone();

                    }else{

                        checker.material = self.materialMap[0].clone();

                    }
                }

            }

        });

        this.manager.textWriter.updateCheckersCounts();

    };

    CheckerManager.prototype.fillBoardFromMap = function() {

        var self = this;

        var scene = this.scene;

        var map = this.positionMap;

        var baseChecker = this.checker;

        var points = this.points;

        var material = baseChecker.material.clone();

        var blackMaterial = new THREE.MeshPhongMaterial({color: 0x222222});
        var whiteMaterial = new THREE.MeshPhongMaterial({color: 0xDFCAB0});

        var materialMap = [whiteMaterial, blackMaterial];

        for (var index in map) {

            var point = map[index];

            var pointTHREE = new THREE.Object3D();
                pointTHREE.name = 'point';
                pointTHREE.index = index;

            points.add(pointTHREE);

            var position = point[0];

            if (index == 30) continue;

            var cloneChecker = baseChecker.clone();
                cloneChecker.material = materialMap[index % 2];
                cloneChecker.position.copy(position);
                cloneChecker.index = index;
                cloneChecker.checkerType = index % 2;

            pointTHREE.add(cloneChecker);

        }

        scene.add(points);

    };

    Backgammon3DBoard.CheckerManager = CheckerManager;


})();

(function(){

    var Dice = function (manager, params, diceType, modelsPath){

        this.manager = manager;

        this.init.apply(this, arguments);

    };


    Dice.prototype.initProperties = function(){

        this.dump               = { position: [], rotation: [] };
        this.dumpedAnimation    = {};

        this.three              = null;
        this.modelsPath         = null;
        this.texturesMap        = null;
        this.startPosition      = null;
        this.DICE_TEXTURES_PATH = null;

    };


    Dice.prototype.init = function (manager, params, diceType, modelsPath) {

        this.initProperties();

        this.diceType = diceType;

        this.startPosition = params.startPosition || {x: 0, y: 0, z: 0};

        this.three = params.three;

        this.modelsPath = modelsPath;

        this.DICE_TEXTURES_PATH = this.modelsPath.texturesPath;

        var self = this;

        function getTexture(name){

            var texture = THREE.ImageUtils.loadTexture(self.DICE_TEXTURES_PATH + name);
            return texture;
        }

        this.texturesMap = {

            white:{
                '1': getTexture('dice_white/1.png'),

                '2': getTexture('dice_white/2.png'),

                '3': getTexture('dice_white/3.png'),

                '4': getTexture('dice_white/4.png'),

                '5': getTexture('dice_white/5.png'),

                '6': getTexture('dice_white/6.png')
            },

            black:{
                '1': getTexture('dice_black/1.png'),

                '2': getTexture('dice_black/2.png'),

                '3': getTexture('dice_black/3.png'),

                '4': getTexture('dice_black/4.png'),

                '5': getTexture('dice_black/5.png'),

                '6': getTexture('dice_black/6.png')
            },

            red:  {
                '1': getTexture('dice_red/1.png'),

                '2': getTexture('dice_red/2.png'),

                '3': getTexture('dice_red/3.png'),

                '4': getTexture('dice_red/4.png'),

                '5': getTexture('dice_red/5.png'),

                '6': getTexture('dice_red/6.png')
            }

        };

        this.currentTextureMap = {};

    };

    Dice.prototype.setStartPosition = function(x, y, z){

        this.startPosition.x = x;
        this.startPosition.y = y;
        this.startPosition.z = z;

    };

    Dice.prototype.drop = function(num){

        num = parseInt(num);

        switch (num) {

            case 1:
                this.drop1();
                break;

            case 2:
                this.drop2();
                break;

            case 3:
                this.drop3();
                break;

            case 4:
                this.drop4();
                break;

            case 5:
                this.drop5();
                break;

            case 6:
                this.drop6();
                break;

            default :
                this.dropX();

        }

    };


    /* Drops */
    Dice.prototype.drop1 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber1(animation);

    };

    Dice.prototype.drop2 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber2(animation);

    };

    Dice.prototype.drop3 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber3(animation);

    };

    Dice.prototype.drop4 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber4(animation);

    };

    Dice.prototype.drop5 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber5(animation);

    };

    Dice.prototype.drop6 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber6(animation);

    };

    Dice.prototype.dropX = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber6(animation);

    };

    /* Texture */
    Dice.prototype.setNumber = function(num, animation){

        this.three.visible = false;

        animation = parseInt(animation);

        if (isNaN(animation)) return;

        var faceConfigMap = {

            '1': [1, 2, 3, 6, 5, 4],

            '2': [2, 3, 1, 5, 4, 6],

            '3': [3, 1, 2, 4, 6, 5],

            '4': [4, 5, 6, 3, 2, 1],

            '5': [5, 6, 4, 2, 1, 3],

            '6': [6, 4, 5, 1, 3, 2]

        };

        var texturesMap = this.currentTextureMap;

        var index = faceConfigMap[1].indexOf(animation);

        for (var i = 1; i <= 6; i++) {

            var currentFaceMap = faceConfigMap[i];

            if (currentFaceMap.indexOf(num) == index) {

                var material = this.three.material;

                material.map = texturesMap[i];

            }

        }


        /* Or in stand of map we can use this function*/
        /*function diceArrayFromNumber(num){

         var arr = [num];

         for(var i = 0; i < 2; i++){

         arr[i+1] = next(arr[i]);
         arr[i+3] = 7 - arr[i];

         }

         arr[5] = 7 - arr[2];


         function next(num){

         return ( ( num % 3 ) + 1 ) % 6 + ( 3 * parseInt( num / 3.5 ) );

         }

         return arr;

         }*/

    };

    Dice.prototype.setCurrentTextureMap = function(color){

        color = color || '0';

        this.color = color;

        var colorMap = {

            '0': 'white',

            '1': 'black',

            '2': 'red'
        };

        var texturesMap = this.texturesMap;

        this.currentTextureMap = texturesMap[colorMap[color]];

    };

    Dice.prototype.setNumber1 = function(animation){

        this.setNumber(1, animation);

    };

    Dice.prototype.setNumber2 = function(animation){

        this.setNumber(2, animation);

    };

    Dice.prototype.setNumber3 = function(animation){

        this.setNumber(3, animation);

    };

    Dice.prototype.setNumber4 = function(animation){

        this.setNumber(4, animation);

    };

    Dice.prototype.setNumber5 = function(animation){

        this.setNumber(5, animation);

    };

    Dice.prototype.setNumber6 = function(animation){

        this.setNumber(6, animation);

    };

    /* Animations */

    Dice.prototype.setDumpedAnimation = function(animation){

        this.dumpedAnimation = animation;

    };

    Dice.prototype.playDumpAnimation = function(i, rollType){

        this.three.visible = true;

        var dump = this.dumpedAnimation;

        var dumpPosition = dump.position[i];

        var dumpRotation = dump.rotation[i];

        if (!dumpPosition) return false;
        if (!dumpRotation) return false;

        if(!this.manager.isAnimated){

            dumpPosition = dump.position[dump.position.length - 1];
            dumpRotation = dump.rotation[dump.rotation.length - 1];

        }

        var positionVec3 = new THREE.Vector3();
        var rotationVec3 = new THREE.Vector3();

        var magicNumber = -0.38;
        var z = this.startPosition.z;

        positionVec3.copy(dumpPosition);
        positionVec3.y -= 0.02;
        rotationVec3.copy(dumpRotation);

        switch(rollType){

            case 1: {

                rotationVec3.copy(dumpRotation).multiplyScalar(-1);
                positionVec3.x = -positionVec3.x;
                positionVec3.z -= (z + magicNumber);

                break;

            }

            case 2: {

                positionVec3.z -= (z + magicNumber);
                break;

            }

            case 0: {

                if(this.diceType == 1){

                    rotationVec3.copy(dumpRotation).multiplyScalar(-1);
                    positionVec3.x = -positionVec3.x;
                    positionVec3.z -= (z + magicNumber);

                }

                break;

            }

            default : break;

        }


        positionVec3.y -= 0.02;

        this.three.position.copy(positionVec3);

        this.three.rotation.x = rotationVec3.x;
        this.three.rotation.y = rotationVec3.y;
        this.three.rotation.z = rotationVec3.z;

        return true;

    };

    Backgammon3DBoard.Dice = Dice;

})();

(function(){


    /* Dice Manager */

    var DiceManager = function(managerscene, params, modelsPath, callback){

        this.init.apply(this, arguments);

    };

    DiceManager.prototype.initProperties = function() {

        this.dices                  = [];
        this.animations             = [];
        this.ANIMATION_FILE_ARRAY   = [];

        this.scene                  = null;
        this.audio                  = null;
        this.params                 = null;
        this.modelsPath             = null;
        this.diceGeometry           = null;
        this.animationIndex         = null;
        this.ANIMATIONS_PATH        = null;
        this.DICE_TEXTURES_PATH     = null;
        this.isColorsSwitched       = null;


    };

    DiceManager.prototype.init = function ( manager, params, modelsPath, animations ) {

        this.initProperties();      

        var thisParams = { mass: 0.3, diceParams: {x: .2, y: .2, z: .2 } };

        this.manager = manager;
        this.scene = manager.scene;
        this.dices = [];
        this.diceGeometry = null;
        this.params = params || thisParams;
        this.animationIndex = -1;
        this.isAnimationFromRight = false;

        this.modelsPath = modelsPath;

        this.ANIMATIONS_PATH     = this.modelsPath.animationsPath;
        this.DICE_TEXTURES_PATH  = this.modelsPath.texturesPath;
        this.ANIMATION_FILE_ARRAY  = [
            '0.json',
            '1.json'
        ];

        //this.audio = new Audio(this.modelsPath +'newScene/1.mp3');

        this.initDiceGeometry();
        this.initAnimations(animations);


    };

    DiceManager.prototype.createDice = function(diceType) {

        return new Backgammon3DBoard.Dice( this, { three: this.createTHREE(null) }, diceType, this.modelsPath );

    };

    DiceManager.prototype.createDices = function() {

        this.dices.push(this.createDice(1));
        this.dices.push(this.createDice(2));

    };


    DiceManager.prototype.initAnimations = function(animations) {

        this.animations = animations

    };



    DiceManager.prototype.initDiceGeometry = function() {

        var scene = this.scene;

        var mesh = scene.getObjectByName('Dice_01') || scene.children[0];

        this.diceGeometry = mesh.geometry;

        this.createDices();
        this.addToScene();

        scene.remove(mesh);

    };

    DiceManager.prototype.createTHREE = function(params) {

        var self = this;

        var _params = params || this.params;
        var diceParams = _params.diceParams;

        var x = diceParams.x * 2;
        var y = diceParams.y * 2;
        var z = diceParams.z * 2;

        var dice = {};

        if( this.diceGeometry ){

            return createDiceFromGeometry();

        }

        function createDiceFromGeometry(){

            var geometry = self.diceGeometry;
            var scaleIndex = diceParams.x / 3.2;
            self.scaleIndex = scaleIndex;

            if(!geometry) return;

            geometry.computeVertexNormals();

            var diceMaterial = new THREE.MeshPhongMaterial();
                diceMaterial.map = THREE.ImageUtils.loadTexture(self.DICE_TEXTURES_PATH + '1.png');
                diceMaterial.combine = THREE.MultiplyOperation;
                diceMaterial.shininess = 50;



            var dice = new THREE.Mesh( geometry, diceMaterial);
                dice.castShadow = true;
                dice.receiveShadow = true;
                dice.name = 'dice';
                dice.scale.set(scaleIndex, scaleIndex, scaleIndex);
                dice.visible = false;

            return dice;

        }

        return dice;

    };

    DiceManager.prototype.update = function(delta) {

        var dice1 = this.dices[0], dice2 = this.dices[1];

        if(!dice1 || !dice2) return;

        if(dice1.three && dice2.three && dice1.three.mesh && dice2.three.mesh) {

            dice1.three = dice1.three.mesh;
            dice2.three = dice2.three.mesh;

        }

        if(dice1 && dice2 && dice1.three.material && dice2.three.material) {

            this.startAnimationHandler(delta);

        }

    };

    DiceManager.prototype.startAnimationHandler = function(delta) {

        var dice1 = this.dices[0];
        var dice2 = this.dices[1];

        var rollType = this.rollType;

        if(this.animationIndex < 0) return;

        if(!dice1.playDumpAnimation(this.animationIndex, rollType) || !dice2.playDumpAnimation(this.animationIndex, rollType)) {

            this.stopAnimation();

        }

        this.animationIndex += Math.round(delta );

    };

    DiceManager.prototype.playAnimation = function(rollType, isAnimated) {

        this.isAnimated = isAnimated;

        this.rollType = rollType;

        this.animationIndex = 0;

    };

    DiceManager.prototype.stopAnimation = function() {

        this.animationIndex = -10;

    };

    DiceManager.prototype.addToScene = function() {

        var dice1 = this.dices[0],
            dice2 = this.dices[1];
        var scene = this.scene;

        scene.add(dice1.three);
        scene.add(dice2.three);

    };

    DiceManager.prototype.drop = function(num1, num2, rollType, isAnimated) {

        this.lastRoll = [num1, num2];

        var projectionObject = this.scene.getObjectByName('ProjectionObject');
            projectionObject.renderOrder = 10;

        var dice2 = this.dices[1];
        var dice1 = this.dices[0];

        dice1.three.visible = true;
        dice2.three.visible = true;

        if(num1 == 0 || num2 == 0 || !dice1 || !dice2) return;

        this.setDiceColorsFromRollType(rollType);

        dice1.setStartPosition(-10, 1, 0.2);
        dice2.setStartPosition(-10, 1, 0.6);

        dice1.setDumpedAnimation(this.animations[0]);
        dice2.setDumpedAnimation(this.animations[1]);

        dice1.drop(num1);
        dice2.drop(num2);

        this.playAnimation(rollType, isAnimated);
        this.playSound();


    };

    DiceManager.prototype.setDiceColorsFromRollType = function (rollType) {

        rollType = +rollType;

        var dice1 = this.getDice1();
        var dice2 = this.getDice2();

        var isColorSwitched = this.manager.checkerManager.isColorSwitched;

        switch (rollType){

            case 0: {
                dice1.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                dice2.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                break;
            }

            case 1: {
                dice1.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                dice2.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                break;
            }

            case 2: {
                dice1.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                dice2.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                break;
            }


        }

    };

    DiceManager.prototype.switchDiceColors = function (state) {

        var dice1 = this.getDice1();
        var dice2 = this.getDice2();

        var c1 = +!+dice1.color + "";
        var c2 = +!+dice2.color + "";

        dice1.setCurrentTextureMap(c1);
        dice2.setCurrentTextureMap(c2);

        if(!this.lastRoll) return;

        this.drop(this.lastRoll[0], this.lastRoll[1], this.rollType, false);

    };

    DiceManager.prototype.setDiceState = function(diceNum, state){

        var stateMap = [1, 0.4, 0.2];

        var dice = this.getDice(diceNum);

        dice.three.material.transparent = true;
        dice.three.material.opacity = stateMap[state];

    };

    DiceManager.prototype.getDice1 = function() {

        return this.getDice(1);

    };

    DiceManager.prototype.getDice2 = function() {

        return this.getDice(2);

    };

    DiceManager.prototype.getDice = function(num) {

        var index = num - 1;
        return this.dices[index];

    };

    DiceManager.prototype.playSound = function() {

        // CALL Back function need to be replaced


    };

    Backgammon3DBoard.DiceManager = DiceManager;

})();

(function () {

    var DoubleCubeManager = function (manager) {

        this.manager = manager;

        var scene = this.manager.scene;

        var config = this.manager.config;

        this.init(scene, config);

    };

    DoubleCubeManager.prototype.init = function(scene, config){

        this.initProperties();

        this.scene = scene;

        this.config = config;

        this.initPositionMap();

        this.initPoints();

        this.initResetParams();

        this.initCube();

        this.addToScene();

        this.initMovementManager();

        this.initDoubleCubePicker();

        this.checkDoubleCubeState();

    };

    DoubleCubeManager.prototype.initProperties = function () {

        this.scene       = null;

        this.config      = null;

        this.cube        = null;

        this.resetParams = null;

        this.positionMap = null;

        this.movementManager = null;

    };

    DoubleCubeManager.prototype.initCube = function () {

        var config = this.config.double_cube;

        var texturesPath = config.texturesPath;

        var scene = this.scene;

        var diceName = 'dice';

        var dice = scene.getObjectByName(diceName);

        var geometry = dice.geometry.clone();

        var material = new THREE.MeshPhongMaterial();

        var texture = THREE.ImageUtils.loadTexture( texturesPath + 'cube_black_64.png');
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.anisotropy = this.manager.renderer.getMaxAnisotropy();

        material.map = texture;

        var s = 0.08;
        var cube = new THREE.Mesh(geometry, material);
            cube.scale.set(s, s, s);
            cube.name = config.name;
            cube.index = config.name;
            cube.castShadow = true;
            cube.receiveShadow = true;
            cube.readOnly = true;
            cube.currentNumber = 64;
            cube.exists = true;


        this.cube = cube;

        this.reset();

    };

    DoubleCubeManager.prototype.setReadOnly = function (state) {

        var cube = this.cube;
            cube.readOnly = state;

    };

    DoubleCubeManager.prototype.reset = function () {

        var cube = this.cube;

        var resetParams = this.resetParams;

        cube.position.copy(resetParams.position);
        cube.rotation.copy(resetParams.rotation);

    };

    DoubleCubeManager.prototype.initResetParams = function () {

        var positionMap = this.positionMap;

        var defaultRotation = new THREE.Euler(0, 0, 0);

        this.resetParams = {

            position: positionMap[0][0].clone(),
            rotation: defaultRotation.clone()

        };

    };

    DoubleCubeManager.prototype.addToScene = function () {

        var scene = this.scene;

        var cube = this.cube;

        scene.add(cube);

    };

    DoubleCubeManager.prototype.initMovementManager = function () {

        this.movementManager = new Backgammon3DBoard.MovementManager(this.manager);

    };

    DoubleCubeManager.prototype.initDoubleCubePicker = function() {

        this.doubleCubePicker = new Backgammon3DBoard.DoubleCubePicker(this.manager, this.positionMap);

    };

    DoubleCubeManager.prototype.initPoints = function () {

        this.points = new THREE.Object3D();

        var points = this.points;
            points.name = 'DoubleCubePoints';

        var map = this.positionMap;

        var scene = this.scene;

        for (var index in map) {

            var point = map[index];

            var pointTHREE = new THREE.Object3D();
                pointTHREE.name = 'double-cube-point';
                pointTHREE.index = index;

            points.add(pointTHREE);

        }

        scene.add(points);

    };

    DoubleCubeManager.prototype.initPositionMap = function () {

        var y = 0.23;

        var positionCenter  = new THREE.Vector3(     0, y   ,   0    );
        var positionUp      = new THREE.Vector3(     0, 0.25,  -1.97 );
        var positionDown    = new THREE.Vector3(     0, 0.25,   1.97 );
        var positionLeft    = new THREE.Vector3( -1.97, y   ,   0    );
        var positionRight   = new THREE.Vector3(  1.97, y   ,   0    );

        this.positionMap = [

            [ positionCenter ],
            [ positionUp     ],
            [ positionDown   ],
            [ positionLeft   ],
            [ positionRight  ]

        ];

        /*this.positionMap = {

            center  : positionCenter  ,
            up      : positionUp      ,
            down    : positionDown    ,
            left    : positionLeft    ,
            right   : positionRight

        }*/

    };

    DoubleCubeManager.prototype.reversePositionMap = function () {

        var positionMap = this.positionMap;

        var center  = positionMap.shift();
        var ud = positionMap.splice(0, 2);
        var lr = positionMap.splice(0, 2);

        lr = lr.reverse();
        ud = ud.reverse();

        positionMap.push(center);
        positionMap.push.apply(positionMap, ud);
        positionMap.push.apply(positionMap, lr);


    };

    DoubleCubeManager.prototype.setNumber = function (num, isAnimated) {

        var cube = this.cube;

        if(cube.currentNumber == num) return;
        if(cube.isRotating) return;

        if(num == 'same') num = cube.currentNumber;

        cube.currentNumber = num;

        var manager = this.manager;

        var movementManager = this.movementManager;

        var boardRotationState = manager.movementManager.boardRotationState;

        var rotationMap = {

            '64':  {'z':  0          , x: 0, y: boardRotationState ? -Math.PI : 0 },
            '2' :  {'z': -Math.PI / 2, x: 0, y: boardRotationState ? -Math.PI : 0 },
            '4' :  {'z':  Math.PI / 2, x: 0, y: boardRotationState ? -Math.PI : 0 },

            '8' :  {'x':  Math.PI / 2, z:       boardRotationState ?  Math.PI : 0, y: 0},
            '16':  {'x': -Math.PI / 2, z:       boardRotationState ? -Math.PI : 0, y: 0},
            '32':  {'x':  Math.PI    , z: 0, y: boardRotationState ?  Math.PI : 0 }

        };

        var currentMap = rotationMap[num];

        if(!currentMap) return;

        movementManager.rotateDoubleCube(currentMap, isAnimated);


    };

    DoubleCubeManager.prototype.setDoubleCube = function (place, value, isAnimated) {

        this.doubleCubePicker.move({to: place}, isAnimated);

        this.setNumber(value, isAnimated);


    };

    DoubleCubeManager.prototype.isDoubleCubeExist = function(state){

        state = state || 0;

        this.cube.exists = state;

        this.checkDoubleCubeState();

    };

    DoubleCubeManager.prototype.checkDoubleCubeState = function () {

        var cube = this.cube;

            cube.exists = cube.exists || false;

            cube.visible = cube.exists;

    };


    Backgammon3DBoard.DoubleCubeManager = DoubleCubeManager;


})();

(function () {

    var MovementManager = function (manager) {

        this.manager = manager;

        this.init.apply(this, arguments);

    };

    MovementManager.prototype.initProperties = function () {

        this.boardDegreeState = 1;

    };

    MovementManager.prototype.init = function () {

        this.initProperties();

    };

    MovementManager.prototype.animateCheckerMove = function (checker, toPosition, index, isAnimated) {

        var self = this;

        var from     = checker.position;
        var rotation = checker.rotation;

        checker.isMoving = true;

        var t1 = isAnimated ? 215: 0;
        var t2 = isAnimated ? 280: 0;

        switch (index) {

            case 0: new TWEEN.Tween(rotation)
                .to({x: - Math.PI, y: 0, z: 0}, t1)
                .easing(TWEEN.Easing.Exponential.Out)
                .start(); break;

            case 25: new TWEEN.Tween(rotation)
                .to({x: 0, y: 0, z: 0}, t1)
                .easing(TWEEN.Easing.Exponential.Out)
                .start(); break;

            default : {

                if(!rotation) break;

                new TWEEN.Tween(rotation)
                    .to({x: - Math.PI / 2, y: 0, z: 0}, t1)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start(); break;
            }
        }

        !checker.mouseMove &&
        new TWEEN.Tween(from)
            .to({x: toPosition.x, z: toPosition.z}, t2)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function (i) {

                var angle = i * Math.PI;
                var y = 3 * Math.sin(angle);
                y = y > 0.5 ? 0.5: y;
                y = y < toPosition.y ? toPosition.y: y;

                from.y = y;
            })
            .onComplete(function () {

                from.y = toPosition.y;
                checker.isMoving = false;
                checker.mouseMove = false;

            })
            .start();


        checker.mouseMove &&
        new TWEEN.Tween(from)
            .to(toPosition, t2)
            .easing(TWEEN.Easing.Exponential.Out)
            .onComplete(function () {

                checker.isMoving = false;
                checker.mouseMove = false;

            })
            .start();



    };

    MovementManager.prototype.rotateBoard = function (state, isAnimated) {

        if(this.boardRotationState == state) return;

        if(this.isCameraRotating) return;

        this.boardRotationState = state;

        var config = this.manager.config;

        var camera = this.manager.camera;

        var textWriter = this.manager.textWriter;

        var cameraStartY = camera.position.y;

        var lookAtVector = this.manager.cameraControls.target.clone();

        var basePosition = config.camera.position.clone();

        var time = isAnimated ? 1000 : 0;

        var self = this;

        switch(state){
            case 0: {
                camera.position.z = this.boardDegreeState ?  -basePosition.z : -0.000001;
                break;
            }
            case 1: {
                camera.position.z = this.boardDegreeState ?  basePosition.z : 0.000001;
                break;
            }
            default :{
                return;
            }
        }


        var cameraR = camera.position.z;

        var angle = {value: 0};

        var value = state > 0 ? -Math.PI : Math.PI;

        this.rotateDoubleCubeWithCamera(isAnimated);

        this.rotateCheckerNumbersWithCamera(isAnimated);

        self.animate(angle, { value: value }, time , 'Linear', 'None',

            function () {

                camera.lookAt(lookAtVector);

                self.isCameraRotating = true;

            }, function () {

                camera.position.x = cameraR * Math.sin(angle.value);
                camera.position.z = cameraR * Math.cos(angle.value);
                camera.lookAt(lookAtVector);

            }, function () {

                camera.lookAt(lookAtVector);

                self.isCameraRotating = false;

            });

        isAnimated && self.animate(camera.position, {y: 22}, time / 2, 'Sinusoidal', "InOut",

            function () {

                camera.lookAt(lookAtVector);

            }, function () {

                camera.lookAt(lookAtVector);

            }, function () {

                self.animate(camera.position, {y: cameraStartY}, time / 2, 'Sinusoidal', "In",

                    function () {

                        camera.lookAt(lookAtVector);

                    }, function () {

                        camera.lookAt(lookAtVector);

                    }, function () {

                        camera.lookAt(lookAtVector);

                    });


            });

        textWriter.updatePositions();


    };

    MovementManager.prototype.setBoardDegreeState = function(state, isAnimated) {

        if(this.boardDegreeState == state) return;
        if(this.isCameraRotating) return;

        this.boardDegreeState = state;

        var manager = this.manager;

        var camera = this.manager.camera;

        var cameraBasePosition = this.manager.config.camera.position.clone();

        var lookAtVector = this.manager.cameraControls.target;

        var boardRotationState = this.boardRotationState;

        var textWriter = this.manager.textWriter;

            textWriter.updatePositions();

        var degree;

        var configZoom = manager.config.camera.zoom;

        var zoom;

        switch (state) {

            case 0: degree = boardRotationState ? -0.000001 : 0.000001; zoom = 1.12/*22*/; break;
            case 1: degree = boardRotationState ? -cameraBasePosition.z : cameraBasePosition.z; zoom = configZoom; break;

            default: return;

        }

        var time = isAnimated > 0 ? 600 : 0;

        this.animate(camera.position, {z: degree, x: 0}, time, 'Linear', 'None', function () {

            camera.lookAt(lookAtVector);

        }, function () {

            camera.lookAt(lookAtVector);

        }, function () {

            camera.lookAt(lookAtVector);

        });

        this.animate(camera, {zoom: zoom}, time, 'Linear', 'None', function () {

            camera.updateProjectionMatrix();

        }, function () {

            camera.updateProjectionMatrix();

        }, function () {

            camera.updateProjectionMatrix();

        });

    };

    MovementManager.prototype.animate = function (from, to, time, anim1, anim2, onStart, onUpdate, onComplete) {

        new TWEEN.Tween(from)
            .to(to, time)
            .easing(TWEEN.Easing[anim1][anim2])
            .onStart(function(){

                onStart && onStart();

            })
            .onUpdate(function () {

                onUpdate && onUpdate();

            })
            .onComplete(function () {

                onComplete && onComplete();

            })
            .start();

    };

    MovementManager.prototype.update = function (delta) {

        //this.isCameraRotating && this.rotateCamera(delta);

    };

    MovementManager.prototype.rotateDoubleCubeWithCamera = function (isAnimated) {


        var doubleCubeManager = this.manager.doubleCubeManager;
            doubleCubeManager.setNumber('same', isAnimated);

    };


    MovementManager.prototype.moveDoubleCubeUpDown = function (isAnimated) {

        if(!isAnimated) return;

        var self = this;

        var doubleCube = this.manager.doubleCubeManager.cube;

        var moveUpVector = doubleCube.position.clone();
            moveUpVector.y = 0.5;

        var moveDownVector = doubleCube.position.clone();
            moveDownVector.y = 0.23;

        this.animate(doubleCube.position, {y: moveUpVector.y}, 500, 'Linear', 'None', null, null, function () {

            self.animate(doubleCube.position, {y: moveDownVector.y}, 500, 'Linear', 'None');

        });

    };

    MovementManager.prototype.rotateDoubleCube = function (rotation, isAnimated) {

        var doubleCube = this.manager.doubleCubeManager.cube;

        var time = isAnimated ? 1000 : 0;

        this.animate(doubleCube.rotation, rotation, time, 'Linear', 'None' ,function() {

            doubleCube.isRotating = true;

        }, null, function () {

            doubleCube.isRotating = false;

        });

        this.moveDoubleCubeUpDown(isAnimated);

    };



    MovementManager.prototype.animateDoubleCubeMove = function (doubleCube, toPosition, isAnimated) {

        var self = this;

        var from = doubleCube.position;

        var t1 = isAnimated ? 400 : 0;
        var t2 = isAnimated ? 50 : 0;

        self.animate(from, {y: 0.5}, t2, 'Linear', 'None', null, null, function () {

            self.animate(from, {x: toPosition.x, z: toPosition.z}, t1, 'Linear', 'None', null, null, function () {

                self.animate(from, {y: 0.23}, t2, 'Linear', 'None');

            });

        });



    };

    MovementManager.prototype.rotateCheckerNumbersWithCamera = function (isAnimated) {

        var self = this;

        var time = isAnimated ? 1000 : 0;

        var checkerNumbers = this.manager.textWriter.points;

        var angle = this.boardRotationState ? -Math.PI : 0;

        checkerNumbers.traverse(function (child) {

            if(child instanceof THREE.Mesh) {

                self.animate(child.rotation, {z:angle}, time, 'Linear', 'None');

            }

        });

    };

    Backgammon3DBoard.MovementManager = MovementManager;

})();

(function () {


    var PlatformDetector = function (domContainer, eventSource, config) {


        this.init.apply(this, arguments);

    };

    PlatformDetector.prototype.init = function (domContainer, eventSource, config) {

        this.initProperties(domContainer, eventSource, config);

        this.detect();

        this.initRenderer();

        this.initCanvas();

        this.connectEvents();

    };

    PlatformDetector.prototype.initProperties = function (domContainer, eventSource, config) {

        this.domContainer = domContainer;

        this.eventSource = eventSource;

        this.config = config;

        this.isWeb     = null;

        this.isMobile  = null;

        this.canvas = null;

        this.mouseDowns = [];

        this.mouseUps   = [];

        this.mouseMoves = [];


    };

    PlatformDetector.prototype.detect = function () {

        try {

            this.isWeb = HTMLDivElement !== undefined;

        }catch(e){

            this.isWeb = false;

        }

        this.isMobile = this.mobileCheck();

    };

    PlatformDetector.prototype.mobileCheck = function() {

        var check = false;

        try{

            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator && navigator.userAgent || navigator && navigator.vendor|| window && window.opera);

        }catch(e){

            console.log("NO Navigator");

        }


        return check;
    };


    PlatformDetector.prototype.setCoordsFromMobileEvent = function(event) {

        if(!this.isMobile) return;

        var touch = event.touches && event.touches[0];

        var layerX = touch && touch.clientX;
        var layerY = touch && touch.clientY;

        event.layerX = layerX;
        event.layerY = layerY;

    };

    PlatformDetector.prototype.initRenderer = function () {

        var isWeb = this.isWeb;

        if(isWeb){
            this.initRendererForWeb();
            console.log("IN WEB");
            if(this.isMobile) console.log("IN MOBILE");
        }
        else{
            this.initRendererForQT();
            console.log("IN QT");
        }

        return this.renderer;

    };

    PlatformDetector.prototype.initRendererForWeb = function () {

        var domContainer = this.domContainer;

        var WIDTH = domContainer.clientWidth;

        var HEIGHT = domContainer.clientHeight;

        var config = this.config.renderer;

        var renderer = new THREE.WebGLRenderer({
            antialias:  config.antialias,
            alpha:      config.alpha
        });

        renderer.shadowMap.enabled  = this.isMobile ? false : config.shadowMap.enabled;
        renderer.shadowMap.soft     = this.isMobile ? false : config.shadowMap.soft;

        renderer.setSize(WIDTH, HEIGHT);

        var domElement = renderer.domElement;
        domElement.oncontextmenu = function(){ return false; };

        domContainer.appendChild(renderer.domElement);

        this.renderer = renderer;

    };

    //PlatformDetector.prototype.initRendererForWeb = function () {
    //
    //    var domContainer = this.domContainer;
    //
    //    var WIDTH = domContainer.clientWidth;
    //
    //    var HEIGHT = domContainer.clientHeight;
    //
    //    var config = this.config.renderer;
    //
    //    var canvas = document.createElement('canvas');
    //
    //    var gl = canvas.getContext('webgl2');
    //
    //    var renderer = new THREE.WebGLRenderer({
    //        canvas: canvas,
    //        context: gl,
    //        antialias: config.antialias,
    //        alpha: config.alpha
    //    });
    //
    //    renderer.shadowMap.enabled = config.shadowMap.enabled;
    //    renderer.shadowMap.soft = config.shadowMap.soft;
    //
    //    renderer.setSize(WIDTH, HEIGHT);
    //
    //    domContainer.appendChild(renderer.domElement);
    //
    //    this.renderer = renderer;
    //
    //};

    PlatformDetector.prototype.initRendererForQT = function () {

        var canvas = this.domContainer;

        var config = this.config.renderer;

        var renderer = new THREE.Canvas3DRenderer({
            antialias:  config.antialias,
            alpha:      config.alpha,
            canvas:     canvas,
            devicePixelRatio: canvas.devicePixelRatio
        });


        renderer.setSize(canvas.width, canvas.height);
        //renderer.setClearColor("red");
        renderer.shadowMapEnabled = config.shadowMap.enabled;
        renderer.shadowMapSoft = config.shadowMap.soft;

        this.renderer = renderer;

    };

    PlatformDetector.prototype.addMouseDownFunction = function (mouseDownFunction) {

        if(mouseDownFunction){
            this.mouseDowns.push(mouseDownFunction);
        }

    };

    PlatformDetector.prototype.addMouseMoveFunction = function (mouseMoveFunction) {

        if(mouseMoveFunction){
            this.mouseMoves.push(mouseMoveFunction);
        }

    };

    PlatformDetector.prototype.addMouseUpFunction = function (mouseUpFunction) {

        if(mouseUpFunction){
            this.mouseUps.push(mouseUpFunction);
        }

    };

    PlatformDetector.prototype.connectEvents = function () {

        this.connectMouseDown();
        this.connectMouseMove();
        this.connectMouseUp();

    };

    PlatformDetector.prototype.removeEvents = function () {

        this.removeMouseEvents();
        this.removeResizeEvent();

    };

    PlatformDetector.prototype.removeMouseEvents = function(){

        if(!this.isWeb && !this.isMobile) return;

        var mouseMoves = this.mouseMoves;

        var canvas = this.renderer.domElement;

        var eventMap = {
            '0': "touchstart",
            '1': "touchmove",
            '2': "touchend"
        };

        mouseMoves.forEach(function (mm, i) {

            canvas.removeEventListener(eventMap[i], mm, false);

        });
    };

    PlatformDetector.prototype.removeResizeEvent = function () {

        if(!this.isWeb && !this.isMobile) return;

        window.removeEventListener('resize', this.resizeFunction, false);


    };

    PlatformDetector.prototype.connectMouseDown = function () {

        if( this.isMouseDownConnected ) return;

        var self = this;

        var mouseDown = function (event) {

            //event.preventDefault  && event.preventDefault();
            //event.stopPropagation && event.stopPropagation();

            self.setCoordsFromMobileEvent(event);

            for(var i = 0; i < self.mouseDowns.length; i ++) {

                var func = self.mouseDowns[i];
                func(event);
                //console.log("Down: ", event);

            }

        };

        if(this.isWeb){

            var canvas = this.renderer.domElement;

            if(this.isMobile){

                canvas.addEventListener("touchstart", mouseDown, false);
                return;

            }

            canvas.onmousedown = mouseDown;

        } else {

            var eventSource = this.eventSource;

            eventSource.mouseDown.connect(mouseDown);

        }

        this.isMouseDownConnected = true;

    };

    PlatformDetector.prototype.connectMouseMove = function () {

        if(this.isMouseMoveConnected) return;

        var self = this;

        var mouseMove = function (event) {

            if(self.isMobile) {
                event.preventDefault  && event.preventDefault();
                event.stopPropagation && event.stopPropagation();
            }

            self.setCoordsFromMobileEvent(event);

            for(var i = 0; i < self.mouseDowns.length; i ++) {

                var func = self.mouseMoves[i];
                if(self.isWeb)event.preventDefault();
                func(event);

            }

        };

        if(this.isWeb){

            var canvas = this.renderer.domElement;

            if(this.isMobile){
                canvas.addEventListener("touchmove", mouseMove, false);
                return;
            }

            canvas.onmousemove = mouseMove;

        } else {

            var eventSource = this.eventSource;

            eventSource.mouseMove.connect(mouseMove);
        }

        this.isMouseMoveConnected = true;

    };

    PlatformDetector.prototype.connectMouseUp = function () {

        if(this.isMouseUpConnected) return;

        var self = this;

        var mouseUp = function (event) {

            //event.preventDefault  && event.preventDefault();
            //event.stopPropagation && event.stopPropagation();

            self.setCoordsFromMobileEvent(event);

            for(var i = 0; i < self.mouseDowns.length; i ++) {

                var func = self.mouseUps[i];
                func(event);
                func(event);

            }

        };

        if(this.isWeb){

            var canvas = this.renderer.domElement;

            if(this.isMobile){

                canvas.addEventListener("touchend", mouseUp, false);
                return;

            }

            canvas.onmouseup = mouseUp;

        } else {

            var eventSource = this.eventSource;

            eventSource.mouseUp.connect(mouseUp);
        }

        this.isMouseUpConnected = true;

    };

    PlatformDetector.prototype.connectResize = function (resizeFunction) {

        var domContainer = this.domContainer;

        this.resizeFunction = resizeFunction;

        if(this.isWeb){

            window.addEventListener('resize', resizeFunction, false)
            ;//onresize = resizeFunction;

        }else{

            domContainer.resize_GL.connect(resizeFunction);

        }

    };

    PlatformDetector.prototype.initCanvas = function(){


        if(this.isWeb){

            this.canvas = this.renderer.domElement;

        } else {

            this.canvas = this.domContainer;

        }

    };

    PlatformDetector.prototype.getCanvas = function(){

        return this.canvas;

    };

    PlatformDetector.prototype.getRenderer = function(){

        return this.renderer;

    };

    Backgammon3DBoard.PlatformDetector = PlatformDetector;

})();



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

(function(){

    var Picker = function () {

    };

    Picker.prototype = {

        mouse               : new THREE.Vector2(),

        raycaster           : new THREE.Raycaster(),

        selectableObjects   : [],

        projectionObject    : null,

        intersectProjection : null,

        intersectObject     : null,

        clickStarted        : Date.now(),

        timeInterval        : 0,


        initParent: function (manager) {

            this.scene              = manager.scene;

            this.camera             = manager.camera;

            this.cameraControls     = manager.cameraControls;

            this.platformDetector   = manager.platformDetector;

            this.canvas             = this.platformDetector.getCanvas();

            this.domContainer       = this.platformDetector.domContainer;

            this.initProjectionObject();

            this.initEvents();

        },

        initProjectionObject: function () {

            var scene = this.scene;

            this.projectionObject = scene.getObjectByName('ProjectionObject');

        },

        initEvents: function () {

            this.addMouseDownEvent();
            this.addMouseMoveEvent();
            this.addMouseUpEvent();

        },

        addMouseDownEvent: function () {

            var self = this;

            var manager = this.manager;

            manager.needRendering = true;

            var mouseDown = function (event) {

                var manager = self.manager;
                    manager.needRendering = true;

                self.createWebButton(event);

                self.mouseSet(event);

                self.raycaster.setFromCamera(self.mouse, self.camera);

                var intersects = self.raycaster.intersectObjects(self.selectableObjects, true);

                self.intersectObject = intersects[0];

                if(self.intersectObject){ self.cameraControls.enabled = false; }

                if(self.mouseDownCallBack) self.mouseDownCallBack(event);

            };

            this.platformDetector.addMouseDownFunction(mouseDown);

        },

        addMouseMoveEvent: function () {

            var self = this;



            var onMouseMove = function (event) {

                var manager = self.manager;
                    manager.needRendering = true;

                self.createWebButton(event);

                self.mouseSet(event);

                self.raycaster.setFromCamera(self.mouse, self.camera);

                var intersects = self.raycaster.intersectObject(self.projectionObject, true);

                self.intersectProjection = intersects[0];

                if(self.mouseMoveCallBack) self.mouseMoveCallBack(event);

            };

            this.platformDetector.addMouseMoveFunction(onMouseMove);

        },

        addMouseUpEvent: function () {

            var self = this;

            var onMouseUp = function (event) {

                var manager = self.manager;
                    manager.needRendering = false;

                self.createWebButton(event);

                if(self.mouseUpCallBack) self.mouseUpCallBack(event);

                self.intersectObject = null;

                self.cameraControls.enabled = true;

            };

            this.platformDetector.addMouseUpFunction(onMouseUp);

        },

        mouseSet: function(event){

            var canvas = this.canvas;

            this.mouse.set(( event.layerX / canvas.width) * 2 - 1, -( event.layerY / canvas.height ) * 2 + 1);

        },

        createWebButton: function(event){

            if(event.webButton === undefined)  {

                event.webButton = event.button || 0;

            }

        },

        getPlaceInfoFromMesh : function(mesh) {

            if(!mesh) return;

            var intersectObject = mesh;

            var map = this.positionMap;

            var diff = 100;

            var info = {
                position: null,
                index: null
            };

            var from = 0;
            var to = 27;

            for (var i = from; i <= to; i++) {

                var point = map[i];

                if(!point) break;

                point.forEach(function (_position) {

                    var selX = intersectObject.position.x;
                    var selZ = intersectObject.position.z;
                    var x = _position.x;
                    var z = _position.z;

                    var xDiff = x - selX;
                    var zDiff = z - selZ;

                    var _diff = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(zDiff, 2));

                    if (_diff < diff) {

                        diff = _diff;
                        info.index = i;
                        info.position = _position;

                    }

                });

            }

            return info;

        }

    };

    Backgammon3DBoard.Picker = Picker;

})();


(function () {

    var DoubleCubePicker = function (manager, positionMap) {

        this.manager = manager;

        this.positionMap = positionMap;

        this.init.apply(this, arguments);

    };

    DoubleCubePicker.prototype = new Backgammon3DBoard.Picker();

    DoubleCubePicker.prototype.constructor = DoubleCubePicker;

    DoubleCubePicker.prototype.init = function (manager) {


        this.scene = manager.scene;

        this.cube = manager.scene.getObjectByName('double_cube');

        this.initParent(this.manager);

        this.initProperties();

        this.initMovementManager();

    };

    DoubleCubePicker.prototype.initMovementManager = function () {

        this.movementManager = new Backgammon3DBoard.MovementManager();

    };

    DoubleCubePicker.prototype.initProperties = function () {

        var scene = this.scene;

        this.selectableObjects = [ scene.getObjectByName('double_cube') ];

    };

    DoubleCubePicker.prototype.mouseMoveCallBack = function () {

        var self = this;

        var selectedCube = self.selectedCube;

        var intersect = self.intersectProjection;

        var cameraControls = this.manager.cameraControls;

        if (!selectedCube || !intersect) return;

        selectedCube.object.position.x = intersect.point.x;
        selectedCube.object.position.y = 0.5;
        selectedCube.object.position.z = intersect.point.z;

        cameraControls.enabled = false;
    };

    DoubleCubePicker.prototype.mouseDownCallBack = function () {

        var self = this;

        var intersectObject = self.intersectObject;

        if (intersectObject) {

            if(intersectObject.object.readOnly) return;

            this.selectedCube = intersectObject;

        }

    };

    DoubleCubePicker.prototype.mouseUpCallBack = function () {

        if(!this.selectedCube ) return;

        var placeInfo = this.getPlaceInfoFromMesh(this.selectedCube.object);

        this.doubleCubeMoved(placeInfo.index);

        this.playSound();

        this.selectedCube = null;

    };

    DoubleCubePicker.prototype.doubleCubeMoved = function (to) {

        // CALLBACK Function Need to override

        this.move({to: to}, true);

    };

    DoubleCubePicker.prototype.move = function (moveObject, isAnimated) {

        if(!moveObject) return;

        if(!(moveObject instanceof Object)) moveObject = {to: moveObject};

        var indexTo = moveObject.to;

        var positionMap = this.positionMap;

        var cube = this.cube;

        var positionTo = positionMap[indexTo] && positionMap[indexTo][0];

        if(!positionTo) return;

        cube.mapIndex = indexTo;

        this.movementManager.animateDoubleCubeMove(cube, positionTo, isAnimated);


    };

    DoubleCubePicker.prototype.playSound = function () {

        //CALL Back function needs to be overridden

    };

    Backgammon3DBoard.DoubleCubePicker = DoubleCubePicker;

})();

(function () {

    var CheckerPicker = function (manager, positionMap) {

        this.manager = manager;

        this.positionMap = positionMap;

        this.mouseMoveStarted = false;

        this.isMouseDown = false;

        var scene = this.manager.scene;

        var camera = this.manager.camera;

        var platformDetector = this.manager.platformDetector;

        this.init(scene, camera, platformDetector, positionMap);

    };

    CheckerPicker.prototype = Object.create( Backgammon3DBoard.Picker.prototype );

    CheckerPicker.prototype.constructor = CheckerPicker;


    CheckerPicker.prototype.init = function (scene, camera, platformDetector) {

        this.initParent(this.manager);

        this.initProperties();

        this.initMovementManager();

    };

    CheckerPicker.prototype.initProperties = function () {

        var scene = this.scene;

        this.selectableObjects = scene.getObjectByName('Points').children;

        this.lastMouseCoords = new THREE.Vector2();

    };

    CheckerPicker.prototype.initMovementManager = function () {

        this.movementManager = new Backgammon3DBoard.MovementManager();

    };

    CheckerPicker.prototype.mouseMoveCallBack = function (event) {

        this.mouseMoveStarted = this.mouseMoveStarted ? this.mouseMoveStarted : !this.mouseMoveStarted;

        var condition = this.isMouseInsideCircle();

        if(condition && !this.isCheckerMoveStarted) return;

        if(!this.selectedChecker) return;

        if(event.webButton !== 0 || event.buttons > 1) return;

        var self = this;

        var selectedChecker = self.selectedChecker;

        var intersect = self.intersectProjection;

        if (!intersect) return;

        self.selectedChecker.object.mouseMove = true;

        selectedChecker.object.position.x = intersect.point.x;
        selectedChecker.object.position.y = 0.5;
        selectedChecker.object.position.z = intersect.point.z;

        this.mouseMoveStarted && !this.isCheckerMoveStarted && this.mouseMoveStart();

        this.isCheckerMoveStarted = true;

    };

    CheckerPicker.prototype.mouseMoveStart = function () {

        var selectedChecker = this.selectedChecker;

        selectedChecker.object.rotation.x = - Math.PI / 2;

        this.manager.textWriter.updateCheckersCounts();

    };

    CheckerPicker.prototype.mouseDownCallBack = function (event) {

        this.lastMouseCoords = this.mouse.clone();

        var self = this;

        var scene = this.manager.scene;

        this.isMouseDown = true;

        var intersectObject = self.intersectObject;                

        if (intersectObject) {

            var index = intersectObject.object.index;

            var l = self.selectableObjects[index].children.length;

            var selectedChecker = {object: self.selectableObjects[index].children[l - 1]};

            if(selectedChecker.object.readOnly) return;
            if(selectedChecker.object.isMoving) return;

            self.selectedChecker = selectedChecker;

            self.platformDetector.isMobile && (window.navigator.vibrate = window.navigator.vibrate || function(){});
            self.platformDetector.isMobile && window.navigator.vibrate(10);

            var indexOf = self.selectableObjects[index].children.indexOf(self.selectedChecker.object);

            var o = self.selectableObjects[index].children.splice(indexOf, 1)[0];

            self.selectableObjects[index].children.push(o);

            self.manager.gameHelper && self.manager.gameHelper.turnLightOnFromMesh(selectedChecker.object);

        }


    };

    CheckerPicker.prototype.allPossibleSteps = function (index) {

        //need To Override

        var self = this;

        setTimeout(function () {

            self.move({from: index, to: index}, true);

        },200);

    };

    CheckerPicker.prototype.maxStep = function (index) {

        //need To Override

        var self = this;

        setTimeout(function () {

            self.move({from: index, to: index+2}, true);

        },200);

    };

    CheckerPicker.prototype.minStep = function (index) {

        //need To Override

        var self = this;

        setTimeout(function () {

            self.move({from: index, to: index-2}, true);

        },200);

    };

    CheckerPicker.prototype.resetEventsParams = function () {

        this.isMouseDown = false;

        this.selectedChecker = null;

        this.mouseMoveStarted = false;

        this.isCheckerMoveStarted = false;

    };

    CheckerPicker.prototype.mouseUpCallBack = function (event) {

        var self = this;

        var selectedChecker = self.selectedChecker;

        self.manager.gameHelper && self.manager.gameHelper.turnOffAllLights();

        if (!selectedChecker) return;

        var placeInfo = self.getPlaceInfoFromMesh(selectedChecker.object);

        var indexTo = placeInfo.index;

        var indexFrom = selectedChecker.object.index;

        var moveObject = {from: indexFrom, to: indexTo};

        var diceManager = this.manager.diceManager;
    
		if(event.webButton === 1){

			self.resetEventsParams();

			self.allPossibleSteps(indexFrom);

			return;
		}

		if(event.webButton === 2){

			self.resetEventsParams();

			self.minStep(indexFrom);

			return;
		}

		var condition = self.isMouseInsideCircle();
		
		if( condition && !self.isCheckerMoveStarted ){

			self.resetEventsParams();

			self.maxStep(indexFrom);

			this.manager.textWriter.updateCheckersCounts();

			return;

		}       

        self.resetEventsParams();

        self.moved(moveObject.from, moveObject.to);
        self.playSound();


    };

    CheckerPicker.prototype.isMouseInsideCircle = function () {

        var r = 0.02;
        var x1 = this.mouse.x;
        var x0 = this.lastMouseCoords.x;
        var y1 = this.mouse.y;
        var y0 = this.lastMouseCoords.y;
        return Math.sqrt(Math.pow((x1-x0),2) + Math.pow((y1-y0),2)) < r;

    };

    CheckerPicker.prototype.moveCollection = function(moveCollection, isAnimated){

        while(moveCollection.length) {

            var moveArray = moveCollection.splice(0,2);

            var moveObject = {from: moveArray[0], to: moveArray[1]};

            this.move(moveObject, isAnimated);

        }

    };

    CheckerPicker.prototype.move = function(moveObject, isAnimated) {

        var indexFrom = moveObject.from;
        var indexTo   = moveObject.to;

        var isSame = indexFrom == indexTo;

        var checker = this.selectedChecker && this.selectedChecker.object || this.getCheckerFromIndex(indexFrom);

        this.resetEventsParams();

        if (!checker) return;

        var positionTo = this.getPositionFromIndex(indexTo, isSame);

        if(!positionTo) return;

        this.replaceChecker(indexFrom, indexTo);

        this.animateMove(checker, positionTo, indexTo, isAnimated);

        var textWriter = this.manager.textWriter;

        textWriter.updateCheckersCounts();


    };

    CheckerPicker.prototype.moved = function(f,t){

        //this function is a callback

        this.moveCollection([f, t], true);

    };

    CheckerPicker.prototype.replaceChecker = function(from, to) {

        var pointFrom = this.selectableObjects[from];
        var pointFromCheckers = pointFrom.children;

        var pointTo = this.selectableObjects[to];
        var pointToCheckers = pointTo.children;

        var checker = this.getCheckerFromIndex(from);
            checker.index = to;

        var checkerIndex = pointFromCheckers.indexOf(checker);

        pointFromCheckers.splice(checkerIndex, 1);
        pointToCheckers.push(checker);

    };

    CheckerPicker.prototype.animateMove = function(checker, toPosition, index, isAnimated) {

        this.movementManager.animateCheckerMove.apply(this, arguments);

    };

    CheckerPicker.prototype.getCheckerFromIndex = function(index) {

        var checkers = this.selectableObjects[index].children;

        function last(arr) {

            return arr[arr.length - 1];

        }

        return last(checkers);

    };

    CheckerPicker.prototype.getPositionFromIndex = function(index, isSame) {

        var map = this.positionMap;

        var checkers = this.selectableObjects[index] && this.selectableObjects[index].children;

        if(!checkers) return;

        var position = isSame
                    ? map[index][checkers.length - 1]
                    : map[index][checkers.length];

        return position;

    };

    CheckerPicker.prototype.playSound = function() {

        //var audio = new Audio( this.modelsPath + '/newScene/2.mp3');

        //audio.stop();
        //audio.play();

    };

    Backgammon3DBoard.CheckerPicker = CheckerPicker;

})();

(function () {

    var TextWriter = function (checkerManager) {

        this.init.apply(this, arguments);

    };

    TextWriter.prototype.initProperties = function () {

        this.manager = null;

        this.sprite  = null;

        this.numbers = [];

    };

    TextWriter.prototype.init = function (checkerManager) {

        this.initProperties();

        this.manager = checkerManager;

        this.initPositionMap();

        this.initPoints();

        this.initObjects();

        this.addToScene();

    };

    TextWriter.prototype.initPositionMap = function () {

        var pips1 = this.manager.checkerManager.positionMap[0][0].clone();
        var pips2 = this.manager.checkerManager.positionMap[25][0].clone();

        pips1.z = pips1.z > 0 ? pips1.z + 0.6 : pips1 - 0.6;
        pips2.z = pips2.z < 0 ? pips2.z - 0.6 : pips2 + 0.6;

        this.pipsMap = {
            pips1: pips1,
            pips2: pips2
        };

        this.positionMap = this.manager.checkerManager.positionMap;

    };

    TextWriter.prototype.initObjects = function () {

        var material = new THREE.MeshBasicMaterial({color: 0x717686});

        var geometry1 = this.getGeometryFromText(" 1 ");
        var geometry2 = this.getGeometryFromText(" 2 ");

        var mesh1 = new THREE.Mesh(geometry1, material);
        mesh1.name = 'pips1';
        mesh1.scale.set(0.12, 0.12, 0.012);
        mesh1.rotateX(- Math.PI / 4);
        mesh1.castShadow = true;
        mesh1.receiveShadow = true;


        var mesh2 = mesh1.clone();
            mesh2.geometry = geometry2;
            mesh2.name = 'pips2';
            mesh2.position.copy(this.pipsMap.pips2);


        this.objects = [ mesh1, mesh2 ];

        this.updatePositions();

        this.hidePips();

    };

    TextWriter.prototype.hidePips = function(){

        this.setPipsVisibiliyState(false);

    };
    TextWriter.prototype.showPips = function(){

        this.setPipsVisibiliyState(true);

    };
    TextWriter.prototype.setPipsVisibiliyState = function(state){

        var  pips1 = this.getPips1();
        var  pips2 = this.getPips2();

            pips1.visible = state;
            pips2.visible = state;


    };

    TextWriter.prototype.updatePositions = function (isAnimated) {

        /* TODO Need normal code here */

        var movementManager = this.manager.movementManager;

        var boardDegreeState   = movementManager.boardDegreeState;
        var boardRotationState = movementManager.boardRotationState;

        this.initPositionMap();

        var pips1 = this.getPips1();
        var pips2 = this.getPips2();

        pips1.rotation.x = -Math.PI / 3;
        pips2.rotation.x = -Math.PI / 3;

        pips1.rotation.y = 0;
        pips2.rotation.y = 0;

        if(boardDegreeState) {

            pips1.rotation.x = -Math.PI / 3;
            pips2.rotation.x = -Math.PI / 3;

        } else {

            pips1.rotation.x = -Math.PI / 2;
            pips2.rotation.x = -Math.PI / 2;

        }

        if(boardRotationState) {

            pips1.rotation.y = Math.PI;
            pips2.rotation.y = Math.PI;

        } else {

            pips1.rotation.y = 0 ;
            pips2.rotation.y = 0 ;

        }

        if(boardDegreeState && boardRotationState) {

            pips1.rotation.x = Math.PI / 3;
            pips2.rotation.x = Math.PI / 3;

            pips1.rotation.y = Math.PI;
            pips2.rotation.y = Math.PI;

        }

        if(!boardDegreeState && boardRotationState){

            pips1.rotation.x = Math.PI / 2;
            pips2.rotation.x = Math.PI / 2;

        }

        pips1.position.copy(this.pipsMap.pips1);
        pips2.position.copy(this.pipsMap.pips2);

    };

    TextWriter.prototype.addToScene = function () {

        var scene = this.manager.scene;

        scene.add(this.objects[0]);
        scene.add(this.objects[1]);

    };

    TextWriter.prototype.getMeshFromGeometry = function (geometry, type, small) {

        var isColorSwitched = this.manager.checkerManager.isColorSwitched;

        var colorMap = [0xDFCAB0, 0x000000];

        var blackMaterial = new THREE.MeshBasicMaterial({color: colorMap[isColorSwitched ? 0 : 1]});
        var whiteMaterial = new THREE.MeshBasicMaterial({color: colorMap[isColorSwitched ? 1 : 0]});

        var matMap = {
            '0': blackMaterial,
            '1': whiteMaterial
        };

        var material = type ? matMap[type] : blackMaterial;

        var mesh = new THREE.Mesh(geometry, material);
        small && mesh.scale.set(0.15, 0.15, 0.01) || mesh.scale.set(0.16, 0.16, 0.01) ;
        mesh.rotateX(- Math.PI / 2);

        return mesh;

    };

    TextWriter.prototype.getGeometryFromText = function (text) {

        var geometry =  new THREE.TextGeometry( text, {
            size: 1,
            height: 1,
            curveSegments: 3,
            font: "helvetiker"
        });

        geometry.center();

        return geometry;

    };

    TextWriter.prototype.updateCheckersCounts = function () {

        var self = this;

        var checkersPositionMap = this.manager.checkerManager.positionMap;

        var selectableObjects = this.manager.checkerManager.checkerPicker.selectableObjects;

        var points = this.points;

        var selectedChecker = this.manager.checkerManager.checkerPicker.selectedChecker;

        var index = selectedChecker && selectedChecker.object.index;

        var diff = index ? 1 : 0;

        var point;

        checkersPositionMap.forEach(function (pointMap, i) {

            var pointChildrenCount = selectableObjects[i].children.length;

            var checkersCount = i == index ? pointChildrenCount - diff : pointChildrenCount;

            var number;

            if(i == 26 || i == 27){

                number = checkersCount > 1 ? checkersCount : null;

            } else {

                number = checkersCount > 5 ? checkersCount : null;

            }

            if(i == 0 || i == 25) return;

            if(number !== null) {

                var small = (number + "").length > 1;

                var geometry = self.getGeometryFromText(number);

                var checkerType = selectableObjects[i].children[0].checkerType;

                var mesh = self.getMeshFromGeometry(geometry, checkerType, small);

                mesh.rotation.z = self.manager.movementManager.boardRotationState ? -Math.PI : 0;

                var posVector = pointMap[6].clone();
                posVector.y += 0.15;

                point = points.children[i];

                point.children = [];
                point.children.length = 0;

                mesh.position.copy(posVector);

                mesh.index = i;

                point.add(mesh);

            }
            else{

                point = points.children[i];

                point.children = [];
                point.children.length = 0;

            }

        });

    };

    TextWriter.prototype.initPoints = function () {

        this.points = new THREE.Object3D();

        var points = this.points;

        points.name = 'Points';

        var map = this.positionMap;

        var scene = this.manager.scene;

        for (var index in map) {

            var point = map[index];

            var pointTHREE = new THREE.Object3D();
            pointTHREE.name = 'point';
            pointTHREE.index = index;

            points.add(pointTHREE);

        }

        scene.add(points);

    };

    TextWriter.prototype.write = function (place, text) {

        var scene = this.manager.scene;

        var placeName = place;

        if(!isNaN(+place)){

            placeName = place ? 'pips1' : 'pips2';

        }


        var mesh = scene.getObjectByName(placeName);
        mesh.geometry = this.getGeometryFromText(text);


    };

    TextWriter.prototype.getPips1 = function () {

        return this.getPips(1);

    };

    TextWriter.prototype.getPips2 = function () {

        return this.getPips(2);

    };

    TextWriter.prototype.getPips = function (num) {

        return this.objects[num - 1];

    };

    Backgammon3DBoard.TextWriter = TextWriter;


})();

(function () {

    var GameHelper = function (manager) {

        this.demo    = false;

        this.manager = manager;

        this.init(manager);

    };

    GameHelper.prototype.init = function (manager) {

        this.scene          = manager.scene;
        this.checkerManager = manager.checkerManager;
        this.positionMap    = manager.checkerManager.positionMap;

        this.initProperties();

    };

    GameHelper.prototype.initProperties = function () {

        this.initPoint();
        this.createPoints();

    };

    GameHelper.prototype.initPoint = function () {

        var sphere = new THREE.SphereGeometry( 0.05, 10, 10 );
        var lightColor = 0x00ff00;
        var light1 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: lightColor } ) ) ;


        this.point = light1;

    };

    GameHelper.prototype.createPoints = function () {

        if(this.points) this.scene.remove(this.points);

        var points1       = new THREE.Object3D();
        var points2       = new THREE.Object3D();

        var basePoint    = this.point;

        var positionMap = this.positionMap;

        var scene       = this.scene;

        var blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
            blackMaterial.transparent = true;
            blackMaterial.opacity = 0.6;

        for(var  i = 0 ; i <= 25; i++) {

            var firstPositionInMap = positionMap[i][0].clone();
            var z = firstPositionInMap.z;
            firstPositionInMap.z = z > 0 ? z + 0.35 : z - 0.35;
            firstPositionInMap.y = 0.27;

            var currentPoint = basePoint.clone();
                currentPoint.position.copy(firstPositionInMap);
                currentPoint.visible = false;

            var currentPoint2 = basePoint.clone();
                currentPoint2.material = blackMaterial.clone();
                currentPoint2.position.copy(firstPositionInMap);
                currentPoint2.visible = false;
                currentPoint2.scale.set(0.99, 0.99, 0.99);

            points1.add(currentPoint);
            points2.add(currentPoint2);

        }

        scene.add(points1);
        scene.add(points2);

        this.points = points1;
        this.points2 = points2;

    };

    GameHelper.prototype.turnLightOnForIndex = function(index){

        this.changeLightState(index, true);

    };

    GameHelper.prototype.turnLightOffForIndex = function(index){

        this.changeLightState(index, false);

    };

    GameHelper.prototype.changeLightState = function(index, state){

        if(!this.manager.platformDetector.isMobile) return;

        var points = this.points.children;
        var point  = points[index];
        point && (point.visible = state);

    };

    GameHelper.prototype.turnLightOnFromMesh = function (mesh) {

        if(!this.demo) return;
        if(!this.manager.platformDetector.isMobile) return;

        var manager         = this.manager;

        var diceManager     = manager.diceManager;
        var checkerPicker   = manager.checkerManager.checkerPicker;

        var points          = this.points.children;

        var placeInfo       = checkerPicker.getPlaceInfoFromMesh(mesh);
        var placeIndex      = placeInfo.index;
        var lastRoll        = diceManager.lastRoll || [];

        var diceIndex1      = lastRoll[0];
        var diceIndex2      = lastRoll[1];
        var finalIndex1      = placeIndex + diceIndex1;
        var finalIndex2      = placeIndex + diceIndex2;

        var point1          = points[finalIndex1];
        var point2          = points[finalIndex2];

        this.turnOffAllLights();

        point1 && (point1.visible = true);
        point2 && (point2.visible = true);

    };

    GameHelper.prototype.turnOffAllLights = function () {

        this.turnLightsOn(false);

    };

    GameHelper.prototype.turnLightsOn = function (state) {

        var points = this.points.children;

        points.forEach(function (point) {

            point.visible = state;

        })

    };

    GameHelper.prototype.turnOnOff = function () {

        var points = this.points;
        var points2 = this.points;

        var rnd = Math.round(Math.random() * 25);

        points.children[rnd].visible = !points.children[rnd].visible;

    };

    GameHelper.prototype.short = function(){

        var checkerManager = this.checkerManager;

        checkerManager.setCheckersInPoint( 1,  [ 1, 1 ] );
        checkerManager.setCheckersInPoint( 6,  [ 0, 0, 0, 0, 0 ] );
        checkerManager.setCheckersInPoint( 8,  [ 0, 0, 0 ] );
        checkerManager.setCheckersInPoint( 12, [ 1, 1, 1, 1, 1 ] );
        checkerManager.setCheckersInPoint( 13, [ 0, 0, 0, 0, 0 ] );
        checkerManager.setCheckersInPoint( 17, [ 1, 1, 1 ] );
        checkerManager.setCheckersInPoint( 19, [ 1, 1, 1, 1, 1 ] );
        checkerManager.setCheckersInPoint( 24, [ 0, 0 ] );
    };


    Backgammon3DBoard.GameHelper = GameHelper;

})();

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
                zoom : 1.40//1.38
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

        material.bumpScale = 0.003;
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

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
		module.exports = {
			Stats: Stats,
			Backgammon3DBoard: Backgammon3DBoard
		};

}