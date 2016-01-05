System.register(["./Light", "../util/Config"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Light_1, Config_1;
    var PointLight;
    return {
        setters:[
            function (Light_1_1) {
                Light_1 = Light_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            }],
        execute: function() {
            PointLight = (function (_super) {
                __extends(PointLight, _super);
                function PointLight(pos, color, intensity, constant, linear, exponent) {
                    _super.call(this);
                    this.light_type = Config_1.light_types.POINT;
                    this.pos = pos;
                    this.color = color;
                    this.intensity = intensity;
                    this.constant = constant;
                    this.linear = linear;
                    this.exponent = exponent;
                }
                return PointLight;
            })(Light_1.Light);
            exports_1("PointLight", PointLight);
        }
    }
});
//# sourceMappingURL=PointLight.js.map