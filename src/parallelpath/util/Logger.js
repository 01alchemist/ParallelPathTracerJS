System.register([], function(exports_1) {
    var Logger;
    return {
        setters:[],
        execute: function() {
            Logger = (function () {
                function Logger(prefix) {
                    this.prefix = prefix;
                    this.printMsg("Logger has started!");
                }
                Logger.prototype.printMsg = function (msg) {
                    console.log("[" + this.prefix + "]: " + msg);
                };
                Logger.prototype.printErr = function (msg) {
                    console.error("[" + this.prefix + "]: ERROR: " + msg);
                };
                return Logger;
            })();
            exports_1("Logger", Logger);
        }
    }
});
//# sourceMappingURL=Logger.js.map