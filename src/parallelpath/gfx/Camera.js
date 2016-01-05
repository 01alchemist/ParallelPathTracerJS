System.register(["../InputListener", "../util/math/Vec3f", "../util/math/Quaternion"], function(exports_1) {
    var InputListener_1, Vec3f_1, Quaternion_1;
    var Camera;
    return {
        setters:[
            function (InputListener_1_1) {
                InputListener_1 = InputListener_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Quaternion_1_1) {
                Quaternion_1 = Quaternion_1_1;
            }],
        execute: function() {
            Camera = (function () {
                function Camera(pos, speed, sensitivity) {
                    this.pos = pos;
                    this.rot = new Quaternion_1.Quaternion(0, 0, 1, 0);
                    this.speed = speed;
                    this.sensitivity = sensitivity;
                }
                Camera.prototype.update = function (dt) {
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_W]) {
                        this.move(this.getForward(), this.speed * dt);
                    }
                    else if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_S]) {
                        this.move(this.getForward().negate(), this.speed * dt);
                    }
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_A]) {
                        this.move(this.getRight().negate(), this.speed * dt);
                    }
                    else if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_D]) {
                        this.move(this.getRight(), this.speed * dt);
                    }
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_R]) {
                        this.move(this.getUp(), this.speed * dt);
                    }
                    else if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_F]) {
                        this.move(this.getUp().negate(), this.speed * dt);
                    }
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_RIGHT])
                        this.rotate(this.getUp(), this.sensitivity * dt);
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_LEFT])
                        this.rotate(this.getUp(), -this.sensitivity * dt);
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_UP])
                        this.rotate(this.getRight(), -this.sensitivity * dt);
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_DOWN])
                        this.rotate(this.getRight(), this.sensitivity * dt);
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_E])
                        this.rotate(this.getForward(), this.sensitivity * dt);
                    if (InputListener_1.InputListener.getKeyboardKeys()[InputListener_1.InputListener.KEY_Q])
                        this.rotate(this.getForward(), -this.sensitivity * dt);
                };
                Camera.prototype.move = function (direction, amount) {
                    this.pos.set(this.pos.add(direction.scale(amount)));
                };
                Camera.prototype.rotate = function (axis, theta) {
                    var rotation = new Quaternion_1.Quaternion().createFromAxisAngle(axis.x, axis.y, axis.z, theta);
                    this.rot = rotation.mul(this.rot).normalize();
                };
                Camera.prototype.getPos = function () {
                    return this.pos;
                };
                Camera.prototype.getRot = function () {
                    return this.rot;
                };
                Camera.prototype.getForward = function () {
                    return this.rot.getForwardVector();
                };
                Camera.prototype.getRight = function () {
                    return this.rot.getRightVector();
                };
                Camera.prototype.getUp = function () {
                    return this.rot.getUpVector();
                };
                Camera.cast = function (obj) {
                    var cam = new Camera(new Vec3f_1.Vec3f(), obj.speed, obj.sensitivity);
                    cam.pos.x = obj.pos.x;
                    cam.pos.y = obj.pos.y;
                    cam.pos.z = obj.pos.z;
                    cam.rot = new Quaternion_1.Quaternion(obj.rot.w, obj.rot.x, obj.rot.y, obj.rot.z);
                    return cam;
                };
                return Camera;
            })();
            exports_1("Camera", Camera);
        }
    }
});
//# sourceMappingURL=Camera.js.map