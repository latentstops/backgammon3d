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
