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
