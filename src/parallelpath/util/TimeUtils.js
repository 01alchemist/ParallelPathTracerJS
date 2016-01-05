System.register([], function(exports_1) {
    var TimeUtils;
    return {
        setters:[],
        execute: function() {
            TimeUtils = (function () {
                function TimeUtils() {
                }
                TimeUtils.init = function () {
                    TimeUtils.lastTime = TimeUtils.getTime();
                    TimeUtils.updateDelta();
                };
                TimeUtils.updateDelta = function () {
                    TimeUtils.currentTime = TimeUtils.getTime();
                    if (TimeUtils.currentTime - TimeUtils.lastTime != 0) {
                        TimeUtils.delta = TimeUtils.delta * 0.9 + (TimeUtils.currentTime - TimeUtils.lastTime) * 0.1;
                        TimeUtils.lastTime = TimeUtils.currentTime;
                    }
                };
                TimeUtils.updateFPS = function () {
                    TimeUtils.time++;
                    if (TimeUtils.time >= TimeUtils.timeres) {
                        if (isFinite(TimeUtils.fps)) {
                            TimeUtils.fps = 0.0;
                        }
                        TimeUtils.fps = (TimeUtils.fps * 0.9 + (TimeUtils.timeres / TimeUtils.delta) * 0.1);
                        TimeUtils.time -= TimeUtils.timeres;
                    }
                };
                TimeUtils.getTime = function () {
                    return performance.now();
                };
                TimeUtils.getDelta = function () {
                    return TimeUtils.delta.toFixed(2);
                };
                TimeUtils.getFPS = function () {
                    return (TimeUtils.frame * TimeUtils.fps).toFixed(2);
                };
                TimeUtils.second = 1000000;
                TimeUtils.frame = 1000;
                TimeUtils.timeres = 1;
                TimeUtils.currentTime = 0;
                TimeUtils.lastTime = 0;
                TimeUtils.time = 0;
                TimeUtils.delta = 1;
                TimeUtils.fps = 0;
                return TimeUtils;
            })();
            exports_1("TimeUtils", TimeUtils);
        }
    }
});
//# sourceMappingURL=TimeUtils.js.map