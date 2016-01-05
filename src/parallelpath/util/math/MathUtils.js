System.register(["./Vec3f"], function(exports_1) {
    var Vec3f_1;
    var MathUtils;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            MathUtils = (function () {
                function MathUtils() {
                }
                MathUtils.toRadians = function (degree) {
                    return degree * Math.PI / 180;
                };
                MathUtils.toDegrees = function (radians) {
                    return radians * 180 / Math.PI;
                };
                MathUtils.max = function (v) {
                    return Math.max(v.x, Math.max(v.y, v.z));
                };
                MathUtils.clamp = function (f, min, max) {
                    if (f instanceof Vec3f_1.Vec3f) {
                        var v = f;
                        var x = MathUtils.clamp2(v.x, min, max);
                        var y = MathUtils.clamp2(v.y, min, max);
                        var z = MathUtils.clamp2(v.z, min, max);
                        return new Vec3f_1.Vec3f(x, y, z);
                    }
                    else {
                        return MathUtils.clamp2(f, min, max);
                    }
                };
                MathUtils.clamp2 = function (f, min, max) {
                    return Math.max(min, Math.min(f, max));
                };
                MathUtils.interpolate = function (f, min, max) {
                    if (f instanceof Vec3f_1.Vec3f) {
                        var v = f;
                        var x = MathUtils.interpolate2(v.x, min, max);
                        var y = MathUtils.interpolate2(v.y, min, max);
                        var z = MathUtils.interpolate2(v.z, min, max);
                        return new Vec3f_1.Vec3f(x, y, z);
                    }
                    else {
                        return MathUtils.interpolate2(f, min, max);
                    }
                };
                MathUtils.interpolate2 = function (f, min, max) {
                    return min + (max - min) * MathUtils.clamp2(f, 0.0, 1.0);
                };
                MathUtils.smoothstep2 = function (f, min, max) {
                    return MathUtils.clamp2((f - min) / (max - min), 0.0, 1.0);
                };
                MathUtils.smoothstep = function (f, min, max) {
                    if (f instanceof Vec3f_1.Vec3f) {
                        var v = f;
                        var x = MathUtils.smoothstep2(v.x, min, max);
                        var y = MathUtils.smoothstep2(v.y, min, max);
                        var z = MathUtils.smoothstep2(v.z, min, max);
                        return new Vec3f_1.Vec3f(x, y, z);
                    }
                    else {
                        return MathUtils.smoothstep2(f, min, max);
                    }
                };
                return MathUtils;
            })();
            exports_1("MathUtils", MathUtils);
        }
    }
});
//# sourceMappingURL=MathUtils.js.map