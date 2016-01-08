import {TracerObject} from "./TracerObject";
import {Light} from "./Light";
import {PhongMaterial} from "./PhongMaterial";
import {Vec3f} from "../util/math/Vec3f";
import {CookTorranceMaterial} from "./CookTorranceMaterial";
import {Material} from "./Material";
import {DirectionalLight} from "./DirectionalLight";
import {PointLight} from "./PointLight";
import {GlassMaterial} from "./materials/GlassMaterial";
import {EmissiveMaterial} from "./materials/EmissiveMaterial";
import {Plane} from "../util/math/Plane";
import {Sphere} from "../util/math/Sphere";
import {DiffuseMaterial} from "./materials/DiffuseMaterial";
export class Scene
{

	public objects:Array<TracerObject>;
	public lights:Array<Light>;

	constructor()
	{
		this.objects = [];
		this.lights = [];

		var mat_diffuse_white = new DiffuseMaterial(new Vec3f(1,1,1));
		var mat_diffuse_blue = new DiffuseMaterial(new Vec3f(0,0,1));
		var mat_diffuse_red = new DiffuseMaterial(new Vec3f(1,0,0));
		var mat_diffuse_green = new DiffuseMaterial(new Vec3f(0,1,0));
		var mat_refractive_glass = new GlassMaterial(new Vec3f(0.0), 0.0, 1.0, 1.52, 0.0);
		var mat_mirror = new GlassMaterial(new Vec3f(0.0, 1.0, 0.0), 1.0, 0.0, 1.0, 0.0);
		var mat_light_white = new EmissiveMaterial(new Vec3f(3), new Vec3f(1,0,0));
		var mat_light_red = new EmissiveMaterial(new Vec3f(5,0,0), new Vec3f(0.0));

		/*var plane_floor = new Plane(new Vec3f(0.0, 0.0, 0.0), new Vec3f(0.0, 1.0, 0.0));
		var plane_ceiling = new Plane(new Vec3f(0.0, 4.0, 0.0), new Vec3f(0.0, -1.0, 0.0));
		var plane_left = new Plane(new Vec3f(-2.5, 0.0, 0.0), new Vec3f(1.0, 0.0, 0.0));
		var plane_right = new Plane(new Vec3f(2.5, 0.0, 0.0), new Vec3f(-1.0, 0.0, 0.0));
		var plane_forward = new Plane(new Vec3f(0.0, 0.0, 4.0), new Vec3f(0.0, 0.0, -1.0));
		var plane_back = new Plane(new Vec3f(0.0, 0.0, -4.0), new Vec3f(0.0, 0.0, 1.0));*/

		//var obj_lamp_0 = new TracerObject(new Mesh("lamp.obj"), mat_light_white, new Transform(new Vec3f(0.0, 4.0, 0.0), new Quaternion().initIdentity(), new Vec3f(0.5, 1.0, 0.5)));
		//var obj_cube_0 = new TracerObject(new Mesh("cube.obj"), mat_diffuse_white, new Transform(new Vec3f(1.0, 0.25, 2.0), new Quaternion().initIdentity().mul(new Quaternion().createFromAxisAngle(0, 1, 0, 45)), new Vec3f(0.25)));
		/*var obj_diffuse_white = new TracerObject(mat_diffuse_white);
		var obj_diffuse_blue = new TracerObject(mat_diffuse_blue);
		var obj_refractive_glass = new TracerObject(mat_refractive_glass);
		var obj_mirror = new TracerObject(mat_mirror);
		var obj_light_white = new TracerObject(mat_light_white);

		obj_diffuse_white.addPrimitive(plane_floor);
		obj_diffuse_white.addPrimitive(plane_ceiling);
		obj_diffuse_white.addPrimitive(plane_left);
		obj_diffuse_blue.addPrimitive(plane_right);
		obj_diffuse_white.addPrimitive(plane_forward);
		obj_diffuse_white.addPrimitive(plane_back);

		obj_refractive_glass.addPrimitive(new Sphere(new Vec3f(-0.75, 0.6, 0.5), 0.5));
		obj_mirror.addPrimitive(new Sphere(new Vec3f(0.75, 0.6, 0.5), 0.5));
        obj_light_white.addPrimitive(new Sphere(new Vec3f(0.75, 0.6, 0.5), 0.5));*/


		//this.objects.push(obj_lamp_0);
		//this.objects.push(obj_cube_0);
        /*this.objects.push(obj_refractive_glass);
        this.objects.push(obj_mirror);
		this.objects.push(obj_diffuse_white);
		this.objects.push(obj_diffuse_blue);
		this.objects.push(obj_light_white);*/


		/*var diffuse_white:Material= new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var reflective_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.25, 0, 0);
		var reflective_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.05, 1.0, 0.5, 0.50, 0, 0);
		var reflective_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.20, 1.0, 0.75, 0.375, 0, 0);
		var reflective_metal:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 1.0, 0, 0);
		var refractive_glass:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.0, 1.0, 1.52);
		var refractive_glass:Material = new GlassMaterial(new Vec3f(0.0), 0.0, 1.0, 1.52, 0.0);*/

		this.objects.push(new TracerObject(new Vec3f(0.0, 0.0, 0.0), new Vec3f(0.0, 1.0, 0.0), mat_diffuse_green));
		this.objects.push(new TracerObject(new Vec3f(0.0, 5.0, 0.0), new Vec3f(0.0, -1.0, 0.0), mat_light_white));//top
		this.objects.push(new TracerObject(new Vec3f(0.0, 0.0, -10.0), new Vec3f(0.0, 0.0, 1.0), mat_diffuse_green));
		this.objects.push(new TracerObject(new Vec3f(4.0, 0.0, 0.0), new Vec3f(-1.0, 0.0, 0.0), mat_diffuse_green));
		this.objects.push(new TracerObject(new Vec3f(-4.0, 0.0, 0.0), new Vec3f(1.0, 0.0, 0.0), mat_diffuse_green));

		this.objects.push(new TracerObject(new Vec3f(1.0, 0.75, -4.0), 0.75, mat_light_red));
		this.objects.push(new TracerObject(new Vec3f(-1.0, 0.75, -5.0), 0.75, mat_diffuse_green));

		//this.lights.push(new PointLight(new Vec3f(0.0, 4.0, -5.0), new Vec3f(1.0), 1.0, 0.0, 0.0, 0.1));
	}

	update(dt:number):void
	{

	}

	getObjects():Array<TracerObject>
	{
		return this.objects;
	}

	getLights():Array<Light>
	{
		return this.lights;
	}

}
