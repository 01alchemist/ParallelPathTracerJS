import {TracerObject} from "./TracerObject";
import {Light} from "./Light";
import {PhongMaterial} from "./PhongMaterial";
import {Vec3f} from "../util/math/Vec3f";
import {CookTorranceMaterial} from "./CookTorranceMaterial";
import {Material} from "./Material";
import {DirectionalLight} from "./DirectionalLight";
import {PointLight} from "./PointLight";
import {GlassMaterial} from "./GlassMaterial";
export class Scene
{

	public objects:Array<TracerObject>;
	public lights:Array<Light>;

	constructor()
	{
		this.objects = [];
		this.lights = [];

		var diffuse_white:Material= new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var diffuse_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var reflective_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.25, 0, 0);
		var reflective_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.05, 1.0, 0.5, 0.50, 0, 0);
		var reflective_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.20, 1.0, 0.75, 0.375, 0, 0);
		var reflective_metal:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 1.0, 0, 0);
		var refractive_glass:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.0, 1.0, 1.52);
		//var refractive_glass:Material = new GlassMaterial(new Vec3f(0.0), 0.0, 1.0, 1.52, 0.0);

		this.objects.push(new TracerObject(new Vec3f(0.0, 0.0, 0.0), new Vec3f(0.0, 1.0, 0.0), diffuse_white));
		this.objects.push(new TracerObject(new Vec3f(0.0, 5.0, 0.0), new Vec3f(0.0, -1.0, 0.0), diffuse_white));
		this.objects.push(new TracerObject(new Vec3f(0.0, 0.0, -10.0), new Vec3f(0.0, 0.0, 1.0), diffuse_white));
		this.objects.push(new TracerObject(new Vec3f(4.0, 0.0, 0.0), new Vec3f(-1.0, 0.0, 0.0), diffuse_red));
		this.objects.push(new TracerObject(new Vec3f(-4.0, 0.0, 0.0), new Vec3f(1.0, 0.0, 0.0), diffuse_blue));
		this.objects.push(new TracerObject(new Vec3f(1.0, 0.75, -4.0), 0.75, reflective_metal));
		this.objects.push(new TracerObject(new Vec3f(-1.0, 0.75, -5.0), 0.75, refractive_glass));

		this.lights.push(new PointLight(new Vec3f(0.0, 4.0, -5.0), new Vec3f(1.0), 1.0, 0.0, 0.0, 0.1));
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
