import {Vec3f} from "../util/math/Vec3f";
import {Material} from "../gfx/Material";
import {Light} from "../gfx/Light";
import {Intersection} from "../util/math/Intersection";
import {Ray} from "../util/math/Ray";
import {light_types} from "../util/Config";
import {Config} from "../util/Config";
import {material_types} from "../util/Config";

export class Shader
{

	static COLOR_NULL:Vec3f = new Vec3f(0);
	static COLOR_RED:Vec3f = new Vec3f(1,0,0);
	static COLOR_WHITE:Vec3f = new Vec3f(1);

	constructor()
	{

	}

	static main(r:Ray, x:Intersection, l:Light, m:Material):Vec3f
	{
		var C:Vec3f;
        var N:Vec3f = x.norm;
        var L:Vec3f;
        var V:Vec3f;
        var H:Vec3f;

		var NdotL:number;
        var NdotV:number;
        var NdotH:number;
        var VdotH:number;
        var lambertian:number;
        var specular:number;
        var roughness:number;
        var L_length:number;
        var A:number = 1.0;

		if (l.light_type == light_types.DIRECTIONAL)
		{
			L = l.dir.negate().normalize();
			V = r.dir.negate();
			H = V.add(L).normalize();
		} else if (l.light_type == light_types.POINT)
		{
			L = l.pos.sub(x.pos);
			L_length = L.length();
			L = L.normalize();
			V = r.dir.negate();
			H = V.add(L).normalize();
			A = l.constant + l.linear * L_length + l.exponent * L_length * L_length + Config.epsilon;
		} else
		{
			return Shader.COLOR_NULL;
		}

		// Calculate the dot products required for shading
		NdotL = Math.min(N.dot(L), 1.0);
		NdotV = Math.min(N.dot(V), 1.0);
		NdotH = Math.min(N.dot(H), 1.0);
		VdotH = Math.min(V.dot(H), 1.0);

		if (m.material_type == material_types.PHONG)
		{
			C = new Vec3f();

			// Calculate the lambertian term
			lambertian = Math.min(NdotL, 1.0);

			// Calculate the specular term
			if (m.shininess > 0.0)
				specular = Math.pow(NdotH, m.shininess); // Specular
			else
				specular = 0.0;

			// Add all the terms together to C
			C.setVec(C.add(l.color.scale(m.color_diffuse).scaleNumber(lambertian).scaleNumber(l.intensity)));
			C.setVec(C.add(m.color_specular.scaleNumber(specular).scaleNumber(l.intensity)));
		} else if (m.material_type == material_types.COOKTORRANCE)
		{
			C = new Vec3f();

			// Return NULL color if the surface normal and light direction are facing opposite directions
			if (NdotL < Config.epsilon)
				return Shader.COLOR_NULL;

			// Get the surface properties
			var R:number = m.roughness;
			var F:number = m.fresnel;
			var K:number = m.density;

			// Evaluate the geometric term
			var geo_numerator:number = 2.0 * NdotH;
			var geo_denominator:number = VdotH;
			var geo_a:number = (geo_numerator * NdotV) / geo_denominator;
			var geo_b:number = (geo_numerator * NdotL) / geo_denominator;
			lambertian = Math.min(1.0, Math.min(geo_a, geo_b));

			// Evaluate the roughness term
			var roughness_a:number = 1.0 / (4.0 * R * R * Math.pow(NdotH, 4));
			var roughness_b:number = NdotH * NdotH - 1.0;
			var roughness_c:number = R * R * NdotH * NdotH;
			roughness = roughness_a * Math.exp(roughness_b / roughness_c);

			// Evaluate the fresnel term
			specular = Math.pow(1.0 - VdotH, 5);
			specular *= 1.0 - F;
			specular += F;

			// Put all the terms together
			var Rs_numerator:number = lambertian * roughness * specular;
			var Rs_denominator:number = Math.max(NdotV * NdotL, Config.epsilon);
			var Rs:number = Rs_numerator / Rs_denominator;

			// Add all the terms to C
			var final_a:Vec3f = l.color.scaleNumber(NdotL).scaleNumber(l.intensity);
			var final_b:Vec3f = m.color_diffuse.scaleNumber(K).add(m.color_specular.scaleNumber(Rs * (1.0 - K)));
			C.setVec(final_a.scale(final_b));
		} else
		{
			return Shader.COLOR_NULL;
		}

		return C.divideNumber(A);
	}

}
