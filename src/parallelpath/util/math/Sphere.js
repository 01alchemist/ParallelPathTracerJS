System.register(["./Vec3f", "./Intersection", "../Config", "./Primitive"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Vec3f_1, Intersection_1, Config_1, Primitive_1;
    var Sphere;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Intersection_1_1) {
                Intersection_1 = Intersection_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Primitive_1_1) {
                Primitive_1 = Primitive_1_1;
            }],
        execute: function() {
            Sphere = (function (_super) {
                __extends(Sphere, _super);
                function Sphere(pos, radius) {
                    _super.call(this, pos);
                    this.type = "sphere";
                    this.radius = radius;
                }
                Sphere.prototype.intersect = function (r) {
                    var SP;
                    var t;
                    var b;
                    var d;
                    SP = this.vertices[0].sub(r.getPos());
                    b = SP.dot(r.getDir());
                    d = b * b - SP.dot(SP) + this.radius * this.radius;
                    if (d < 0.0)
                        return null;
                    d = Math.sqrt(d);
                    t = (t = b - d) > Config_1.Config.epsilon ? t : ((t = b + d) > Config_1.Config.epsilon ? t : -1.0);
                    if (t == -1.0)
                        return null;
                    var x = new Intersection_1.Intersection();
                    x.setPos(r.getPos().add(r.getDir().scale(t)));
                    x.setNorm(x.getPos().sub(this.vertices[0]).divide(this.radius));
                    x.setT(t);
                    return x;
                };
                Sphere.cast = function (obj) {
                    var sphere = new Sphere(new Vec3f_1.Vec3f().set(obj.vertices[0]), obj.radius);
                    return sphere;
                };
                return Sphere;
            })(Primitive_1.Primitive);
            exports_1("Sphere", Sphere);
        }
    }
});
//# sourceMappingURL=Sphere.js.map