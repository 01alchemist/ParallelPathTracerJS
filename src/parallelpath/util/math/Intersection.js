System.register(["./Vec3f"], function(exports_1) {
    var Vec3f_1;
    var Intersection;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Intersection = (function () {
                function Intersection(pos, norm, t) {
                    this.pos = pos || new Vec3f_1.Vec3f();
                    this.norm = norm || new Vec3f_1.Vec3f();
                    this.t = t || 0.0;
                }
                Intersection.prototype.getPos = function () {
                    return this.pos;
                };
                Intersection.prototype.getNorm = function () {
                    return this.norm;
                };
                Intersection.prototype.getT = function () {
                    return this.t;
                };
                Intersection.prototype.setPos = function (pos) {
                    this.pos.set(pos);
                };
                Intersection.prototype.setNorm = function (norm) {
                    this.norm.set(norm);
                };
                Intersection.prototype.setT = function (t) {
                    this.t = t;
                };
                return Intersection;
            })();
            exports_1("Intersection", Intersection);
        }
    }
});
//# sourceMappingURL=Intersection.js.map