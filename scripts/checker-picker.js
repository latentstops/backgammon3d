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
