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
