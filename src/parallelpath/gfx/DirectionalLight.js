System.register(["./Light", "../util/Config"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Light_1, Config_1;
    var DirectionalLight;
    return {
        setters:[
            function (Light_1_1) {
                Light_1 = Light_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            }],
        execute: function() {
            DirectionalLight = (function (_super) {
                __extends(DirectionalLight, _super);
                function DirectionalLight(dir, color, intensity) {
                    _super.call(this);
                    this.light_type = Config_1.light_types.DIRECTIONAL;
                    this.dir = dir.normalize();
                    this.color = color;
                    this.intensity = intensity;
                }
                return DirectionalLight;
            })(Light_1.Light);
            exports_1("DirectionalLight", DirectionalLight);
        }
    }
});
//# sourceMappingURL=DirectionalLight.js.map