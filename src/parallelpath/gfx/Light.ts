import {light_types} from "../util/Config";
import {Vec3f} from "../util/math/Vec3f";

export class Light
{

	// Light type
	public light_type:light_types;

	// General light variables
	public color:Vec3f;
	public intensity:number;

	// Directional light variables
	public dir:Vec3f;

	// Point light variables
	public pos:Vec3f;
	public constant:number;
	public linear:number;
	public exponent:number;

	constructor(){
    }

	getLightType():light_types
	{
		return this.light_type;
	}

	getPos():Vec3f
	{
		return this.pos;
	}

	getDir():Vec3f
	{
		return this.dir;
	}

	getColor():Vec3f
	{
		return this.color;
	}

	getIntensity():number
	{
		return this.intensity;
	}

	getConstant():number
	{
		return this.constant;
	}

	getLinear():number
	{
		return this.linear;
	}

	getExponent():number
	{
		return this.exponent;
	}

	static cast(obj):Light{
		var light = new Light();
		light.light_type = obj.light_type;
		light.color = new Vec3f().set(obj.color);
		light.intensity = obj.intensity;
		light.dir = obj.dir?new Vec3f().set(obj.dir):obj.dir;
		light.pos = obj.pos?new Vec3f().set(obj.pos):obj.pos;
		light.constant = obj.constant;
		light.linear = obj.linear;
		light.exponent = obj.exponent;

		return light;
	}

}
