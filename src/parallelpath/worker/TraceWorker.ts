import {Display, Tracer, Light, Scene, TracerObject} from "../gfx/gfx";
import {Config, Ray, Intersection, Primitive, Vec3f, MathUtils, light_types} from "../util/util";
import {Shader} from "../shader/Shader";
import {Plane} from "../util/math/Plane";
import {Sphere} from "../util/math/Sphere";
import {Camera} from "../gfx/Camera";
import {Material} from "../gfx/Material";
import {Vec2f} from "../util/math/Vec2f";
import {Mat4f} from "../util/math/Mat4f";

export class TraceWorker {

    static INIT:string = "INIT";
    static INITED:string = "INITED";
    static TRACE:string = "TRACE";
    static TRACED:string = "TRACED";

    time:number = 1;

    static initRay:Vec3f;

    private width:number;
    private height:number;
    private xoffset:number;
    private yoffset:number;
    private ar:number;
    private id:number;
    private finished:boolean;

    private tracer:Tracer;

    private command:any;
    private eye:any;
    private center:any;
    private invMP:any;
    private iterations:number;
    private propertyMemory:Uint8Array;
    private pixelMemory:Uint8ClampedArray;
    private samples:Uint8ClampedArray;
    private samples_taken:number = 1;
    private window_width:number;
    private window_height:number;
    private r1_scale:Vec3f;
    private r2_scale:Vec3f;
    private SSAA = 0;

    constructor() {

        console.log("v2");

        this.eye = new Vec3f();
        this.center = new Vec3f();
        this.invMP = new Mat4f();
        this.r1_scale = new Vec3f(12.9898, 78.233, 151.7182);
        this.r2_scale = new Vec3f(63.7264, 10.873, 623.6736);

        var self = this;
        addEventListener('message', (e:any) => {

            if (self.command == null) {
                self.command = e.data;
            } else if (self.command == TraceWorker.INIT) {

                self.command = null;
                /*self.propertyMemory = new Uint8Array(e.data.propertyMemory);*/
                self.pixelMemory = new Uint8ClampedArray(e.data.pixelMemory);

                postMessage(TraceWorker.INITED);

                self.id = e.data.id;
                self.tracer = e.data.tracer;

                self.tracer.camera = Camera.cast(self.tracer.camera);

                self.tracer.scene.objects.forEach(function (obj:TracerObject) {
                    obj.primitives.forEach(function (primitive:Primitive, index:number) {
                        primitive = primitive.type == "plane" ? Plane.cast(primitive) : Sphere.cast(primitive);
                        obj.primitives[index] = primitive;
                    });
                    obj.material = Material.cast(obj.material);
                });
                self.tracer.scene.lights.forEach(function (light:Light, index) {
                    self.tracer.scene.lights[index] = Light.cast(light);
                });

                self.window_width = e.data.window_width;
                self.window_height = e.data.window_height;
                self.init(
                    e.data.width,
                    e.data.height,
                    e.data.xoffset,
                    e.data.yoffset,
                    e.data.id
                );

            } else if (self.command == TraceWorker.TRACE) {
                self.command = null;
                self.ar = e.data.ar;
                self.eye.setVec(e.data.eye);
                self.center.setVec(e.data.center);
                self.invMP.m = e.data.invMP;
                self.iterations = e.data.iterations;
                if (self.iterations == 0) {
                    self.clear();
                }
                self.run();
                postMessage(TraceWorker.TRACED);
            }
        }, false);
    }

    init(width:number, height:number, xoffset:number, yoffset:number, id:number) {
        this.width = width;
        this.height = height;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.id = id;
        this.finished = true;
        this.samples = new Uint8ClampedArray(width * height * 3);
        this.samples_taken = 1;
        //this.tracer = tracer;
        console.log("inited");
    }

    clear():void {
        this.samples = new Uint8ClampedArray(this.width * this.height * 3);
        this.samples_taken = 1;
        console.log("cleared");
    }

