import {material_types} from "../util/Config";
import {Vec3f} from "../util/math/Vec3f";
import {Config} from "../util/Config";

export class Material {

    // Material type
    public material_type:material_types;

    // General shading variables
    public color_ambient:Vec3f;
    public color_diffuse:Vec3f;
    public color_specular:Vec3f;
    public reflectivity:number;
    public refractivity:number;
    public ior:number;

    // Phong shading model variables
    public shininess:number;

    // Cook-torrance shading model variables
    public roughness:number;
    public fresnel:number;
    public density:number;

    public glossiness:number=0;
    public emittance:Vec3f;
    public reflectance:Vec3f;


    static cast(obj):Material {
        var mat = new Material();
        mat.material_type = obj.material_type;

        // General shading variables
        mat.color_ambient = obj.color_ambient ? new Vec3f().set(obj.color_ambient) : new Vec3f(1);
        mat.color_diffuse = obj.color_diffuse ? new Vec3f().set(obj.color_diffuse) : new Vec3f(1);
        mat.color_specular = obj.color_specular ? new Vec3f().set(obj.color_specular) : new Vec3f(0);
        mat.reflectivity = obj.reflectivity;
        mat.refractivity = obj.refractivity;
        mat.ior = obj.ior;

        // Phong shading model variables
        mat.shininess = obj.shininess;

        // Cook-torrance shading model variables
        mat.roughness = obj.roughness;
        mat.fresnel = obj.fresnel;
        mat.density = obj.density;

        mat.glossiness = obj.glossiness;
        mat.emittance = obj.emittance? new Vec3f().set(obj.emittance) : new Vec3f(0);
        mat.reflectance = obj.reflectance? new Vec3f().set(obj.reflectance) : new Vec3f(1);

        return mat;
    }

    constructor() {
    }

    public getMaterialType():material_types {
        return this.material_type;
    }

    getEmittance():Vec3f {
        return this.emittance;
    }

    getColorAmbient():Vec3f {
        return this.color_ambient;
    }

    getColorDiffuse():Vec3f {
        return this.color_diffuse;
    }

    getColorSpecular():Vec3f {
        return this.color_specular;
    }

    getShininess():number {
        return this.shininess;
    }

    getRoughness():number {
        return this.roughness;
    }

    getFresnel():number {
        return this.fresnel;
    }

    getDensity():number {
        return this.density;
    }

    getReflectivity():number {
        return this.reflectivity;
    }

    getRefractivity():number {
        return this.refractivity;
    }

    getIOR():number {
        return this.ior;
    }

}
