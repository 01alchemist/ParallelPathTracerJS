import {InputListener} from "../InputListener"
import {Vec3f} from "../util/math/Vec3f";
import {Quaternion} from "../util/math/Quaternion";

export class Camera
{

	public pos:Vec3f;
	public rot:Quaternion;
	public speed:number;
	public sensitivity:number;

	constructor(pos:Vec3f, speed:number, sensitivity:number)
	{
		this.pos = pos;
        this.rot = new Quaternion(0, 0, 1, 0);
        this.speed = speed;
        this.sensitivity = sensitivity;
	}

	update(dt:number):void
	{
		// Camera movement
		if (InputListener.getKeyboardKeys()[InputListener.KEY_W])
		{
            this.move(this.getForward(), this.speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_S])
		{
            this.move(this.getForward().negate(), this.speed * dt);
		}
		if (InputListener.getKeyboardKeys()[InputListener.KEY_A])
		{
            this.move(this.getRight().negate(), this.speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_D])
		{
            this.move(this.getRight(), this.speed * dt);
		}
		if (InputListener.getKeyboardKeys()[InputListener.KEY_R])
		{
            this.move(this.getUp(), this.speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_F])
		{
            this.move(this.getUp().negate(), this.speed * dt);
		}

		// Camera rotation
		if (InputListener.getKeyboardKeys()[InputListener.KEY_RIGHT])
            this.rotate(this.getUp(), this.sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_LEFT])
            this.rotate(this.getUp(), -this.sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_UP])
            this.rotate(this.getRight(), -this.sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_DOWN])
            this.rotate(this.getRight(), this.sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_E])
            this.rotate(this.getForward(), this.sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_Q])
            this.rotate(this.getForward(), -this.sensitivity * dt);
	}

	move(direction:Vec3f, amount:number):void
	{
        this.pos.set(this.pos.add(direction.scale(amount)));
	}

	rotate(axis:Vec3f, theta:number):void
	{
		var rotation:Quaternion = new Quaternion().createFromAxisAngle(axis.x, axis.y, axis.z, theta);
        this.rot = rotation.mul(this.rot).normalize();
	}

	getPos():Vec3f
	{
		return this.pos;
	}

	getRot():Quaternion
	{
		return this.rot;
	}

	getForward():Vec3f
	{
		return this.rot.getForwardVector();
	}

	getRight():Vec3f
	{
		return this.rot.getRightVector();
	}

	getUp():Vec3f
	{
		return this.rot.getUpVector();
	}

	static cast(obj):Camera{
		var cam = new Camera(new Vec3f(), obj.speed, obj.sensitivity);
        cam.pos.x = obj.pos.x;
        cam.pos.y = obj.pos.y;
        cam.pos.z = obj.pos.z;
        cam.rot = new Quaternion(
			obj.rot.w,
			obj.rot.x,
			obj.rot.y,
			obj.rot.z
		);
        return cam;
	}

}
