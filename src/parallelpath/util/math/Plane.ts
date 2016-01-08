import {Primitive} from "./Primitive";
import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";
import {Config} from "../Config";

export class Plane extends Primitive {

    public normal:Vec3f;

    constructor(pos:Vec3f, normal:Vec3f) {
        super(pos);
        this.type = "plane";
        this.normal = normal;
    }

    intersect(r:Ray):Intersection {
        var P:Vec3f;
        var d:number;
        var t:number;

        P = this.vertices[0].sub(r.origin);
        d = this.normal.dot(r.dir);

        if (d > 0.0)
            return null;

        t = P.dot(this.normal) / d;

        if (t < Config.epsilon)
            return null;

        var x:Intersection = new Intersection();
        x.setPos(r.origin.add(r.dir.scaleNumber(t)));
        x.setNorm(this.normal.normalize());
        x.setT(t);

        return x;
    }

    static cast(obj):Plane{
        var plane:Plane = new Plane(new Vec3f().setVec(obj.vertices[0]), new Vec3f().setVec(obj.normal));
        return plane;
    }

}
