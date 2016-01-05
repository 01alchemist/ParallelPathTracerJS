System.register(["../util/math/Vec3f", "../util/Config"], function(exports_1) {
    var Vec3f_1, Config_1, Config_2, Config_3;
    var Shader;
    return {
        setters:[
            function (Vec3f_1_1) {
                Vec3f_1 = Vec3f_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
                Config_2 = Config_1_1;
                Config_3 = Config_1_1;
            }],
        execute: function() {
            Shader = (function () {
                function Shader() {
                }
                Shader.main = function (r, x, l, m) {
                    var C;
                    var N = x.getNorm();
                    var L;
                    var V;
                    var H;
                    var NdotL;
                    var NdotV;
                    var NdotH;
                    var VdotH;
                    var lambertian;
                    var specular;
                    var roughness;
                    var L_length;
                    var A = 1.0;
                    if (l.getLightType() == Config_1.light_types.DIRECTIONAL) {
                        L = l.getDir().negate().normalize();
                        V = r.getDir().negate();
                        H = V.add(L).normalize();
                    }
                    else if (l.getLightType() == Config_1.light_types.POINT) {
                        L = l.getPos().sub(x.getPos());
                        L_length = L.length();
                        L = L.normalize();
                        V = r.getDir().negate();
                        H = V.add(L).normalize();
                        A = l.getConstant() + l.getLinear() * L_length + l.getExponent() * L_length * L_length + Config_2.Config.epsilon;
                    }
                    else {
                        return Shader.COLOR_NULL;
                    }
                    NdotL = Math.min(N.dot(L), 1.0);
                    NdotV = Math.min(N.dot(V), 1.0);
                    NdotH = Math.min(N.dot(H), 1.0);
                    VdotH = Math.min(V.dot(H), 1.0);
                    if (m.getMaterialType() == Config_3.material_types.PHONG) {
                        C = new Vec3f_1.Vec3f();
                        lambertian = Math.min(NdotL, 1.0);
                        if (m.getShininess() > 0.0)
                            specular = Math.pow(NdotH, m.getShininess());
                        else
                            specular = 0.0;
                        C.set(C.add(l.getColor().scale(m.getColorDiffuse()).scale(lambertian).scale(l.getIntensity())));
                        C.set(C.add(m.getColorSpecular().scale(specular).scale(l.getIntensity())));
                    }
                    else if (m.getMaterialType() == Config_3.material_types.COOKTORRANCE) {
                        C = new Vec3f_1.Vec3f();
                        if (NdotL < Config_2.Config.epsilon)
                            return Shader.COLOR_NULL;
                        var R = m.getRoughness();
                        var F = m.getFresnel();
                        var K = m.getDensity();
                        var geo_numerator = 2.0 * NdotH;
                        var geo_denominator = VdotH;
                        var geo_a = (geo_numerator * NdotV) / geo_denominator;
                        var geo_b = (geo_numerator * NdotL) / geo_denominator;
                        lambertian = Math.min(1.0, Math.min(geo_a, geo_b));
                        var roughness_a = 1.0 / (4.0 * R * R * Math.pow(NdotH, 4));
                        var roughness_b = NdotH * NdotH - 1.0;
                        var roughness_c = R * R * NdotH * NdotH;
                        roughness = roughness_a * Math.exp(roughness_b / roughness_c);
                        specular = Math.pow(1.0 - VdotH, 5);
                        specular *= 1.0 - F;
                        specular += F;
                        var Rs_numerator = lambertian * roughness * specular;
                        var Rs_denominator = Math.max(NdotV * NdotL, Config_2.Config.epsilon);
                        var Rs = Rs_numerator / Rs_denominator;
                        var final_a = l.getColor().scale(NdotL).scale(l.getIntensity());
                        var final_b = m.getColorDiffuse().scale(K).add(m.getColorSpecular().scale(Rs * (1.0 - K)));
                        C.set(final_a.scale(final_b));
                    }
                    else {
                        return Shader.COLOR_NULL;
                    }
                    return C.divide(A);
                };
                Shader.COLOR_NULL = new Vec3f_1.Vec3f(0);
                Shader.COLOR_RED = new Vec3f_1.Vec3f(1, 0, 0);
                Shader.COLOR_WHITE = new Vec3f_1.Vec3f(1);
                return Shader;
            })();
            exports_1("Shader", Shader);
        }
    }
});
//# sourceMappingURL=Shader.js.map