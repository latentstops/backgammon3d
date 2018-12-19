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
