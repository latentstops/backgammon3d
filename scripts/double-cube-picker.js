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
