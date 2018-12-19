(function(){

    var Dice = function (manager, params, diceType, modelsPath){

        this.manager = manager;

        this.init.apply(this, arguments);

    };


    Dice.prototype.initProperties = function(){

        this.dump               = { position: [], rotation: [] };
        this.dumpedAnimation    = {};

        this.three              = null;
        this.modelsPath         = null;
        this.texturesMap        = null;
        this.startPosition      = null;
        this.DICE_TEXTURES_PATH = null;

    };


    Dice.prototype.init = function (manager, params, diceType, modelsPath) {

        this.initProperties();

        this.diceType = diceType;

        this.startPosition = params.startPosition || {x: 0, y: 0, z: 0};

        this.three = params.three;

        this.modelsPath = modelsPath;

        this.DICE_TEXTURES_PATH = this.modelsPath.texturesPath;

        var self = this;

        function getTexture(name){

            var texture = THREE.ImageUtils.loadTexture(self.DICE_TEXTURES_PATH + name);
            return texture;
        }

        this.texturesMap = {

            white:{
                '1': getTexture('dice_white/1.png'),

                '2': getTexture('dice_white/2.png'),

                '3': getTexture('dice_white/3.png'),

                '4': getTexture('dice_white/4.png'),

                '5': getTexture('dice_white/5.png'),

                '6': getTexture('dice_white/6.png')
            },

            black:{
                '1': getTexture('dice_black/1.png'),

                '2': getTexture('dice_black/2.png'),

                '3': getTexture('dice_black/3.png'),

                '4': getTexture('dice_black/4.png'),

                '5': getTexture('dice_black/5.png'),

                '6': getTexture('dice_black/6.png')
            },

            red:  {
                '1': getTexture('dice_red/1.png'),

                '2': getTexture('dice_red/2.png'),

                '3': getTexture('dice_red/3.png'),

                '4': getTexture('dice_red/4.png'),

                '5': getTexture('dice_red/5.png'),

                '6': getTexture('dice_red/6.png')
            }

        };

        this.currentTextureMap = {};

    };

    Dice.prototype.setStartPosition = function(x, y, z){

        this.startPosition.x = x;
        this.startPosition.y = y;
        this.startPosition.z = z;

    };

    Dice.prototype.drop = function(num){

        num = parseInt(num);

        switch (num) {

            case 1:
                this.drop1();
                break;

            case 2:
                this.drop2();
                break;

            case 3:
                this.drop3();
                break;

            case 4:
                this.drop4();
                break;

            case 5:
                this.drop5();
                break;

            case 6:
                this.drop6();
                break;

            default :
                this.dropX();

        }

    };


    /* Drops */
    Dice.prototype.drop1 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber1(animation);

    };

    Dice.prototype.drop2 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber2(animation);

    };

    Dice.prototype.drop3 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber3(animation);

    };

    Dice.prototype.drop4 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber4(animation);

    };

    Dice.prototype.drop5 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber5(animation);

    };

    Dice.prototype.drop6 = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber6(animation);

    };

    Dice.prototype.dropX = function(){

        var animation = this.dumpedAnimation.result;
        this.setNumber6(animation);

    };

    /* Texture */
    Dice.prototype.setNumber = function(num, animation){

        this.three.visible = false;

        animation = parseInt(animation);

        if (isNaN(animation)) return;

        var faceConfigMap = {

            '1': [1, 2, 3, 6, 5, 4],

            '2': [2, 3, 1, 5, 4, 6],

            '3': [3, 1, 2, 4, 6, 5],

            '4': [4, 5, 6, 3, 2, 1],

            '5': [5, 6, 4, 2, 1, 3],

            '6': [6, 4, 5, 1, 3, 2]

        };

        var texturesMap = this.currentTextureMap;

        var index = faceConfigMap[1].indexOf(animation);

        for (var i = 1; i <= 6; i++) {

            var currentFaceMap = faceConfigMap[i];

            if (currentFaceMap.indexOf(num) == index) {

                var material = this.three.material;

                material.map = texturesMap[i];

            }

        }


        /* Or in stand of map we can use this function*/
        /*function diceArrayFromNumber(num){

         var arr = [num];

         for(var i = 0; i < 2; i++){

         arr[i+1] = next(arr[i]);
         arr[i+3] = 7 - arr[i];

         }

         arr[5] = 7 - arr[2];


         function next(num){

         return ( ( num % 3 ) + 1 ) % 6 + ( 3 * parseInt( num / 3.5 ) );

         }

         return arr;

         }*/

    };

    Dice.prototype.setCurrentTextureMap = function(color){

        color = color || '0';

        this.color = color;

        var colorMap = {

            '0': 'white',

            '1': 'black',

            '2': 'red'
        };

        var texturesMap = this.texturesMap;

        this.currentTextureMap = texturesMap[colorMap[color]];

    };

    Dice.prototype.setNumber1 = function(animation){

        this.setNumber(1, animation);

    };

    Dice.prototype.setNumber2 = function(animation){

        this.setNumber(2, animation);

    };

    Dice.prototype.setNumber3 = function(animation){

        this.setNumber(3, animation);

    };

    Dice.prototype.setNumber4 = function(animation){

        this.setNumber(4, animation);

    };

    Dice.prototype.setNumber5 = function(animation){

        this.setNumber(5, animation);

    };

    Dice.prototype.setNumber6 = function(animation){

        this.setNumber(6, animation);

    };

    /* Animations */

    Dice.prototype.setDumpedAnimation = function(animation){

        this.dumpedAnimation = animation;

    };

    Dice.prototype.playDumpAnimation = function(i, rollType){

        this.three.visible = true;

        var dump = this.dumpedAnimation;

        var dumpPosition = dump.position[i];

        var dumpRotation = dump.rotation[i];

        if (!dumpPosition) return false;
        if (!dumpRotation) return false;

        if(!this.manager.isAnimated){

            dumpPosition = dump.position[dump.position.length - 1];
            dumpRotation = dump.rotation[dump.rotation.length - 1];

        }

        var positionVec3 = new THREE.Vector3();
        var rotationVec3 = new THREE.Vector3();

        var magicNumber = -0.38;
        var z = this.startPosition.z;

        positionVec3.copy(dumpPosition);
        positionVec3.y -= 0.02;
        rotationVec3.copy(dumpRotation);

        switch(rollType){

            case 1: {

                rotationVec3.copy(dumpRotation).multiplyScalar(-1);
                positionVec3.x = -positionVec3.x;
                positionVec3.z -= (z + magicNumber);

                break;

            }

            case 2: {

                positionVec3.z -= (z + magicNumber);
                break;

            }

            case 0: {

                if(this.diceType == 1){

                    rotationVec3.copy(dumpRotation).multiplyScalar(-1);
                    positionVec3.x = -positionVec3.x;
                    positionVec3.z -= (z + magicNumber);

                }

                break;

            }

            default : break;

        }


        positionVec3.y -= 0.02;

        this.three.position.copy(positionVec3);

        this.three.rotation.x = rotationVec3.x;
        this.three.rotation.y = rotationVec3.y;
        this.three.rotation.z = rotationVec3.z;

        return true;

    };

    Backgammon3DBoard.Dice = Dice;

})();
