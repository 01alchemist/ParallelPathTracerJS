import {Material} from "../Material";
import {Vec3f} from "../../util/math/Vec3f";
/**
 * Created by r3f on 7/1/2016.
 */
export class DiffuseMaterial extends Material {

    constructor(color:Vec3f) {
        super();
        this.color_diffuse = color;
        this.reflectivity = 0.0;
        this.refractivity = 0.0;
        this.ior = 0.0;
        this.glossiness = 0.0;
    }
}