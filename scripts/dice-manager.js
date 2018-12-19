(function(){


    /* Dice Manager */

    var DiceManager = function(managerscene, params, modelsPath, callback){

        this.init.apply(this, arguments);

    };

    DiceManager.prototype.initProperties = function() {

        this.dices                  = [];
        this.animations             = [];
        this.ANIMATION_FILE_ARRAY   = [];

        this.scene                  = null;
        this.audio                  = null;
        this.params                 = null;
        this.modelsPath             = null;
        this.diceGeometry           = null;
        this.animationIndex         = null;
        this.ANIMATIONS_PATH        = null;
        this.DICE_TEXTURES_PATH     = null;
        this.isColorsSwitched       = null;


    };

    DiceManager.prototype.init = function ( manager, params, modelsPath, animations ) {

        this.initProperties();      

        var thisParams = { mass: 0.3, diceParams: {x: .2, y: .2, z: .2 } };

        this.manager = manager;
        this.scene = manager.scene;
        this.dices = [];
        this.diceGeometry = null;
        this.params = params || thisParams;
        this.animationIndex = -1;
        this.isAnimationFromRight = false;

        this.modelsPath = modelsPath;

        this.ANIMATIONS_PATH     = this.modelsPath.animationsPath;
        this.DICE_TEXTURES_PATH  = this.modelsPath.texturesPath;
        this.ANIMATION_FILE_ARRAY  = [
            '0.json',
            '1.json'
        ];

        //this.audio = new Audio(this.modelsPath +'newScene/1.mp3');

        this.initDiceGeometry();
        this.initAnimations(animations);


    };

    DiceManager.prototype.createDice = function(diceType) {

        return new Backgammon3DBoard.Dice( this, { three: this.createTHREE(null) }, diceType, this.modelsPath );

    };

    DiceManager.prototype.createDices = function() {

        this.dices.push(this.createDice(1));
        this.dices.push(this.createDice(2));

    };


    DiceManager.prototype.initAnimations = function(animations) {

        this.animations = animations

    };



    DiceManager.prototype.initDiceGeometry = function() {

        var scene = this.scene;

        var mesh = scene.getObjectByName('Dice_01') || scene.children[0];

        this.diceGeometry = mesh.geometry;

        this.createDices();
        this.addToScene();

        scene.remove(mesh);

    };

    DiceManager.prototype.createTHREE = function(params) {

        var self = this;

        var _params = params || this.params;
        var diceParams = _params.diceParams;

        var x = diceParams.x * 2;
        var y = diceParams.y * 2;
        var z = diceParams.z * 2;

        var dice = {};

        if( this.diceGeometry ){

            return createDiceFromGeometry();

        }

        function createDiceFromGeometry(){

            var geometry = self.diceGeometry;
            var scaleIndex = diceParams.x / 3.2;
            self.scaleIndex = scaleIndex;

            if(!geometry) return;

            geometry.computeVertexNormals();

            var diceMaterial = new THREE.MeshPhongMaterial();
                diceMaterial.map = THREE.ImageUtils.loadTexture(self.DICE_TEXTURES_PATH + '1.png');
                diceMaterial.combine = THREE.MultiplyOperation;
                diceMaterial.shininess = 50;



            var dice = new THREE.Mesh( geometry, diceMaterial);
                dice.castShadow = true;
                dice.receiveShadow = true;
                dice.name = 'dice';
                dice.scale.set(scaleIndex, scaleIndex, scaleIndex);
                dice.visible = false;

            return dice;

        }

        return dice;

    };

    DiceManager.prototype.update = function(delta) {

        var dice1 = this.dices[0], dice2 = this.dices[1];

        if(!dice1 || !dice2) return;

        if(dice1.three && dice2.three && dice1.three.mesh && dice2.three.mesh) {

            dice1.three = dice1.three.mesh;
            dice2.three = dice2.three.mesh;

        }

        if(dice1 && dice2 && dice1.three.material && dice2.three.material) {

            this.startAnimationHandler(delta);

        }

    };

    DiceManager.prototype.startAnimationHandler = function(delta) {

        var dice1 = this.dices[0];
        var dice2 = this.dices[1];

        var rollType = this.rollType;

        if(this.animationIndex < 0) return;

        if(!dice1.playDumpAnimation(this.animationIndex, rollType) || !dice2.playDumpAnimation(this.animationIndex, rollType)) {

            this.stopAnimation();

        }

        this.animationIndex += Math.round(delta );

    };

    DiceManager.prototype.playAnimation = function(rollType, isAnimated) {

        this.isAnimated = isAnimated;

        this.rollType = rollType;

        this.animationIndex = 0;

    };

    DiceManager.prototype.stopAnimation = function() {

        this.animationIndex = -10;

    };

    DiceManager.prototype.addToScene = function() {

        var dice1 = this.dices[0],
            dice2 = this.dices[1];
        var scene = this.scene;

        scene.add(dice1.three);
        scene.add(dice2.three);

    };

    DiceManager.prototype.drop = function(num1, num2, rollType, isAnimated) {

        this.lastRoll = [num1, num2];

        var projectionObject = this.scene.getObjectByName('ProjectionObject');
            projectionObject.renderOrder = 10;

        var dice2 = this.dices[1];
        var dice1 = this.dices[0];

        dice1.three.visible = true;
        dice2.three.visible = true;

        if(num1 == 0 || num2 == 0 || !dice1 || !dice2) return;

        this.setDiceColorsFromRollType(rollType);

        dice1.setStartPosition(-10, 1, 0.2);
        dice2.setStartPosition(-10, 1, 0.6);

        dice1.setDumpedAnimation(this.animations[0]);
        dice2.setDumpedAnimation(this.animations[1]);

        dice1.drop(num1);
        dice2.drop(num2);

        this.playAnimation(rollType, isAnimated);
        this.playSound();


    };

    DiceManager.prototype.setDiceColorsFromRollType = function (rollType) {

        rollType = +rollType;

        var dice1 = this.getDice1();
        var dice2 = this.getDice2();

        var isColorSwitched = this.manager.checkerManager.isColorSwitched;

        switch (rollType){

            case 0: {
                dice1.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                dice2.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                break;
            }

            case 1: {
                dice1.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                dice2.setCurrentTextureMap(isColorSwitched ? 1 : 0);
                break;
            }

            case 2: {
                dice1.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                dice2.setCurrentTextureMap(isColorSwitched ? 0 : 1);
                break;
            }


        }

    };

    DiceManager.prototype.switchDiceColors = function (state) {

        var dice1 = this.getDice1();
        var dice2 = this.getDice2();

        var c1 = +!+dice1.color + "";
        var c2 = +!+dice2.color + "";

        dice1.setCurrentTextureMap(c1);
        dice2.setCurrentTextureMap(c2);

        if(!this.lastRoll) return;

        this.drop(this.lastRoll[0], this.lastRoll[1], this.rollType, false);

    };

    DiceManager.prototype.setDiceState = function(diceNum, state){

        var stateMap = [1, 0.4, 0.2];

        var dice = this.getDice(diceNum);

        dice.three.material.transparent = true;
        dice.three.material.opacity = stateMap[state];

    };

    DiceManager.prototype.getDice1 = function() {

        return this.getDice(1);

    };

    DiceManager.prototype.getDice2 = function() {

        return this.getDice(2);

    };

    DiceManager.prototype.getDice = function(num) {

        var index = num - 1;
        return this.dices[index];

    };

    DiceManager.prototype.playSound = function() {

        // CALL Back function need to be replaced


    };

    Backgammon3DBoard.DiceManager = DiceManager;

})();
