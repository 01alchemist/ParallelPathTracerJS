import {Vec3f} from "./Vec3f";

export class Intersection
{

	public pos:Vec3f;
	public norm:Vec3f;
	public t:number;

	constructor(pos?:Vec3f, norm?:Vec3f, t?:number)
	{
		this.pos = pos || new Vec3f();
		this.norm = norm || new Vec3f();
		this.t = t || 0.0;
	}

	getPos():Vec3f
	{
		return this.pos;
	}

	getNorm():Vec3f
	{
		return this.norm;
	}

	getT():number
	{
		return this.t;
	}

	setPos(pos:Vec3f):void
	{
		this.pos.set(pos);
	}

	setNorm(norm:Vec3f):void
	{
		this.norm.set(norm);
	}

	setT(t:number):void
	{
		this.t = t;
	}

}
