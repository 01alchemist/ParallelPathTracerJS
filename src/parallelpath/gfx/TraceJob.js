System.register(["../util/util", "../cpu/Thread", "../worker/TraceWorker"], function(exports_1) {
    var util_1, Thread_1, TraceWorker_1;
    var TraceJob;
    return {
        setters:[
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Thread_1_1) {
                Thread_1 = Thread_1_1;
            },
            function (TraceWorker_1_1) {
                TraceWorker_1 = TraceWorker_1_1;
            }],
        execute: function() {
            TraceJob = (function () {
                function TraceJob(pixelMemory, width, height, xoffset, yoffset, id, tracer) {
                    this.pixelMemory = pixelMemory;
                    this.width = width;
                    this.height = height;
                    this.xoffset = xoffset;
                    this.yoffset = yoffset;
                    this.id = id;
                    this.finished = false;
                    this.tracer = tracer;
                    var self = this;
                    this.thread = new Thread_1.Thread("Worker: " + id);
                    this.thread.onInitComplete = function () {
                        self.finished = true;
                    };
                    this.thread.onTraceComplete = function () {
                        self.finished = true;
                    };
                    this.thread.sendCommand(TraceWorker_1.TraceWorker.INIT);
                    this.thread.sendData({
                        id: id,
                        pixelMemory: pixelMemory.buffer,
                        window_width: util_1.Config.window_width,
                        window_height: util_1.Config.window_height,
                        width: width,
                        height: height,
                        xoffset: xoffset,
                        yoffset: yoffset,
                        tracer: this.tracer
                    }, [pixelMemory.buffer]);
                }
                TraceJob.prototype.run = function () {
                    if (this.thread.initialized && !this.thread.isTracing) {
                        this.finished = false;
                        this.thread.trace();
                        this.thread.sendData({ ar: this.display.getAR(), rot: this.tracer.camera.rot, pos: this.tracer.camera.pos });
                    }
                };
                TraceJob.prototype.getWidth = function () {
                    return this.width;
                };
                TraceJob.prototype.getHeight = function () {
                    return this.height;
                };
                TraceJob.prototype.getXOffset = function () {
                    return this.xoffset;
                };
                TraceJob.prototype.getYOffset = function () {
                    return this.yoffset;
                };
                TraceJob.prototype.getId = function () {
                    return this.id;
                };
                TraceJob.prototype.isFinished = function () {
                    return this.finished;
                };
                TraceJob.prototype.setDisplay = function (display) {
                    this.display = display;
                };
                return TraceJob;
            })();
            exports_1("TraceJob", TraceJob);
        }
    }
});
//# sourceMappingURL=TraceJob.js.map