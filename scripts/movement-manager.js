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
