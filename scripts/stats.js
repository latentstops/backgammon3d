var Stats = function () {



    var beginTime = ( Date ).now(),
        prevTime = beginTime,
        frames = 0;

    return {

        functions:[],

        begin: function () {

            beginTime = ( Date ).now();

        },

        end: function () {

            frames++;

            var time = ( Date ).now();

            var interval = this.interval;

            if (time > prevTime + interval) {

                this.fps = Math.round(( frames * 1000 ) / ( time - prevTime ));

                prevTime = time;

                this.functions.forEach(function (funcObject) {

                    if(!funcObject) return;

                    var func = funcObject.func;
                    var scope = funcObject.scope;

                    if(!func || !scope) return;

                    func.call(scope);

                });

                frames = 0;

            }

            return time;

        },

        update: function () {

            beginTime = this.end();

        },

        interval: 3000

    };

};
