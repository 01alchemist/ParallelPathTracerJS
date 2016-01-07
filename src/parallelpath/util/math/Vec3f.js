System.register(["./Vec2f"], function(exports_1) {
    var Vec2f_1;
    var Vec3f;
    return {
        setters:[
            function (Vec2f_1_1) {
                Vec2f_1 = Vec2f_1_1;
            }],
        execute: function() {
            Vec3f = (function () {
                function Vec3f(x, y, z) {
                    this.x = x = x == undefined ? 0 : x;
                    this.y = y == undefined ? x : y;
                    this.z = z == undefined ? x : z;
                }
                Vec3f.prototype._isThis = function (value) {
                    return value instanceof Object || value instanceof Vec3f;
                };
                Object.defineProperty(Vec3f.prototype, "xy", {
                    get: function () {
                        return new Vec2f_1.Vec2f(this.x, this.y);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vec3f.prototype, "xz", {
                    get: function () {
                        return new Vec2f_1.Vec2f(this.x, this.z);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vec3f.prototype, "yz", {
                    get: function () {
                        return new Vec2f_1.Vec2f(this.y, this.z);
                    },
                    enumerable: true,
                    configurable: true
                });
                Vec3f.prototype.toString = function () {
                    return "Vec3f[" + this.x + "," + this.y + "," + this.z + "]";
                };
                Vec3f.prototype.equals = function (v) {
                    return (this.x == v.x && this.y == v.y && this.z == v.z);
                };
                Vec3f.prototype.set = function (x, y, z) {
                    this.x = x = x == undefined ? 0 : x;
                    this.y = y == undefined ? x : y;
                    this.z = z == undefined ? x : z;
                    return this;
                };
                Vec3f.prototype.setVec = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                    return this;
                };
                Vec3f.prototype.add = function (v) {
                    return new Vec3f(this.x + v.x, this.y + v.y, this.z + v.z);
                };
                Vec3f.prototype.addNumber = function (f) {
                    return new Vec3f(this.x + f, this.y + f, this.z + f);
                };
                Vec3f.prototype.sub = function (v) {
                    return new Vec3f(this.x - v.x, this.y - v.y, this.z - v.z);
                };
                Vec3f.prototype.subNumber = function (f) {
                    return new Vec3f(this.x - f, this.y - f, this.z - f);
                };
                Vec3f.prototype.scale = function (v) {
                    return new Vec3f(this.x * v.x, this.y * v.y, this.z * v.z);
                };
                Vec3f.prototype.scaleNumber = function (f) {
                    return new Vec3f(this.x * f, this.y * f, this.z * f);
                };
                Vec3f.prototype.divide = function (v) {
                    return new Vec3f(this.x / v.x, this.y / v.y, this.z / v.z);
                };
                Vec3f.prototype.divideNumber = function (f) {
                    return new Vec3f(this.x / f, this.y / f, this.z / f);
                };
                Vec3f.prototype.distance = function (v) {
                    var dx = this.x - v.x;
                    var dy = this.y - v.y;
                    var dz = this.z - v.z;
                    return Math.sqrt(dx * dx + dy * dy + dz * dz);
                };
                Vec3f.prototype.cross = function (v) {
                    var x = this.y * v.z - v.y * this.z;
                    var y = this.z * v.x - v.z * this.x;
                    var z = this.x * v.y - v.x * this.y;
                    return new Vec3f(x, y, z);
                };
                Vec3f.prototype.dot = function (v) {
                    return this.x * v.x + this.y * v.y + this.z * v.z;
                };
                Vec3f.prototype.mul = function (q) {
                    var q_inv = q.conjugate();
                    var w = q.mulVector(this).mul(q_inv);
                    return new Vec3f(w.x, w.y, w.z);
                };
                Vec3f.prototype.length = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                };
                Vec3f.prototype.normalize = function () {
                    var length = this.length();
                    return new Vec3f(this.x / length, this.y / length, this.z / length);
                };
                Vec3f.prototype.negate = function () {
                    return new Vec3f(-this.x, -this.y, -this.z);
                };
                Vec3f.prototype.reflect = function (N) {
                    return this.sub(N.scaleNumber(N.dot(this)).scaleNumber(2.0));
                };
                Vec3f.prototype.refract = function (N, n, NdotI, cos_t) {
                    cos_t = Math.sqrt(1.0 - cos_t);
                    if (cos_t < 1.0)
                        return this.scaleNumber(n).add(N.scaleNumber(n * NdotI - cos_t));
                    else
                        return this.reflect(N);
                };
                Vec3f.prototype.rotateTowards = function (w) {
                    var dot = w.z;
                    if (dot > 0.9999) {
                        return new Vec3f(this.x, this.y, this.z);
                    }
                    if (dot < -0.9999) {
                        return new Vec3f(this.x, this.y, -this.z);
                    }
                    var up = new Vec3f(0.0, 0.0, 1.0);
                    var a1 = up.cross(w).normalize();
                    var a2 = a1.cross(w).normalize();
                    return a1.scaleNumber(this.x).add(a2.scaleNumber(this.y)).add(w.scaleNumber(this.z)).normalize();
                };
                Vec3f.prototype.randomHemisphere = function () {
                    var phi = Math.random() * (2.0 * Math.PI);
                    var rq = Math.random();
                    var r = Math.sqrt(rq);
                    var V = new Vec3f(Math.cos(phi) * r, Math.sin(phi) * r, Math.sqrt(1.0 - rq)).normalize();
                    return V.rotateTowards(this);
                };
                Vec3f.prototype.getComponent = function (i, w) {
                    if (i == 0)
                        return this.x;
                    else if (i == 1)
                        return this.y;
                    else if (i == 2)
                        return this.z;
                    else if (i == 3)
                        return w;
                    else
                        return 0.0;
                };
                Vec3f.prototype.setComponent = function (i, value) {
                    if (i == 0)
                        this.x = value;
                    else if (i == 1)
                        this.y = value;
                    else if (i == 2)
                        this.z = value;
                };
                return Vec3f;
            })();
            exports_1("Vec3f", Vec3f);
        }
    }
});
//# sourceMappingURL=Vec3f.js.map