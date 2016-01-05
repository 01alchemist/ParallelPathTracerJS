System.register(["./Logger", "./Config", "./TimeUtils", "./math/Intersection", "./math/MathUtils", "./math/Plane", "./math/Primitive", "./math/Quaternion", "./math/Ray", "./math/Sphere", "./math/Vec3f"], function(exports_1) {
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (Logger_1_1) {
                exportStar_1(Logger_1_1);
            },
            function (Config_1_1) {
                exportStar_1(Config_1_1);
            },
            function (TimeUtils_1_1) {
                exportStar_1(TimeUtils_1_1);
            },
            function (Intersection_1_1) {
                exportStar_1(Intersection_1_1);
            },
            function (MathUtils_1_1) {
                exportStar_1(MathUtils_1_1);
            },
            function (Plane_1_1) {
                exportStar_1(Plane_1_1);
            },
            function (Primitive_1_1) {
                exportStar_1(Primitive_1_1);
            },
            function (Quaternion_1_1) {
                exportStar_1(Quaternion_1_1);
            },
            function (Ray_1_1) {
                exportStar_1(Ray_1_1);
            },
            function (Sphere_1_1) {
                exportStar_1(Sphere_1_1);
            },
            function (Vec3f_1_1) {
                exportStar_1(Vec3f_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=util.js.map