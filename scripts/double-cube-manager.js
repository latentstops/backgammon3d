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
