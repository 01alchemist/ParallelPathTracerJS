System.register(["./TracerObject", "../util/math/Vec3f", "./CookTorranceMaterial", "./PointLight"], function(exports_1) {
    var TracerObject_1, Vec3f_1, CookTorranceMaterial_1, PointLight_1;
    var Scene;
    return {
        setters:[
            function (TracerObject_1_1) {
                TracerObject_1 = TracerObject_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (CookTorranceMaterial_1_1) {
                CookTorranceMaterial_1 = CookTorranceMaterial_1_1;
            },
            function (PointLight_1_1) {
                PointLight_1 = PointLight_1_1;
            }],
        execute: function() {
            Scene = (function () {
                function Scene() {
                    this.objects = [];
                    this.lights = [];
                    var diffuse_white = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(1.0), new Vec3f_1.Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
                    var diffuse_red = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(1.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
                    var diffuse_green = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 1.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
                    var diffuse_blue = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 0.0, 1.0), new Vec3f_1.Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
                    var reflective_red = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(1.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.10, 1.0, 0.5, 0.25, 0, 0);
                    var reflective_green = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 1.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.05, 1.0, 0.5, 0.50, 0, 0);
                    var reflective_blue = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 0.0, 1.0), new Vec3f_1.Vec3f(1.0), 0.20, 1.0, 0.75, 0.375, 0, 0);
                    var reflective_metal = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.10, 1.0, 0.5, 1.0, 0, 0);
                    var refractive_glass = new CookTorranceMaterial_1.CookTorranceMaterial(new Vec3f_1.Vec3f(0.01), new Vec3f_1.Vec3f(0.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0), 0.10, 1.0, 0.5, 0.0, 1.0, 1.52);
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 0.0, 0.0), new Vec3f_1.Vec3f(0.0, 1.0, 0.0), diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 5.0, 0.0), new Vec3f_1.Vec3f(0.0, -1.0, 0.0), diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 0.0, -10.0), new Vec3f_1.Vec3f(0.0, 0.0, 1.0), diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(4.0, 0.0, 0.0), new Vec3f_1.Vec3f(-1.0, 0.0, 0.0), diffuse_red));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(-4.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0, 0.0, 0.0), diffuse_blue));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(1.0, 0.75, -4.0), 0.75, reflective_metal));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(-1.0, 0.75, -5.0), 0.75, refractive_glass));
                    this.lights.push(new PointLight_1.PointLight(new Vec3f_1.Vec3f(0.0, 4.0, -5.0), new Vec3f_1.Vec3f(1.0), 1.0, 0.0, 0.0, 0.1));
                }
                Scene.prototype.update = function (dt) {
                };
                Scene.prototype.getObjects = function () {
                    return this.objects;
                };
                Scene.prototype.getLights = function () {
                    return this.lights;
                };
                return Scene;
            })();
            exports_1("Scene", Scene);
        }
    }
});
//# sourceMappingURL=Scene.js.map