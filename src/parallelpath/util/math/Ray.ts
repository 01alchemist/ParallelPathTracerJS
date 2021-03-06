import {Vec3f} from "./Vec3f";
import {Camera} from "../../gfx/Camera";

export class Ray
{

	origin:Vec3f;
	dir:Vec3f;
	ior:number;

    constructor(origin?:Vec3f, dir?:Vec3f, ior?:number)
	{
		this.origin = origin || new Vec3f();
        this.dir = dir?dir.normalize():new Vec3f();
        this.ior = ior || 1.0;
	}
	clone():Ray{
		return new Ray(this.origin, this.dir, this.ior);
	}
	static calcCameraRay(camera:Camera, w:number, h:number, ar:number, x:number, y:number):Ray
	{
		let x_norm:number = (x - w * 0.5) / w * ar;
        let y_norm:number = (h * 0.5 - y) / h;

		let forward:Vec3f = camera.getForward();
		let up:Vec3f = camera.getUp();
		let right:Vec3f = camera.getRight();

		let image_point:Vec3f = right.scaleNumber(x_norm).add(up.scaleNumber(y_norm)).add(camera.pos.add(forward));
		let ray_direction:Vec3f = image_point.sub(camera.pos);

		return new Ray(camera.pos, ray_direction);
	}
	static calcCameraRayDirection(camera:Camera, w:number, h:number, ar:number, x:number, y:number):Vec3f
	{
		let x_norm:number = (x - w * 0.5) / w * ar;
        let y_norm:number = (h * 0.5 - y) / h;

		let forward:Vec3f = camera.getForward();
		let up:Vec3f = camera.getUp();
		let right:Vec3f = camera.getRight();

		let image_point:Vec3f = right.scaleNumber(x_norm).add(up.scaleNumber(y_norm)).add(camera.pos.add(forward));
		return image_point.sub(camera.pos);
	}
	static calcSupersampledCameraRay(camera:Camera, w:number, h:number, ar:number, x:number, y:number, jitter:number):Ray
	{
		let x_norm:number = (x - w * 0.5) / w * ar;
		let y_norm:number = (h * 0.5 - y) / h;

		let forward:Vec3f = camera.getForward();
		let up:Vec3f = camera.getUp();
		let right:Vec3f = camera.getRight();

		let image_point:Vec3f = right.scaleNumber(x_norm).add(up.scaleNumber(y_norm)).add(camera.pos.add(forward));
		image_point = image_point.add(
			new Vec3f(
				jitter * Math.random() - (jitter / 2.0),
				jitter * Math.random() - (jitter / 2.0),
				0.0
		));
		let ray_direction:Vec3f = image_point.sub(camera.pos);

		return new Ray(camera.pos, ray_direction);
	}
	getorigin():Vec3f
	{
		return this.origin;
	}

	getDir():Vec3f
	{
		return this.dir;
	}

	getIOR():number
	{
		return this.ior;
	}

	setorigin(origin:Vec3f):void
	{
		this.origin.setVec(origin);
	}

	setDir(dir:Vec3f):void
	{
		this.dir.setVec(dir);
	}
	
	setIOR(ior:number):void
	{
		this.ior = ior;
	}

}
