System.register(["../util/math/Vec3f"], function(exports_1) {
    var Vec3f_1;
    var Light;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Light = (function () {
                function Light() {
                }
                Light.prototype.getLightType = function () {
                    return this.light_type;
                };
                Light.prototype.getPos = function () {
                    return this.pos;
                };
                Light.prototype.getDir = function () {
                    return this.dir;
                };
                Light.prototype.getColor = function () {
                    return this.color;
                };
                Light.prototype.getIntensity = function () {
                    return this.intensity;
                };
                Light.prototype.getConstant = function () {
                    return this.constant;
                };
                Light.prototype.getLinear = function () {
                    return this.linear;
                };
                Light.prototype.getExponent = function () {
                    return this.exponent;
                };
                Light.cast = function (obj) {
                    var light = new Light();
                    light.light_type = obj.light_type;
                    light.color = new Vec3f_1.Vec3f().set(obj.color);
                    light.intensity = obj.intensity;
                    light.dir = obj.dir ? new Vec3f_1.Vec3f().set(obj.dir) : obj.dir;
                    light.pos = obj.pos ? new Vec3f_1.Vec3f().set(obj.pos) : obj.pos;
                    light.constant = obj.constant;
                    light.linear = obj.linear;
                    light.exponent = obj.exponent;
                    return light;
                };
                return Light;
            })();
            exports_1("Light", Light);
        }
    }
});
//# sourceMappingURL=Light.js.map