System.register(["../util/math/Vec3f", "../util/math/Sphere", "../util/math/Plane"], function(exports_1) {
    var Vec3f_1, Sphere_1, Plane_1;
    var TracerObject;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Plane_1_1) {
                Plane_1 = Plane_1_1;
            }],
        execute: function() {
            TracerObject = (function () {
                function TracerObject(arg1, arg2, arg3) {
                    if (arg1 instanceof Vec3f_1.Vec3f) {
                        var pos = arg1;
                        this.primitives = [];
                        if (arg2 instanceof Vec3f_1.Vec3f) {
                            this.primitives.push(new Plane_1.Plane(pos, arg2));
                        }
                        else {
                            this.primitives.push(new Sphere_1.Sphere(pos, arg2));
                        }
                        this.material = arg3;
                    }
                    else {
                        this.primitives = arg1;
                        this.material = arg2;
                    }
                }
                TracerObject.prototype.getPrimitives = function () {
                    return this.primitives;
                };
                TracerObject.prototype.getMaterial = function () {
                    return this.material;
                };
                return TracerObject;
            })();
            exports_1("TracerObject", TracerObject);
        }
    }
});
//# sourceMappingURL=TracerObject.js.map