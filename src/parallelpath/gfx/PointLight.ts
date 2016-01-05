import {Light} from "./Light";
import {Vec3f} from "../util/math/Vec3f";
import {light_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class PointLight extends Light{

    constructor(pos:Vec3f, color:Vec3f, intensity:number, constant:number, linear:number, exponent:number)
    {
        super();
        this.light_type = light_types.POINT;
        this.pos = pos;
        this.color = color;
        this.intensity = intensity;
        this.constant = constant;
        this.linear = linear;
        this.exponent = exponent;
    }

}
