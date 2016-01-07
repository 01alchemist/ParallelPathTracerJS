System.register(["./TracerObject", "../util/math/Vec3f", "./materials/GlassMaterial", "./materials/EmissiveMaterial", "./materials/DiffuseMaterial"], function(exports_1) {
    var TracerObject_1, Vec3f_1, GlassMaterial_1, EmissiveMaterial_1, DiffuseMaterial_1;
    var Scene;
    return {
        setters:[
            function (TracerObject_1_1) {
                TracerObject_1 = TracerObject_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (GlassMaterial_1_1) {
                GlassMaterial_1 = GlassMaterial_1_1;
            },
            function (EmissiveMaterial_1_1) {
                EmissiveMaterial_1 = EmissiveMaterial_1_1;
            },
            function (DiffuseMaterial_1_1) {
                DiffuseMaterial_1 = DiffuseMaterial_1_1;
            }],
        execute: function() {
            Scene = (function () {
                function Scene() {
                    this.objects = [];
                    this.lights = [];
                    var mat_diffuse_white = new DiffuseMaterial_1.DiffuseMaterial(new Vec3f_1.Vec3f(1, 1, 1));
                    var mat_diffuse_blue = new DiffuseMaterial_1.DiffuseMaterial(new Vec3f_1.Vec3f(0, 0, 1));
                    var mat_refractive_glass = new GlassMaterial_1.GlassMaterial(new Vec3f_1.Vec3f(0.0), 0.0, 1.0, 1.52, 0.0);
                    var mat_mirror = new GlassMaterial_1.GlassMaterial(new Vec3f_1.Vec3f(0.0, 1.0, 0.0), 1.0, 0.0, 1.0, 0.0);
                    var mat_light_white = new EmissiveMaterial_1.EmissiveMaterial(new Vec3f_1.Vec3f(1, 1, 1), new Vec3f_1.Vec3f(0.0));
                    var mat_light_red = new EmissiveMaterial_1.EmissiveMaterial(new Vec3f_1.Vec3f(1, 0, 0), new Vec3f_1.Vec3f(0.0));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 0.0, 0.0), new Vec3f_1.Vec3f(0.0, 1.0, 0.0), mat_diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 5.0, 0.0), new Vec3f_1.Vec3f(0.0, -1.0, 0.0), mat_light_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(0.0, 0.0, -10.0), new Vec3f_1.Vec3f(0.0, 0.0, 1.0), mat_diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(4.0, 0.0, 0.0), new Vec3f_1.Vec3f(-1.0, 0.0, 0.0), mat_diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(-4.0, 0.0, 0.0), new Vec3f_1.Vec3f(1.0, 0.0, 0.0), mat_diffuse_white));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(1.0, 0.75, -4.0), 0.75, mat_diffuse_blue));
                    this.objects.push(new TracerObject_1.TracerObject(new Vec3f_1.Vec3f(-1.0, 0.75, -5.0), 0.75, mat_diffuse_blue));
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