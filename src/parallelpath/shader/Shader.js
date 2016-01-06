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
                    var N = x.norm;
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
                    if (l.light_type == Config_1.light_types.DIRECTIONAL) {
                        L = l.dir.negate().normalize();
                        V = r.dir.negate();
                        H = V.add(L).normalize();
                    }
                    else if (l.light_type == Config_1.light_types.POINT) {
                        L = l.pos.sub(x.pos);
                        L_length = L.length();
                        L = L.normalize();
                        V = r.dir.negate();
                        H = V.add(L).normalize();
                        A = l.constant + l.linear * L_length + l.exponent * L_length * L_length + Config_2.Config.epsilon;
                    }
                    else {
                        return Shader.COLOR_NULL;
                    }
                    NdotL = Math.min(N.dot(L), 1.0);
                    NdotV = Math.min(N.dot(V), 1.0);
                    NdotH = Math.min(N.dot(H), 1.0);
                    VdotH = Math.min(V.dot(H), 1.0);
                    if (m.material_type == Config_3.material_types.PHONG) {
                        C = new Vec3f_1.Vec3f();
                        lambertian = Math.min(NdotL, 1.0);
                        if (m.shininess > 0.0)
                            specular = Math.pow(NdotH, m.shininess);
                        else
                            specular = 0.0;
                        C.setVec(C.add(l.color.scale(m.color_diffuse).scaleNumber(lambertian).scaleNumber(l.intensity)));
                        C.setVec(C.add(m.color_specular.scaleNumber(specular).scaleNumber(l.intensity)));
                    }
                    else if (m.material_type == Config_3.material_types.COOKTORRANCE) {
                        C = new Vec3f_1.Vec3f();
                        if (NdotL < Config_2.Config.epsilon)
                            return Shader.COLOR_NULL;
                        var R = m.roughness;
                        var F = m.fresnel;
                        var K = m.density;
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
                        var final_a = l.color.scaleNumber(NdotL).scaleNumber(l.intensity);
                        var final_b = m.color_diffuse.scaleNumber(K).add(m.color_specular.scaleNumber(Rs * (1.0 - K)));
                        C.setVec(final_a.scale(final_b));
                    }
                    else {
                        return Shader.COLOR_NULL;
                    }
                    return C.divideNumber(A);
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