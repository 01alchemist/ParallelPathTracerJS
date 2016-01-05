import {Primitive} from "../util/math/Primitive";
import {Material} from "./Material";
import {Vec3f} from "../util/math/Vec3f";
import {Sphere} from "../util/math/Sphere";
import {Plane} from "../util/math/Plane";

export class TracerObject {

    public primitives:Array<Primitive>;
    public material:Material;

    constructor(arg1:Vec3f|Array<Primitive>, arg2:Vec3f|number|Material, arg3?:Material) {
        if (arg1 instanceof Vec3f) {
            let pos:Vec3f = <Vec3f>arg1;
            this.primitives = [];
            if (arg2 instanceof Vec3f) {
                this.primitives.push(new Plane(pos, <Vec3f>arg2));
            } else {
                this.primitives.push(new Sphere(pos, <number>arg2));
            }
            this.material = <Material>arg3;
        } else {
            this.primitives = <Array<Primitive>>arg1;
            this.material = <Material>arg2;
        }

    }

    getPrimitives():Array<Primitive> {
        return this.primitives;
    }

    getMaterial():Material {
        return this.material;
    }

}
