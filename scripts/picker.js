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

                //self.cameraControls.enabled = true;

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