    run():void {
        this.finished = false;

        //console.time("Traced");

        if (this.tracer != null) {

            var ray_primary:Ray;
            var depth = Config.ss_amount;

            var w = this.width;
            var h = this.height;
            var i = 0;
            var color:Vec3f;

            // randomly jitter pixels so there is no aliasing
            for (var y:number = this.yoffset; y < this.yoffset + this.height; y++) {

                for (var x:number = this.xoffset; x < this.xoffset + this.width; x++) {

                    var InitRay = new Vec3f();
                    /*var percent_x:number = x * 0.5 + 0.5;
                     var percent_y:number = y * 0.5 + 0.5;
                     var ray00:Vec3f = (this.invMP.multiplyVec4([-1.0, -1.0, 0.0, 1.0]).divide(this.invMP.multiplyVec4([-1.0, -1.0, 0.0, 1.0]).w)).xyz.sub(this.eye);
                     var ray01:Vec3f = (this.invMP.multiplyVec4([-1.0, 1.0, 0.0, 1.0]).divide(this.invMP.multiplyVec4([-1.0, -1.0, 0.0, 1.0]).w)).xyz.sub(this.eye);
                     var ray10:Vec3f = (this.invMP.multiplyVec4([1.0, -1.0, 0.0, 1.0]).divide(this.invMP.multiplyVec4([-1.0, -1.0, 0.0, 1.0]).w)).xyz.sub(this.eye);
                     var ray11:Vec3f = (this.invMP.multiplyVec4([1.0, 1.0, 0.0, 1.0]).divide(this.invMP.multiplyVec4([-1.0, -1.0, 0.0, 1.0]).w)).xyz.sub(this.eye);

                     InitRay.x = MathUtils.mix(MathUtils.mix(ray00.x, ray01.x, percent_y), MathUtils.mix(ray10.x, ray11.x, percent_y), percent_x);
                     InitRay.y = MathUtils.mix(MathUtils.mix(ray00.y, ray01.y, percent_y), MathUtils.mix(ray10.y, ray11.y, percent_y), percent_x);
                     InitRay.z = MathUtils.mix(MathUtils.mix(ray00.z, ray01.z, percent_y), MathUtils.mix(ray10.z, ray11.z, percent_y), percent_x);*/
                    var r:Ray = Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);
                    InitRay = r.dir;
                    TraceWorker.initRay = InitRay;

                    /*var r:Ray = new Ray();
                     r.origin = this.eye;
                     r.dir = InitRay.normalize();*/

                    //screenz = 0.0
                    var t:number = (0.0 - this.eye.z) / r.dir.z;
                    var InitPixel:Vec3f = r.origin.add(r.dir.scaleNumber(t));

                    var r1:number = Math.sin(TraceWorker.getrandom(r.dir.scale(this.r1_scale), this.time));
                    var r2:number = Math.cos(TraceWorker.getrandom(r.dir.scale(this.r2_scale), this.time + 1.0));
                    if (this.SSAA > 0) {
                        //jitter
                        var u:number = r1 / 2.0 / this.width;
                        var v:number = r2 / 2.0 / this.height;
                        InitPixel.x += u;
                        InitPixel.y += v;
                        InitPixel.z += 0;
                        r.dir = InitPixel.sub(this.eye).normalize();
                    }


                    r.ior = 1.0;

                    var finalCol:Vec3f = new Vec3f(0.0);
                    this.pathTrace(r, 1, finalCol);

                    var _x = x - this.xoffset;
                    var _y = y - this.yoffset;
                    var index:number = ((_y * (w * 3)) + (_x * 3));

                    this.samples[index] += finalCol.x;
                    this.samples[index + 1] += finalCol.y;
                    this.samples[index + 2] += finalCol.z;


                    /*if (TraceWorker.interval % 50000 == 0) {
                        console.log(this.samples[index],this.samples[index+1],this.samples[index+2]);
                    }
                    TraceWorker.interval++;*/

                    finalCol.x = MathUtils.mix(finalCol.x / 5.0, this.samples[index], this.iterations / (1.0 + this.iterations));
                    finalCol.y = MathUtils.mix(finalCol.y / 5.0, this.samples[index + 1], this.iterations / (1.0 + this.iterations));
                    finalCol.z = MathUtils.mix(finalCol.z / 5.0, this.samples[index + 2], this.iterations / (1.0 + this.iterations));

                    finalCol.x = this.samples[index] / this.iterations;
                    finalCol.y = this.samples[index + 1] / this.iterations;
                    finalCol.z = this.samples[index + 2] / this.iterations;

                    var screen_index:number = ((y * (this.window_width * 3)) + (x * 3));
                    this.drawPixelVec3f(screen_index, finalCol);

                    this.samples_taken++;

                    if (Config.debug && x == this.xoffset || Config.debug && y == this.yoffset) {
                        this.drawPixelInt(screen_index, 0xFFFF00F);
                    }
                }
            }
        }

