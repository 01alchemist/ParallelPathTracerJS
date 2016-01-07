System.register(["./Vec3f"], function(exports_1) {
    var Vec3f_1;
    var Ray;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Ray = (function () {
                function Ray(pos, dir, ior) {
                    this.pos = pos || new Vec3f_1.Vec3f();
                    this.dir = dir ? dir.normalize() : new Vec3f_1.Vec3f();
                    this.ior = ior || 1.0;
                }
                Ray.prototype.clone = function () {
                    return new Ray(this.pos, this.dir, this.ior);
                };
                Ray.calcCameraRay = function (camera, w, h, ar, x, y) {
                    var x_norm = (x - w * 0.5) / w * ar;
                    var y_norm = (h * 0.5 - y) / h;
                    var forward = camera.getForward();
                    var up = camera.getUp();
                    var right = camera.getRight();
                    var image_point = right.scaleNumber(x_norm).add(up.scaleNumber(y_norm)).add(camera.pos.add(forward));
                    var ray_direction = image_point.sub(camera.pos);
                    return new Ray(camera.pos, ray_direction);
                };
                Ray.calcSupersampledCameraRay = function (camera, w, h, ar, x, y, jitter) {
                    var x_norm = (x - w * 0.5) / w * ar;
                    var y_norm = (h * 0.5 - y) / h;
                    var forward = camera.getForward();
                    var up = camera.getUp();
                    var right = camera.getRight();
                    var image_point = right.scaleNumber(x_norm).add(up.scaleNumber(y_norm)).add(camera.pos.add(forward));
                    image_point = image_point.add(new Vec3f_1.Vec3f(jitter * Math.random() - (jitter / 2.0), jitter * Math.random() - (jitter / 2.0), 0.0));
                    var ray_direction = image_point.sub(camera.pos);
                    return new Ray(camera.pos, ray_direction);
                };
                Ray.prototype.getPos = function () {
                    return this.pos;
                };
                Ray.prototype.getDir = function () {
                    return this.dir;
                };
                Ray.prototype.getIOR = function () {
                    return this.ior;
                };
                Ray.prototype.setPos = function (pos) {
                    this.pos.setVec(pos);
                };
                Ray.prototype.setDir = function (dir) {
                    this.dir.setVec(dir);
                };
                Ray.prototype.setIOR = function (ior) {
                    this.ior = ior;
                };
                return Ray;
            })();
            exports_1("Ray", Ray);
        }
    }
});
//# sourceMappingURL=Ray.js.map