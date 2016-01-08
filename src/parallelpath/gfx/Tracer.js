System.register(["./Camera", "./Scene", "../util/math/Vec3f", "./TraceWorkerManager"], function(exports_1) {
    var Camera_1, Scene_1, Vec3f_1, TraceWorkerManager_1;
    var Tracer;
    return {
        setters:[
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (TraceWorkerManager_1_1) {
                TraceWorkerManager_1 = TraceWorkerManager_1_1;
            }],
        execute: function() {
            Tracer = (function () {
                function Tracer() {
                    this.camera = new Camera_1.Camera(new Vec3f_1.Vec3f(0.0, 1.0, 0.0), 0.005, 0.1);
                    this.scene = new Scene_1.Scene();
                    this.workerManager = new TraceWorkerManager_1.TraceWorkerManager(this);
                }
                Object.defineProperty(Tracer.prototype, "numWorkers", {
                    get: function () {
                        return this.workerManager.numWorkers;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Tracer.prototype, "pixels", {
                    get: function () {
                        return this.workerManager.pixels;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Tracer.prototype, "iteration", {
                    get: function () {
                        return this.workerManager.iteration;
                    },
                    enumerable: true,
                    configurable: true
                });
                Tracer.prototype.update = function (dt) {
                    this.scene.update(dt);
                    this.camera.update(dt);
                };
                Tracer.prototype.start = function (display) {
                    this.workerManager.start(display);
                };
                Tracer.prototype.render = function () {
                    this.workerManager.render();
                };
                Tracer.prototype.getCamera = function () {
                    return this.camera;
                };
                Tracer.prototype.getScene = function () {
                    return this.scene;
                };
                return Tracer;
            })();
            exports_1("Tracer", Tracer);
        }
    }
});
//# sourceMappingURL=Tracer.js.map