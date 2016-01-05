import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";
import {Config} from "../Config";
import {Primitive} from "./Primitive";

export class Sphere extends Primitive
{

	private radius:number;

    constructor(pos:Vec3f, radius:number)
	{
		super(pos);
		this.type = "sphere";
		this.radius = radius;
	}

	intersect(r:Ray):Intersection
	{
		let SP:Vec3f;
		let t:number;
        let b:number;
        let d:number;

		SP = this.vertices[0].sub(r.getPos());
		b = SP.dot(r.getDir());
		d = b * b - SP.dot(SP) + this.radius * this.radius;

		if (d < 0.0)
			return null;

		d = Math.sqrt(d);
		t = (t = b - d) > Config.epsilon ? t : ((t = b + d) > Config.epsilon ? t : -1.0);

		if (t == -1.0)
			return null;

        let x:Intersection = new Intersection();
		x.setPos(r.getPos().add(r.getDir().scale(t)));
		x.setNorm(x.getPos().sub(this.vertices[0]).divide(this.radius));
		x.setT(t);

		return x;
	}

	static cast(obj):Sphere{
		var sphere:Sphere = new Sphere(new Vec3f().set(obj.vertices[0]), obj.radius);
		return sphere;
	}
}
