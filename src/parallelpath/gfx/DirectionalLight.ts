import {Light} from "./Light";
import {Vec3f} from "../util/math/Vec3f";
import {light_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class DirectionalLight extends Light{

    constructor(dir:Vec3f, color:Vec3f, intensity:number)
    {
        super();
        this.light_type = light_types.DIRECTIONAL;
        this.dir = dir.normalize();
        this.color = color;
        this.intensity = intensity;
    }

}
