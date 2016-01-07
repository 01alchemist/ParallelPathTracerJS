import {Material} from "./../Material";
import {Vec3f} from "../../util/math/Vec3f";
import {material_types} from "../../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class GlassMaterial extends Material{

    constructor(reflectance:Vec3f, reflectivity:number, refractivity:number, ior:number, glossiness:number)
    {
        super();
        this.emittance = new Vec3f(0);
        this.reflectance = reflectance;
        this.reflectivity = reflectivity;
        this.glossiness = glossiness;
        this.refractivity = refractivity;
        this.ior = ior;
    }
}
