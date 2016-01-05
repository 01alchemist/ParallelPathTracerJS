System.register(["./Material", "../util/math/Vec3f", "../util/Config"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Vec3f_1, Config_1;
    var CookTorranceMaterial;
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
            CookTorranceMaterial = (function (_super) {
                __extends(CookTorranceMaterial, _super);
                function CookTorranceMaterial(color_ambient, color_diffuse, color_specular, roughness, fresnel, density, reflectivity, refractivity, ior) {
                    _super.call(this);
                    this.emittance = new Vec3f_1.Vec3f();
                    this.material_type = Config_1.material_types.COOKTORRANCE;
                    this.color_ambient = color_ambient;
                    this.color_diffuse = color_diffuse;
                    this.color_specular = color_specular;
                    this.roughness = roughness;
                    this.fresnel = fresnel;
                    this.density = density;
                    this.reflectivity = reflectivity;
                    this.refractivity = refractivity;
                    this.ior = ior;
                }
                return CookTorranceMaterial;
            })(Material_1.Material);
            exports_1("CookTorranceMaterial", CookTorranceMaterial);
        }
    }
});
//# sourceMappingURL=CookTorranceMaterial.js.map