        this.iterations++;
        this.time++;
        this.finished = true;
    }

    drawPixelVec3fAveraged(index:number, color:Vec3f, factor:number):void {

        var average:Vec3f = <Vec3f>MathUtils.clamp(color.divideNumber(factor), 0.0, 1.0);

        var red:number = (average.x * 255.0);
        var green:number = (average.y * 255.0);
        var blue:number = (average.z * 255.0);

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
    }

    drawPixelVec3f(index:number, color:Vec3f):void {

        var red:number = (color.x * 255.0);
        var green:number = (color.y * 255.0);
        var blue:number = (color.z * 255.0);

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
    }

    drawPixelInt(index:number, color:number) {

        var red = (color >> 16) & 255;
        var green = (color >> 8) & 255;
        var blue = color & 255;

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
    }

    static interval:number = 0;

    pathTrace(ray:Ray, rayDepth:number, color:Vec3f):Vec3f {

        var colorMask:Vec3f = new Vec3f(1);
        var incidentIOR:number = 1.0;
        var transmittedIOR:number = 1.0;
        var internalReflection:boolean = false;
        var reflective:boolean = false;
        var refractive:boolean = false;
        var shift:number = 0.01;

        // Initialize the required intersection data
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;
        var depth = 5;

        for (var i = 0; i < depth; i++) {
            xFinal = null;
            var seed = this.time + i;
            // Find the nearest intersection point
            this.tracer.scene.objects.forEach(function (obj:TracerObject) {
                obj.primitives.forEach(function (primitive:Primitive) {
                    xInit = primitive.intersect(ray);
                    if (xInit != null && xInit.getT() < tInit) {
                        xFinal = xInit;
                        tInit = xFinal.getT();
                        xObject = obj;
                    }
                });
            });

            // Return a blank color if the ray didn't hit anything
            if (xFinal == null) {
                color.setVec(Shader.COLOR_NULL);
                return color;
            }

            if (xObject.material.emittance.length() > 0.0) {
                color.setVec(xObject.material.emittance);
                return color;
            }


            // Store the required data into temp objects
            var material:Material = xObject.material;
            var P:Vec3f = xFinal.pos;
            var N:Vec3f = xFinal.norm;
            var RO:Vec3f = ray.origin;
            var RD:Vec3f = ray.dir;

            // Calculate the russian roulette probabilities
            var Kd:number = material.reflectance.length();
            var Ks:number = material.reflectivity;
            var Pp:number = Kd / (Kd + Ks);
            var Pr:number = Math.random();

            var intersect:Intersection = xFinal;

            //no light objects
            if (material.refractivity == 0 && material.reflectivity == 0) {

                colorMask = colorMask.scale(material.color_diffuse);
                color.setVec(colorMask);

                var randomnum:number = TraceWorker.rand(intersect.pos.xy);
                //ray.dir = ray.dir.randomHemisphere();
                ray.dir = TraceWorker.calculateRandomDirectionInHemisphere(seed + randomnum, intersect.norm).normalize();
                ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));

            } else {

                var isInsideOut:boolean = ray.dir.dot(intersect.norm) > 0.0; //out:> 0.0 true,in :<=0.0  false

                if (material.refractivity > 0.0) {

                    var random:Vec3f = new Vec3f(
                        TraceWorker.rand(intersect.pos.xy),
                        TraceWorker.rand(intersect.pos.xz),
                        TraceWorker.rand(intersect.pos.yz)
                    );
                    var oldIOR = ray.ior;
                    var newIOR = material.ior;
                    var fresnel:any;

                    var reflect_range:number = -1.0;
                    var IOR12:number = oldIOR / newIOR;
                    // Calculate the cosine term
                    var NdotI:number = ray.dir.dot(xFinal.norm);
                    var cos_t = IOR12 * IOR12 * (1.0 - NdotI * NdotI);

                    var reflectR:Vec3f = ray.dir.reflect(intersect.norm);
                    var refractR:Vec3f = ray.dir.refract(intersect.norm, IOR12, NdotI, cos_t);
                    fresnel = TraceWorker.calculateFresnel(intersect.norm, ray.dir, oldIOR, newIOR);

                    reflect_range = fresnel.reflectionCoefficient;

                    var randomnum:number = TraceWorker.getrandom(random, seed);
                    if (randomnum < reflect_range) {
                        ray.dir = reflectR;
                        ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));

                        if (material.subsurfaceScatter > 0) {
                            var _random:number = TraceWorker.rand(intersect.pos.xy);
                            var scatterColor:Vec3f = TraceWorker.subScatterFS(intersect, material.color_diffuse, _random);
                            colorMask = colorMask.scale(scatterColor);
                        }
                    }
                    else {
                        ray.dir = refractR;
                        ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                    }

                    if (!isInsideOut) {  //from objects
                        ray.ior = newIOR;
                    } else {  //from air
                        ray.ior = 1.0;
                    }

                    colorMask = colorMask.scale(material.color_diffuse);
                    color.setVec(colorMask);

                    /*if (TraceWorker.interval % 50000 == 0) {
                     console.log(color);
                     }*/

                }
                else if (material.reflectivity > 0.0) {

                    if (material.subsurfaceScatter > 0) {
                        var _random:number = TraceWorker.rand(intersect.pos.xy);
                        colorMask = colorMask.scale(TraceWorker.subScatterFS(intersect, material.color_diffuse, _random));
                    }
                    colorMask = colorMask.scale(material.color_diffuse);
                    color.setVec(colorMask);
                    ray.ior = 1.0;
                    ray.dir = ray.dir.reflect(intersect.norm);
                    ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                }else{

                    /*color.setVec(Shader.COLOR_NULL);
                    return color;*/
                }
            }
        }
    }

    static rand(co:Vec2f):number {
        var a:number = 12.9898;
        var b:number = 78.233;
        var c:number = 43758.5453;
        var dt:number = MathUtils.dotVec2(co, new Vec2f(a, b));
        var sn:number = MathUtils.mod(dt, 3.14);
        return MathUtils.fract(Math.sin(sn) * c);
    }

    static getrandom(noise:Vec3f, seed:number):number {
        return MathUtils.fract(Math.sin(MathUtils.dotVec3(TraceWorker.initRay.addNumber(seed), noise)) * 43758.5453 + seed);
    }

    static calculateRandomDirectionInHemisphere(seed:number, normal:Vec3f):Vec3f {
        var u:number = TraceWorker.getrandom(new Vec3f(12.9898, 78.233, 151.7182), seed);
        var v:number = TraceWorker.getrandom(new Vec3f(63.7264, 10.873, 623.6736), seed);

        var up:number = Math.sqrt(u);
        var over:number = Math.sqrt(1.0 - up * up);
        var around:number = v * 3.141592 * 2.0;

        var directionNotNormal:Vec3f;
        if (Math.abs(normal.x) < 0.577350269189) {
            directionNotNormal = new Vec3f(1, 0, 0);
        } else if (Math.abs(normal.y) < 0.577350269189) {
            directionNotNormal = new Vec3f(0, 1, 0);
        } else {
            directionNotNormal = new Vec3f(0, 0, 1);
        }

        var perpendicularDirection1:Vec3f = normal.cross(directionNotNormal).normalize();
        var perpendicularDirection2:Vec3f = normal.cross(perpendicularDirection1).normalize();

        return normal.scaleNumber(up).add(perpendicularDirection1.scaleNumber(Math.cos(around) * over)).add(perpendicularDirection2.scaleNumber(Math.sin(around) * over));
    }

    static calculateFresnel(normal:Vec3f, incident:Vec3f, incidentIOR:number, transmittedIOR:number):any {
        var fresnel = {
            reflectionCoefficient: 0,
            transmissionCoefficient: 0
        };
        incident = incident.normalize();
        normal = normal.normalize();
        var cosThetaI:number = Math.abs(normal.dot(incident));
        var sinIncidence:number = Math.sqrt(1.0 - Math.pow(cosThetaI, 2.0));
        var cosThetaT:number = Math.sqrt(1.0 - Math.pow(((incidentIOR / transmittedIOR) * sinIncidence), 2.0));

        if (cosThetaT <= 0.0) {
            fresnel.reflectionCoefficient = 1.0;
            fresnel.transmissionCoefficient = 0.0;
            return fresnel;
        } else {

            var RsP:number = Math.pow((incidentIOR * cosThetaI - transmittedIOR * cosThetaT) / (incidentIOR * cosThetaI + transmittedIOR * cosThetaT), 2.0);
            var RpP:number = Math.pow((incidentIOR * cosThetaT - transmittedIOR * cosThetaI) / (incidentIOR * cosThetaT + transmittedIOR * cosThetaI), 2.0);
            fresnel.reflectionCoefficient = (RsP + RpP) / 2.0;
            fresnel.transmissionCoefficient = 1.0 - fresnel.reflectionCoefficient;
            return fresnel;
        }

    }

    static subScatterFS(intersect:Intersection, color:Vec3f, seed:Number):Vec3f {
        var RimScalar:number = 1.0;
        var MaterialThickness:number = 0.5;
        var ExtinctionCoefficient:Vec3f = new Vec3f(1.0, 1.0, 1.0);
        var SpecColor:Vec3f = new Vec3f(1.0, 1.0, 1.0);
        var lightPoint:Vec3f = new Vec3f(0.0, 5.0, 0.0);

        var attenuation:number = 10.0 * (1.0 / lightPoint.distance(intersect.pos));
        var eVec:Vec3f = intersect.pos.normalize();
        var lVec:Vec3f = lightPoint.sub(intersect.pos).normalize();
        var wNorm:Vec3f = intersect.norm.normalize();

        var dotLN:Vec3f = new Vec3f(TraceWorker.halfLambert(lVec, wNorm) * attenuation);
        dotLN = dotLN.scale(color);

        var indirectLightComponent:Vec3f = new Vec3f(MaterialThickness * Math.max(0.0, lVec.dot(wNorm.negate())));
        indirectLightComponent.addNumber(MaterialThickness * TraceWorker.halfLambert(eVec.negate(), lVec));
        indirectLightComponent.scaleNumber(attenuation);
        indirectLightComponent.x *= ExtinctionCoefficient.x;
        indirectLightComponent.y *= ExtinctionCoefficient.y;
        indirectLightComponent.z *= ExtinctionCoefficient.z;

        var rim = new Vec3f(1.0 - Math.max(0.0, wNorm.dot(eVec)));
        rim = rim.scale(rim);
        rim = SpecColor.scale(rim.scaleNumber(Math.max(0.0, wNorm.dot(lVec))));

        var finalCol:Vec3f = dotLN.add(indirectLightComponent);
        finalCol.add(rim.scaleNumber(RimScalar * attenuation));
        var SpecularPower = 15.0;
        finalCol = finalCol.add(
            SpecColor.scaleNumber(TraceWorker.blinnPhongSpecular(wNorm, lVec, SpecularPower) * attenuation * 0.1)
        );
        //finalCol = finalCol.scale(new Vec3f(1.0));

        return finalCol;
    }

    static blinnPhongSpecular(normalVec:Vec3f, lightVec:Vec3f, specPower:number):number {
        var halfAngle:Vec3f = normalVec.add(lightVec).normalize();
        return Math.pow(
            MathUtils.clamp2(0.0, 1.0, normalVec.dot(halfAngle)),
            specPower
        );
    }

    static halfLambert(vect1:Vec3f, vect2:Vec3f):number {
        var product:number = vect1.dot(vect2);
        return product * 0.5 + 0.5;
    }

    getWidth():number {
        return this.width;
    }

    getHeight():number {
        return this.height;
    }

    getXOffset():number {
        return this.xoffset;
    }

    getYOffset():number {
        return this.yoffset;
    }

    getId():number {
        return this.id;
    }

    isFinished():boolean {
        return this.finished;
    }
}
new TraceWorker();