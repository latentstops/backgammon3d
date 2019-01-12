var intervalId = null;

canvas.style.height = window.innerHeight + 'px';
canvas.style.width = window.innerWidth + 'px';

var board_manager = new Backgammon3DBoard.Manager(canvas, null, 'assets/');
board_manager.onLoadComplete = function () {
    board_manager.start();
    board_manager.api.short();
    board_manager.api.setReadOnly( 0, false );
    board_manager.api.setReadOnly( 1, false );
    randomRollDices();
    toggleDemo.call(demo);
};
board_manager.load();

function toggleDemo () {
    var state = +!+this.dataset.state;

    board_manager.cameraControls.autoRotate = state;
    autoRollDices( state );

    this.dataset.state = state;
}

function autoRollDices(state){
    if(state){
        intervalId = setInterval( randomRollDices, 5000 );
    } else {
        clearInterval( intervalId );
    }

}

function randomRollDices() {
    board_manager.api.roll( random( 6 ), random( 6 ), random( 2 ), true );
}

function random( num ){
    return Math.round( Math.random() * num );
}

demo.onclick = toggleDemo;
roll.onclick = randomRollDices;


