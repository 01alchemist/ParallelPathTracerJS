System.register([], function(exports_1) {
    var material_types, light_types, Config;
    return {
        setters:[],
        execute: function() {
            (function (material_types) {
                material_types[material_types["PHONG"] = 0] = "PHONG";
                material_types[material_types["COOKTORRANCE"] = 1] = "COOKTORRANCE";
            })(material_types || (material_types = {}));
            exports_1("material_types", material_types);
            (function (light_types) {
                light_types[light_types["DIRECTIONAL"] = 0] = "DIRECTIONAL";
                light_types[light_types["POINT"] = 1] = "POINT";
            })(light_types || (light_types = {}));
            exports_1("light_types", light_types);
            Config = (function () {
                function Config() {
                }
                Config.init = function () {
                    Config.create();
                };
                Config.create = function () {
                };
                Config.load = function () {
                };
                Config.RES_ROOT = "./res/";
                Config.window_width = 640;
                Config.window_height = 360;
                Config.display_scale = 1;
                Config.recursion_max = 6;
                Config.thread_amount = -1;
                Config.epsilon = 1e-3;
                Config.debug = false;
                Config.ss_enabled = true;
                Config.ss_amount = 3;
                Config.ss_jitter = 0.001;
                return Config;
            })();
            exports_1("Config", Config);
        }
    }
});
//# sourceMappingURL=Config.js.map