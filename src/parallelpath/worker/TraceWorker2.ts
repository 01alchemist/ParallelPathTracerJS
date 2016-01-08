import {Display, Tracer, Light, Scene, TracerObject} from "../gfx/gfx";
import {Config, Ray, Intersection, Primitive, Vec3f, MathUtils, light_types} from "../util/util";
import {Shader} from "../shader/Shader";
import {Plane} from "../util/math/Plane";
import {Sphere} from "../util/math/Sphere";
import {Camera} from "../gfx/Camera";
import {Material} from "../gfx/Material";
import {Vec2f} from "../util/math/Vec2f";

export class TraceWorker2 {

    static INIT:string = "INIT";
    static INITED:string = "INITED";
    static TRACE:string = "TRACE";
    static TRACED:string = "TRACED";

    static time:number = 1;
    static initRay:Ray;

    private width:number;
    private height:number;
    private xoffset:number;
    private yoffset:number;
    private ar:number;
    private id:number;
    private finished:boolean;

    private tracer:Tracer;

    private command:any;
    private propertyMemory:Uint8Array;
    private pixelMemory:Uint8ClampedArray;
    private samples:Uint8ClampedArray;
    private samples_taken:number;
    private window_width:number;
    private window_height:number;

    constructor() {

        console.log("v2");

        var self = this;
        addEventListener('message', (e:any) => {

            if (self.command == null) {
                self.command = e.data;
            } else if (self.command == TraceWorker2.INIT) {

                self.command = null;
                /*self.propertyMemory = new Uint8Array(e.data.propertyMemory);*/
                self.pixelMemory = new Uint8ClampedArray(e.data.pixelMemory);

                postMessage(TraceWorker2.INITED);

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

            } else if (self.command == TraceWorker2.TRACE) {
                self.command = null;
                self.ar = e.data.ar;

                var rot = self.tracer.camera.rot;
                var pos = self.tracer.camera.pos;

                if(!rot.equals(e.data.rot) || !pos.equals(e.data.pos)){
                    self.clear();
                }

                self.tracer.camera.rot.setFromQuaternion(e.data.rot);
                self.tracer.camera.pos.setVec(e.data.pos);
                self.run();
                postMessage(TraceWorker2.TRACED);
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
    }
    clear():void{
        this.samples = new Uint8ClampedArray(this.width * this.height * 3);
        this.samples_taken = 1;
    }
    run():void {
        this.finished = false;

        //console.time("Traced");

        if (this.tracer != null) {

            var ray_primary:Ray;

            for (var y:number = this.yoffset; y < this.yoffset + this.height; y++) {

                for (var x:number = this.xoffset; x < this.xoffset + this.width; x++) {

                    var _x = x - this.xoffset;
                    var _y = y - this.yoffset;
                    var index:number = ((_y * (this.width * 3)) + (_x * 3));
                    var color:Vec3f = new Vec3f();

                    //ray_primary = Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);
                    //TraceWorker2.initRay = ray_primary.clone();
                    // Do the path tracing
                    var depth = 3;
                    var sample:Vec3f = Shader.COLOR_NULL;
                    //iteration
                    for(var i = 0; i < depth; i++) {
                        ray_primary = Ray.calcSupersampledCameraRay(
                            this.tracer.camera,
                            this.window_width,
                            this.window_height,
                            this.ar, x, y, Config.ss_jitter
                        );
                        TraceWorker2.initRay = ray_primary;
                        sample = sample.add(TraceWorker2.pathTrace(ray_primary, this.tracer.scene, 0, 1.0));
                    }

                    var sample_averaged:Vec3f = sample.divideNumber(Config.ss_amount);

                    this.samples[index] = this.samples[index] + sample_averaged.x;
                    this.samples[index+1] = this.samples[index+1] + sample_averaged.y;
                    this.samples[index+2] = this.samples[index+2] + sample_averaged.z;

                    // Add the averaged sample to the samples
                    color.x = this.samples[index];
                    color.y = this.samples[index + 1];
                    color.z = this.samples[index + 2];

                    /*color.x = MathUtils.mix( color.x / 5.0, this.samples[index], this.samples_taken / (1.0 + this.samples_taken));
                    color.y = MathUtils.mix( color.y / 5.0, this.samples[index+1], this.samples_taken / (1.0 + this.samples_taken));
                    color.z = MathUtils.mix( color.z / 5.0, this.samples[index+2], this.samples_taken / (1.0 + this.samples_taken));*/

                    var screen_index:number = ((y * (this.window_width * 3)) + (x * 3));

                    this.drawPixelVec3fAveraged(screen_index, color, this.samples_taken);
                    //this.drawPixelVec3f(screen_index, color);
                    //this.drawPixelVec3f(x, y, TraceWorker2.traceColor(ray_primary, this.tracer.scene, 0));

                    if (Config.debug && x == this.xoffset || Config.debug && y == this.yoffset) {
                        this.drawPixelInt(screen_index, 0xFFFF00F);
                    }
                }
            }
        }

        //console.timeEnd("Traced");
        this.samples_taken++;
        TraceWorker2.time++;
        this.finished = true;
    }

    drawPixelVec3fAveraged(index:number, color:Vec3f, factor:number):void {

        if(color.x == 0 && color.y == 0 && color.z == 0){
            return;
        }
        var average:Vec3f = <Vec3f>MathUtils.clamp(color.divideNumber(factor), 0.0, 1.0);

        var red:number = (average.x * 255.0);
        var green:number = (average.y * 255.0);
        var blue:number = (average.z * 255.0);

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
    }

    drawPixelVec3f(index:number, color:Vec3f):void {

        color = <Vec3f>MathUtils.smoothstep(MathUtils.clamp(color, 0.0, 1.0), 0.0, 1.0);

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

    static pathTrace(ray:Ray, scene:Scene, n:number, weight:number):Vec3f {
        // Break out from the method if max recursion depth is hit
        if (n > Config.recursion_max) {
            return Shader.COLOR_NULL;
        }

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

        var i = 0;
        var depth = 1;
        //iteration
        for(i = 0; i < depth; i++) {

            xFinal = null;

            // Find the nearest intersection point
            scene.objects.forEach(function (obj:TracerObject) {
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
                return Shader.COLOR_NULL;
            }

            if (xObject.material.emittance.length() > 0.0) {
                //is light
                return xObject.material.emittance;
            }


            // Store the required data into temp objects
            var material:Material = xObject.material;
            var P:Vec3f = xFinal.pos;
            var N:Vec3f = xFinal.norm;
            var RO:Vec3f = ray.pos;
            var RD:Vec3f = ray.dir;

            // Initialize the total color vector
            var color:Vec3f = new Vec3f();

            // Calculate the russian roulette probabilities
            var Kd:number = material.reflectance.length();
            var Ks:number = material.reflectivity;
            var Pp:number = Kd / (Kd + Ks);
            var Pr:number = Math.random();

            // Initialize some values
            var NdotI:number = RD.dot(N), IOR, n1, n2;
            var refractedRay:Ray;

            // Are we going into a medium or getting out from it?
            if (NdotI > 0.0) {
                n1 = ray.ior;
                n2 = material.ior;
                N = N.negate();
            }
            else {
                n1 = material.ior;
                n2 = ray.ior;
                NdotI = -NdotI;
            }

            var intersect:Intersection = xFinal;

            var dist = -1.0;
            var seed = TraceWorker2.time + i;

            //no light objects
            if (material.refractivity == 0 && material.reflectivity == 0) {

                colorMask = colorMask.scale(material.color_diffuse);
                var randomnum:number = TraceWorker2.rand(intersect.pos.xy);
                ray.dir = TraceWorker2.calculateRandomDirectionInHemisphere(seed + randomnum, intersect.norm).normalize();
                ray.pos = intersect.pos.add(ray.dir).scaleNumber(shift);
                color = colorMask;

                /*if(TraceWorker2.interval % 50000 == 0){
                    console.log(material.color_diffuse);
                }
                TraceWorker2.interval++;*/

            } else {

                //var isInsideOut:boolean = ray.dir.dot(intersect.norm) > 0.0; //out:> 0.0 true,in :<=0.0  false

                if (material.refractivity > 0.0) {

                    var random:Vec3f = new Vec3f(
                        TraceWorker2.rand(intersect.pos.xy),
                        TraceWorker2.rand(intersect.pos.xz),
                        TraceWorker2.rand(intersect.pos.yz)
                    );

                    var fresnel:any;

                    var reflect_range:number = -1.0;
                    var IOR12:number = n1 / n2;
                    // Calculate the cosine term
                    var cos_t = IOR12 * IOR12 * (1.0 - NdotI * NdotI);

                    var reflectR:Vec3f = ray.dir.reflect(intersect.norm);
                    var refractR:Vec3f = ray.dir.refract(intersect.norm, IOR12, NdotI, cos_t);
                    fresnel = TraceWorker2.calculateFresnel(intersect.norm, ray.dir, n1, n2);

                    reflect_range = fresnel.reflectionCoefficient;

                    var randomnum:number = TraceWorker2.getrandom(random, seed);
                    if (randomnum < reflect_range) {
                        ray.dir = reflectR;
                        ray.pos = intersect.pos.addNumber(shift).scale(ray.dir);

                        if (material.subsurfaceScatter > 0) {
                            var _random:number = TraceWorker2.rand(intersect.pos.xy);
                            var scatterColor:Vec3f = TraceWorker2.subScatterFS(intersect, material.color_diffuse, _random);
                            colorMask = colorMask.scale(scatterColor);
                        }
                    }
                    else {
                        ray.dir = refractR;
                        ray.pos = intersect.pos.add(ray.dir.scaleNumber(shift));
                    }


                    /*if (!isInsideOut)  //from objects
                        ray.ior = n2;
                    else   //from air
                        ray.ior = 1.0;*/

                    colorMask = colorMask.scale(material.color_diffuse);
                    color = colorMask;

                }
                else if (material.reflectivity > 0.0) {

                    if(material.subsurfaceScatter > 0)
                    {
                        var _random:number = TraceWorker2.rand(intersect.pos.xy);
                        colorMask = colorMask.scale(TraceWorker2.subScatterFS(intersect, material.color_diffuse, _random));
                    }
                    colorMask = colorMask.scale(material.color_diffuse);
                    color = colorMask;
                    ray.ior = 1.0;
                    ray.dir = ray.dir.reflect(intersect.norm);
                    ray.pos = intersect.pos.add(ray.dir.scaleNumber(shift));
                }
            }

        }

        ////###################### END


        return color;
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
        return MathUtils.fract(Math.sin(MathUtils.dotVec3(TraceWorker2.initRay.dir.addNumber(seed), noise)) * 43758.5453 + seed);
    }

    static calculateRandomDirectionInHemisphere(seed:number, normal:Vec3f):Vec3f {
        var u:number = TraceWorker2.getrandom(new Vec3f(12.9898, 78.233, 151.7182), seed);
        var v:number = TraceWorker2.getrandom(new Vec3f(63.7264, 10.873, 623.6736), seed);

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

        var dotLN:Vec3f = new Vec3f(TraceWorker2.halfLambert(lVec, wNorm) * attenuation);
        dotLN = dotLN.scale(color);

        var indirectLightComponent:Vec3f = new Vec3f(MaterialThickness * Math.max(0.0, lVec.dot(wNorm.negate())));
        indirectLightComponent.addNumber(MaterialThickness * TraceWorker2.halfLambert(eVec.negate(), lVec));
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
            SpecColor.scaleNumber(TraceWorker2.blinnPhongSpecular(wNorm, lVec, SpecularPower) * attenuation * 0.1)
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
new TraceWorker2();