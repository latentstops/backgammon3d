/**
 * Created by varuzhan.harutyunyan on 5/16/2016.
 */

(function () {

    var PhysicsManager = function (manager) {

        this.manager = manager;

        this.init.apply(this, arguments);

    };

    PhysicsManager.prototype = {

        objects: {

            three:  [],

            cannon: []

        },

        init: function () {

            this.initWorld();
            this.addPlane();

        },

        initWorld: function () {

            var world = new CANNON.World();
            world.broadphase = new CANNON.NaiveBroadphase();
            world.gravity.set(0, -100, 0);

            this.world = world;

        },

        addPlane: function(){

            var world = this.world;

            var groundShape = new CANNON.Plane();

            var groundBody = new CANNON.Body({ mass: 0 });

            groundBody.addShape(groundShape);
            groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
            groundBody.position.y = 0.07;

            world.add(groundBody);

        },

        force: function () {

            var self = this;

            this.resetDump();

            var objects = this.objects;

            objects.cannon.forEach(function (body, i) {

                var mesh = objects.three[i];

                self.forceFor(mesh, body);

            });

            this.startDumping();

        },

        forceFor: function (mesh, body) {

            console.log(body);

            var boxBody = body;
            boxBody.quaternion = new CANNON.Quaternion();

            var boxMesh = mesh;

            var rnd = Math.random() ;
            var rnd2 = -Math.random();

            boxBody.position.set(-7,1,0);

            boxMesh.position.copy(boxBody.position);
            boxMesh.quaternion.copy(boxBody.quaternion);

            boxBody.velocity.set(30,0,0);

        },

        createPhysicsForMesh: function (mesh) {

            if(!(mesh instanceof THREE.Mesh)) {
                return;
            }

            var manager = this.manager;
            var scaleIndex = manager.diceManager.scaleIndex;

            var world = this.world;

            var objects = this.objects;

            var geometry = mesh.geometry;
                geometry.computeBoundingBox();

            var geoParams = geometry.boundingBox;

            var geoParamsMax = geoParams.max;
                geoParamsMax.multiplyScalar(scaleIndex);

            var mass = 0.01;
            var boxShape = new CANNON.Box(new CANNON.Vec3( geoParamsMax.x, geoParamsMax.y, geoParamsMax.z ));
            var boxBody = new CANNON.Body({ mass: mass });
                boxBody.addShape(boxShape);
                boxBody.position.set(0,5,0);
                boxBody.quaternion = new CANNON.Quaternion();



            world.add(boxBody);

            objects.three.push(mesh);
            objects.cannon.push(boxBody);

        },

        update: function () {

            var world   = this.world;
            var objects = this.objects;

            world.step(1 / 120);

            objects.three.forEach(function (mesh, i) {

                var body = objects.cannon[i];

                mesh.position.copy(body.position);

                mesh.quaternion.copy(body.quaternion);

            });

            if(this.dumpingStarted) this.dump();

        },

        dump: function () {

            var dumpData = this.dumpData;

            var objects = this.objects;

            var three = objects.three[0];

            dumpData.position.push(three.position.clone());
            dumpData.rotation.push({x: three.rotation.x, y: three.rotation.y, z: three.rotation.z});
            dumpData.maxZ = three.position.z > dumpData.maxZ ? three.position.z : dumpData.maxZ;
            dumpData.minZ = three.position.z < dumpData.minZ ? three.position.z : dumpData.minZ;
        },

        startDumping: function () {

            var self = this;

            this.dumpingStarted = true;

            setTimeout(function () {

                self.dumpingStarted = false;

            }, 1500);

        },

        resetDump: function () {

            this.dumpData = {
                position: [],
                rotation: [],
                maxZ: 0,
                minZ: 0
            };

        }

    };

    DAC.PhysicsManager = PhysicsManager;

})();