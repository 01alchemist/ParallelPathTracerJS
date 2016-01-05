System.register(["./Material", "../util/math/Vec3f", "../util/Config"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Vec3f_1, Config_1;
    var PhongMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            }],
        execute: function() {
            PhongMaterial = (function (_super) {
                __extends(PhongMaterial, _super);
                function PhongMaterial(color_ambient, color_diffuse, color_specular, shininess, reflectivity, refractivity, ior) {
                    _super.call(this);
                    this.emittance = new Vec3f_1.Vec3f();
                    this.material_type = Config_1.material_types.PHONG;
                    this.color_ambient = color_ambient;
                    this.color_diffuse = color_diffuse;
                    this.color_specular = color_specular;
                    this.shininess = shininess;
                    this.reflectivity = reflectivity;
                    this.refractivity = refractivity;
                    this.ior = ior;
                }
                return PhongMaterial;
            })(Material_1.Material);
            exports_1("PhongMaterial", PhongMaterial);
        }
    }
});
//# sourceMappingURL=PhongMaterial.js.map