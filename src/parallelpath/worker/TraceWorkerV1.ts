import {Display, Tracer, Light, Scene, TracerObject} from "../gfx/gfx";
import {Config, Ray, Intersection, Primitive, Vec3f, MathUtils, light_types} from "../util/util";
import {Shader} from "../shader/Shader";
import {Plane} from "../util/math/Plane";
import {Sphere} from "../util/math/Sphere";
import {Camera} from "../gfx/Camera";
import {Material} from "../gfx/Material";

export class TraceWorker {

    static INIT:string = "INIT";
    static INITED:string = "INITED";
    static TRACE:string = "TRACE";
    static TRACED:string = "TRACED";

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
                //self.tracer.camera.rot.setFromQuaternion(e.data.rot);
                self.tracer.camera.pos.setVec(e.data.pos);
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
    }

    run():void {
        this.finished = false;

        //console.time("Traced");

        if (this.tracer != null) {

            var ray_primary:Ray = new Ray();

            for (var y:number = this.yoffset; y < this.yoffset + this.height; y++) {

                for (var x:number = this.xoffset; x < this.xoffset + this.width; x++) {

                    var _x = x - this.xoffset;
                    var _y = y - this.yoffset;
                    var index:number = ((_y * (this.width * 3)) + (_x * 3));
                    var color:Vec3f;

                    if (Config.ss_enabled)
                    {
                        var sample:Vec3f = Shader.COLOR_NULL;

                        // Sample the pixels n times
                        for (var i:number = 0; i < Config.ss_amount; i++)
                        {
                            // Calculate the randomized primary ray
                            var ray:Ray = Ray.calcSupersampledCameraRay(
                                this.tracer.camera,
                                this.window_width,
                                this.window_height,
                                this.ar, x, y, Config.ss_jitter
                            );

                            // Do the path tracing
                            sample = sample.add(TraceWorker.pathTrace(ray, this.tracer.scene, 0, 1.0));
                        }

                        // Get the average color of the sample
                        color = sample.divideNumber(Config.ss_amount);

                        // Add the averaged sample to the samples
                        color.x = this.samples[index] = this.samples[index] + color.x;
                        color.y = this.samples[index + 1] = this.samples[index + 1] + color.y;
                        color.z = this.samples[index + 2] = this.samples[index + 2] + color.z;

                    } else {
                        ray_primary = Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);

                        // Do the path tracing

                        color = TraceWorker.pathTrace(ray_primary, this.tracer.scene, 0, 1.0);

                        color.x = this.samples[index] = this.samples[index] + color.x;
                        color.y = this.samples[index + 1] = this.samples[index] + color.y;
                        color.z = this.samples[index + 2] = this.samples[index] + color.z;
                    }

                    var screen_index:number = ((y * (this.window_width * 3)) + (x * 3));

                    this.drawPixelVec3fAveraged(screen_index, color, this.samples_taken);
                    //this.drawPixelVec3f(x, y, TraceWorker.traceColor(ray_primary, this.tracer.scene, 0));

                    if (Config.debug && x == this.xoffset || Config.debug && y == this.yoffset) {
                        this.drawPixelInt(screen_index, 0xFFFF00F);
                    }
                }
            }
        }

        //console.timeEnd("Traced");
        this.samples_taken++;
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

    drawPixelVec3f(x:number, y:number, color:Vec3f):void {

        color = <Vec3f>MathUtils.smoothstep(MathUtils.clamp(color, 0.0, 1.0), 0.0, 1.0);

        var index:number = ((y * (this.window_width * 3)) + (x * 3));
        var red:number = (color.x * 255.0);
        var green:number = (color.y * 255.0);
        var blue:number = (color.z * 255.0);
        //var hex_value:number = ((red << 16) | (green << 8) | blue);

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
        this.pixelMemory[index + 3] = 255;
    }

    drawPixelInt(index:number, color:number) {

        var red = (color >> 16) & 255;
        var green = (color >> 8) & 255;
        var blue = color & 255;

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
    }

    static pathTrace(ray:Ray, scene:Scene, n:number, weight:number):Vec3f {
        // Break out from the method if max recursion depth is hit
        if (n > Config.recursion_max) {
            return Shader.COLOR_WHITE;
        }

        // Initialize the required intersection data
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;

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
        if (xFinal == null)
            return Shader.COLOR_RED;

        // If the ray hit a purely emissive surface, return the emittance
        if (xObject.material.emittance.length() > 0.0 && xFinal.getT() > Config.epsilon) {
            return xObject.material.emittance.scaleNumber(weight);
        }

        // Store the required data into temp objects
        var M:Material = xObject.material;
        var P:Vec3f = xFinal.pos;
        var N:Vec3f = xFinal.norm;
        var RO:Vec3f = ray.origin;
        var RD:Vec3f = ray.dir;

        // Initialize the total color vector
        var color:Vec3f = new Vec3f();

        // Calculate the russian roulette probabilities
        var Kd:number = M.reflectance.length();
        var Ks:number = M.reflectivity;
        var Pp:number = Kd / (Kd + Ks);
        var Pr:number = Math.random();

        // Refractive BRDF
        if (M.refractivity > 0.0)
        {
            weight *= M.refractivity;

            // Initialize some values
            var NdotI:number = RD.dot(N), IOR, n1, n2, fresnel;
            var refractedRay:Ray;

            // Are we going into a medium or getting out from it?
            if (NdotI > 0.0)
            {
                n1 = ray.ior;
                n2 = M.ior;
                N = N.negate();
            }
            else
            {
                n1 = M.ior;
                n2 = ray.ior;
                NdotI = -NdotI;
            }

            // Calculate the final index of refraction at the incident
            IOR = n2 / n1;

            // Calculate the cosine term
            var cos_t = IOR * IOR * (1.0 - NdotI * NdotI);

            cos_t = Math.sqrt(1.0 - cos_t);
            fresnel = (Math.sqrt((n1 * NdotI - n2 * cos_t) / (n1 * NdotI + n2 * cos_t)) + Math.sqrt((n2 * NdotI - n1 * cos_t) / (n2 * NdotI + n1 * cos_t))) * 0.5;

            // A little bit of russian roulette to decide if the ray reflects or refracts, depends on the fresnel term that's in the range of 0..1
            if (Math.random() <= fresnel) {
                refractedRay = new Ray(P, RD.reflect(N).normalize());
            } else {
                refractedRay = new Ray(P, RD.refract(N, IOR, NdotI, cos_t).normalize());
                //refractedRay.setCurrentMediumIOR(IOR);
            }

            color = color.add(TraceWorker.pathTrace(refractedRay, scene, n + 1, weight));
        }

        if (Pr < Pp && Kd + Ks != 0.0)
        // Choose diffuse BRDF with probability Pp
        {
            // Diffuse BRDF
            if (M.reflectance.length() > 0.0)
            {
                var randomRay:Ray = new Ray(P, N.randomHemisphere());
                var NdotRD:number = Math.abs(N.dot(randomRay.dir));
                var BRDF:Vec3f = M.reflectance.scaleNumber((1.0 / Math.PI) * 2.0 * NdotRD);
                var REFLECTED:Vec3f = TraceWorker.pathTrace(randomRay, scene, n + 1, weight);
                color = color.add(BRDF.scale(REFLECTED));
                //color = BRDF.scale(REFLECTED);
            }
        }
        else
        // Choose reflective BRDF with probability 1 - Pp
        {
            // Reflective BRDF
            if (M.reflectivity > 0.0)
            {
                weight *= M.reflectivity;
                var reflectedRay:Ray = new Ray(P, RD.reflect(N).normalize());
                color = color.add(TraceWorker.pathTrace(reflectedRay, scene, n + 1, weight));
            }
        }

        return color;
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