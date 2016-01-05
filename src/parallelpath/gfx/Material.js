System.register(["../util/math/Vec3f"], function(exports_1) {
    var Vec3f_1;
    var Material;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            }],
        execute: function() {
            Material = (function () {
                function Material() {
                    this.glossiness = 0;
                }
                Material.cast = function (obj) {
                    var mat = new Material();
                    mat.material_type = obj.material_type;
                    mat.color_ambient = obj.color_ambient ? new Vec3f_1.Vec3f().set(obj.color_ambient) : new Vec3f_1.Vec3f(1);
                    mat.color_diffuse = obj.color_diffuse ? new Vec3f_1.Vec3f().set(obj.color_diffuse) : new Vec3f_1.Vec3f(1);
                    mat.color_specular = obj.color_specular ? new Vec3f_1.Vec3f().set(obj.color_specular) : new Vec3f_1.Vec3f(0);
                    mat.reflectivity = obj.reflectivity;
                    mat.refractivity = obj.refractivity;
                    mat.ior = obj.ior;
                    mat.shininess = obj.shininess;
                    mat.roughness = obj.roughness;
                    mat.fresnel = obj.fresnel;
                    mat.density = obj.density;
                    mat.glossiness = obj.glossiness;
                    mat.emittance = obj.emittance ? new Vec3f_1.Vec3f().set(obj.emittance) : new Vec3f_1.Vec3f(0);
                    mat.reflectance = obj.reflectance ? new Vec3f_1.Vec3f().set(obj.reflectance) : new Vec3f_1.Vec3f(1);
                    return mat;
                };
                Material.prototype.getMaterialType = function () {
                    return this.material_type;
                };
                Material.prototype.getEmittance = function () {
                    return this.emittance;
                };
                Material.prototype.getColorAmbient = function () {
                    return this.color_ambient;
                };
                Material.prototype.getColorDiffuse = function () {
                    return this.color_diffuse;
                };
                Material.prototype.getColorSpecular = function () {
                    return this.color_specular;
                };
                Material.prototype.getShininess = function () {
                    return this.shininess;
                };
                Material.prototype.getRoughness = function () {
                    return this.roughness;
                };
                Material.prototype.getFresnel = function () {
                    return this.fresnel;
                };
                Material.prototype.getDensity = function () {
                    return this.density;
                };
                Material.prototype.getReflectivity = function () {
                    return this.reflectivity;
                };
                Material.prototype.getRefractivity = function () {
                    return this.refractivity;
                };
                Material.prototype.getIOR = function () {
                    return this.ior;
                };
                return Material;
            })();
            exports_1("Material", Material);
        }
    }
});
//# sourceMappingURL=Material.js.map