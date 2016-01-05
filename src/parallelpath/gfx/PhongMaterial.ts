import {Material} from "./Material";
import {Vec3f} from "../util/math/Vec3f";
import {material_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class PhongMaterial extends Material{

    constructor(color_ambient:Vec3f, color_diffuse:Vec3f, color_specular:Vec3f, shininess:number, reflectivity:number, refractivity:number, ior:number)
    {
        super();
        this.emittance = new Vec3f();
        this.material_type = material_types.PHONG;
        this.color_ambient = color_ambient;
        this.color_diffuse = color_diffuse;
        this.color_specular = color_specular;
        this.shininess = shininess;
        this.reflectivity = reflectivity;
        this.refractivity = refractivity;
        this.ior = ior;
    }
}
