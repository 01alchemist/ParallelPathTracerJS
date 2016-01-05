System.register(["./MathUtils", "./Vec3f"], function(exports_1) {
    var MathUtils_1, Vec3f_1;
    var Quaternion;
    return {
        setters:[
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Quaternion = (function () {
                function Quaternion(w, x, y, z) {
                    this.w = w == undefined ? 0 : w;
                    this.x = x == undefined ? 0 : x;
                    this.y = y == undefined ? 0 : y;
                    this.z = z == undefined ? 0 : z;
                }
                Quaternion.prototype.set = function (w, x, y, z) {
                    var q = this._isThis(w) ? w : null;
                    if (q) {
                        this.w = q.w;
                        this.x = q.x;
                        this.y = q.y;
                        this.z = q.z;
                    }
                    else {
                        this.w = w;
                        this.x = x;
                        this.y = y;
                        this.z = z;
                    }
                    return this;
                };
                Quaternion.prototype._isThis = function (value) {
                    if (value instanceof Object || value instanceof Quaternion) {
                        if (value.w != undefined && value.x != undefined && value.y != undefined && value.z != undefined) {
                            return true;
                        }
                    }
                    return false;
                };
                Quaternion.prototype.toString = function () {
                    return "Quaternion[" + this.w + "," + this.x + "," + this.y + "," + this.z + "]";
                };
                Quaternion.prototype.equals = function (q) {
                    return (this.w == q.w && this.x == q.x && this.y == q.y && this.z == q.z);
                };
                Quaternion.prototype.createFromAxisAngle = function (x, y, z, theta) {
                    theta = MathUtils_1.MathUtils.toRadians(theta);
                    this.w = Math.cos(theta / 2.0);
                    this.x = x * Math.sin(theta / 2.0);
                    this.y = y * Math.sin(theta / 2.0);
                    this.z = z * Math.sin(theta / 2.0);
                    return this;
                };
                Quaternion.prototype.mul = function (value) {
                    var r = new Quaternion();
                    if (this._isThis(value)) {
                        var q = value;
                        r.w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
                        r.x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
                        r.y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
                        r.z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
                    }
                    else if (value instanceof Vec3f_1.Vec3f || value instanceof Object) {
                        r = this.mulVector(value);
                    }
                    return r;
                };
                Quaternion.prototype.mulVector = function (v) {
                    var r = new Quaternion();
                    r.w = -this.x * v.x - this.y * v.y - this.z * v.z;
                    r.x = this.w * v.x + this.y * v.z - this.z * v.y;
                    r.y = this.w * v.y + this.z * v.x - this.x * v.z;
                    r.z = this.w * v.z + this.x * v.y - this.y * v.x;
                    return r;
                };
                Quaternion.prototype.conjugate = function () {
                    return new Quaternion(this.w, -this.x, -this.y, -this.z);
                };
                Quaternion.prototype.normalize = function () {
                    var length = this.length();
                    return new Quaternion(this.w / length, this.x / length, this.y / length, this.z / length);
                };
                Quaternion.prototype.length = function () {
                    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                };
                Quaternion.prototype.getForwardVector = function () {
                    return new Vec3f_1.Vec3f(0, 0, 1).mul(this);
                };
                Quaternion.prototype.getUpVector = function () {
                    return new Vec3f_1.Vec3f(0, 1, 0).mul(this);
                };
                Quaternion.prototype.getRightVector = function () {
                    return new Vec3f_1.Vec3f(1, 0, 0).mul(this);
                };
                return Quaternion;
            })();
            exports_1("Quaternion", Quaternion);
        }
    }
});
//# sourceMappingURL=Quaternion.js.map