System.register(["./Vec3f"], function(exports_1) {
    var Vec3f_1;
    var Primitive;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Primitive = (function () {
                function Primitive(arg) {
                    var pos = arg instanceof Vec3f_1.Vec3f ? arg : null;
                    if (pos) {
                        this.vertices = [];
                        this.vertices[0] = pos;
                    }
                    else {
                        this.vertices = arg;
                    }
                }
                Primitive.prototype.getVertices = function () {
                    return this.vertices;
                };
                return Primitive;
            })();
            exports_1("Primitive", Primitive);
        }
    }
});
//# sourceMappingURL=Primitive.js.map