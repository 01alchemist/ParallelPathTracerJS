System.register(["./InputListener", "./util/Logger", "./util/TimeUtils"], function(exports_1) {
    var InputListener_1, Logger_1, TimeUtils_1;
    var Engine;
    return {
        setters:[
            function (InputListener_1_1) {
                InputListener_1 = InputListener_1_1;
            },
            function (Logger_1_1) {
                Logger_1 = Logger_1_1;
            },
            function (TimeUtils_1_1) {
                TimeUtils_1 = TimeUtils_1_1;
            }],
        execute: function() {
            Engine = (function () {
                function Engine(display, tracer) {
                    this.display = display;
                    this.tracer = tracer;
                    this.ilistener = new InputListener_1.InputListener();
                    this.ilistener.register(display, tracer);
                    this.log = new Logger_1.Logger('Engine');
                    this.running = false;
                }
                Engine.prototype.start = function () {
                    this.tracer.start(this.display);
                    if (!this.running) {
                        this.running = true;
                        this.run();
                    }
                };
                Engine.prototype.stop = function () {
                    if (this.running) {
                        this.running = false;
                    }
                };
                Engine.prototype.run = function () {
                    TimeUtils_1.TimeUtils.init();
                    TimeUtils_1.TimeUtils.updateDelta();
                    TimeUtils_1.TimeUtils.updateFPS();
                    var self = this;
                    var step = function () {
                        TimeUtils_1.TimeUtils.updateDelta();
                        TimeUtils_1.TimeUtils.updateFPS();
                        self.display.setTitle("Workers: " + self.tracer.numWorkers +
                            " DeltaTime: " + TimeUtils_1.TimeUtils.getDelta() +
                            " FPS: " + TimeUtils_1.TimeUtils.getFPS() + "/s" +
                            " Iterations: " + self.tracer.iterations);
                        self.update(TimeUtils_1.TimeUtils.delta);
                        self.render();
                        if (self.running) {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                };
                Engine.prototype.update = function (dt) {
                    this.tracer.update(dt);
                };
                Engine.prototype.render = function () {
                    if (!this.display.paused) {
                        this.tracer.render();
                        this.display.render(this.tracer.pixels, this.tracer.iterations);
                    }
                };
                return Engine;
            })();
            exports_1("Engine", Engine);
        }
    }
});
//# sourceMappingURL=Engine.js.map