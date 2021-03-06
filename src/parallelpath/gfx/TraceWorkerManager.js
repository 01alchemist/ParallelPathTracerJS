System.register(["../util/Config", "./TraceJob"], function(exports_1) {
    var Config_1, TraceJob_1;
    var TraceWorkerManager;
    return {
        setters:[
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (TraceJob_1_1) {
                TraceJob_1 = TraceJob_1_1;
            }],
        execute: function() {
            TraceWorkerManager = (function () {
                function TraceWorkerManager(tracer) {
                    this.tracer = tracer;
                    this.propertySize = 512;
                    this.iterations = 0;
                    var width = Config_1.Config.window_width;
                    var height = Config_1.Config.window_height;
                    this.propertyMemory = new Uint8Array(new SharedArrayBuffer(this.propertySize));
                    this.pixelMemory = new Uint8Array(new SharedArrayBuffer(width * height * 3));
                    this.jobs = [];
                    this.setWorkerAmount(Config_1.Config.thread_amount);
                }
                Object.defineProperty(TraceWorkerManager.prototype, "numWorkers", {
                    get: function () {
                        return this.jobs.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceWorkerManager.prototype, "pixels", {
                    get: function () {
                        return this.pixelMemory;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceWorkerManager.prototype.setWorkerAmount = function (n) {
                    if (n <= 0) {
                        n = navigator["hardwareConcurrency"] || 2;
                    }
                    n = n > 2 ? 2 : n;
                    n = 4;
                    console.info("hardwareConcurrency:" + n);
                    this.jobs = [];
                    var width = Config_1.Config.window_width;
                    var height = Config_1.Config.window_height;
                    var thread_id = 0;
                    if (n > 1) {
                        width /= n;
                        height /= n;
                        for (var j = 0; j < n; j++) {
                            for (var i = 0; i < n; i++) {
                                this.jobs.push(new TraceJob_1.TraceJob(this.pixelMemory, width, height, i * width, j * height, ++thread_id, this.tracer));
                            }
                        }
                    }
                    else {
                        this.jobs.push(new TraceJob_1.TraceJob(this.pixelMemory, width, height, 0, 0, 0, this.tracer));
                    }
                };
                TraceWorkerManager.prototype.start = function (display) {
                    console.log("start");
                    this.jobs.forEach(function (w) {
                        w.setDisplay(display);
                    });
                };
                TraceWorkerManager.prototype.render = function () {
                    if (this.workersFinished()) {
                        this.jobs.forEach(function (w) {
                            w.run();
                        });
                        this.iterations += Config_1.Config.ss_amount;
                    }
                };
                TraceWorkerManager.prototype.workersFinished = function () {
                    var isAllFinished = true;
                    for (var i = 0; i < this.jobs.length; i++) {
                        if (!this.jobs[i].thread.initialized || !this.jobs[i].finished) {
                            isAllFinished = false;
                        }
                    }
                    return isAllFinished;
                };
                return TraceWorkerManager;
            })();
            exports_1("TraceWorkerManager", TraceWorkerManager);
        }
    }
});
//# sourceMappingURL=TraceWorkerManager.js.map