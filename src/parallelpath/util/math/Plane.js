System.register(["./Primitive", "./Vec3f", "./Intersection", "../Config"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Primitive_1, Vec3f_1, Intersection_1, Config_1;
    var Plane;
    return {
        setters:[
            function (Primitive_1_1) {
                Primitive_1 = Primitive_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Intersection_1_1) {
                Intersection_1 = Intersection_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            }],
        execute: function() {
            Plane = (function (_super) {
                __extends(Plane, _super);
                function Plane(pos, normal) {
                    _super.call(this, pos);
                    this.type = "plane";
                    this.normal = normal;
                }
                Plane.prototype.intersect = function (r) {
                    var P;
                    var d;
                    var t;
                    P = this.vertices[0].sub(r.getPos());
                    d = this.normal.dot(r.getDir());
                    if (d > 0.0)
                        return null;
                    t = P.dot(this.normal) / d;
                    if (t < Config_1.Config.epsilon)
                        return null;
                    var x = new Intersection_1.Intersection();
                    x.setPos(r.getPos().add(r.getDir().scale(t)));
                    x.setNorm(this.normal.normalize());
                    x.setT(t);
                    return x;
                };
                Plane.cast = function (obj) {
                    var plane = new Plane(new Vec3f_1.Vec3f().set(obj.vertices[0]), new Vec3f_1.Vec3f().set(obj.normal));
                    return plane;
                };
                return Plane;
            })(Primitive_1.Primitive);
            exports_1("Plane", Plane);
        }
    }
});
//# sourceMappingURL=Plane.js.map