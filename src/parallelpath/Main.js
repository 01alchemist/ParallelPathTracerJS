System.register(["./gfx/gfx", "./util/util", "./Engine"], function(exports_1) {
    var gfx_1, util_1, Engine_1;
    var Main;
    return {
        setters:[
            function (gfx_1_1) {
                gfx_1 = gfx_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Engine_1_1) {
                Engine_1 = Engine_1_1;
            }],
        execute: function() {
            Main = (function () {
                function Main() {
                    util_1.Config.init();
                    Main.display = new gfx_1.Display(util_1.Config.window_width, util_1.Config.window_height, util_1.Config.display_scale, "Parallel PathTracer");
                    Main.tracer = new gfx_1.Tracer();
                    Main.display.create(Main.tracer.pixels);
                    Main.engine = new Engine_1.Engine(Main.display, Main.tracer);
                    Main.engine.start();
                }
                return Main;
            })();
            exports_1("Main", Main);
            new Main();
        }
    }
});
//# sourceMappingURL=Main.js.map