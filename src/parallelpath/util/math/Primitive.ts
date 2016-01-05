import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";

export abstract class Primitive
{

	public type:string;
    public vertices:Vec3f[];

    constructor(arg:Vec3f|Vec3f[])
    {
        let pos:Vec3f = arg instanceof Vec3f?arg:null;

        if(pos){
            this.vertices = [];
            this.vertices[0] = pos;
        }else{
            this.vertices = <Vec3f[]>arg;
        }

    }

	public abstract intersect(r:Ray):Intersection;

	getVertices():Vec3f[]
	{
		return this.vertices;
	}

}
