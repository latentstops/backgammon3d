/*
 * API is inside of board_manager.api
 */

/* Callbacks */
//moved:                  function (from, to)
//maxStep:                function (from)
//minStep:                function (from)
//allPossibleSteps:       function (from)

/* Board */
//setRotationState:       function (state, isAnimated)
//setDegreeState:         function (state, isAnimated)

/* Checkers */
//setPlaceOfOut:          function (type, place)
//setCheckersInPoint:     function (point, collection)
//move:                   function (moveCollection, isAnimated)
//setReadOnly :           function (checkerType, isReadOnly)
//switchColors:           function (state)
//setMirroredState:       function (state, isAnimated)

/* Double Cube */
//setDoubleCubeReadOnly:  function (state)
//moveDoubleCubeTo:       function (index, isAnimated)
//changeDoubleCubeTo:     function (place, number, isAnimated)
//isDoubleCubeExist:      function (state)

/* Dices */
//roll :                  function(num1, num2, rollType, isAnimated)
//setDiceState:           function(dice, state)

/* PIPS */
//setPipsVisibilityState  function(state)
//showPips :              function()
//hidePips:               function()
//writePips:              function(pips, text) /* pips argument can be 0,1 OR 'pips1','pips2' */

var Backgammon3DBoard;

(function(){

    var BackgammonBoard = function(){};

    Backgammon3DBoard = new BackgammonBoard();

})();
