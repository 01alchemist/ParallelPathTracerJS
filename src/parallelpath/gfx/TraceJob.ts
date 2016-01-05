import {Display, Tracer, Light, Scene, TracerObject} from "./gfx";
import {Config, Ray, Intersection, Primitive, Vec3f, MathUtils, light_types} from "../util/util";
import {Shader} from "../shader/Shader";
import {Thread} from "../cpu/Thread";
import {TraceWorker} from "../worker/TraceWorker";

export class TraceJob {

    private width:number;
    private height:number;
    private xoffset:number;
    private yoffset:number;
    private id:number;
    private finished:boolean;

    private tracer:Tracer;
    private display:Display;
    private propertyMemory:Uint8Array;
    private pixelMemory:Uint8Array;
    public thread:Thread;

    constructor(pixelMemory:Uint8Array, width:number, height:number, xoffset:number, yoffset:number, id:number, tracer:Tracer) {
        /*this.propertyMemory = propertyMemory;*/
        this.pixelMemory = pixelMemory;
        this.width = width;
        this.height = height;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.id = id;
        this.finished = true;
        this.tracer = tracer;
        var self = this;

        this.thread = new Thread("Worker: " + id);
        this.thread.onInitComplete = function(){

        };
        this.thread.onTraceComplete = function(){
            self.finished = true;
        };
        this.thread.sendCommand(TraceWorker.INIT);
        this.thread.sendData({
            pixelMemory: pixelMemory.buffer,
            window_width: Config.window_width,
            window_height: Config.window_height,
            width: width,
            height: height,
            xoffset: xoffset,
            yoffset: yoffset,
            tracer: this.tracer
        },[pixelMemory.buffer]);
    }

    interval=0;

    run():void {
        this.finished = false;

        //console.log("i am running...");
        if(this.thread.initialized && !this.thread.isTracing){
            this.thread.trace();
            this.thread.sendData({ar: this.display.getAR(), rot:this.tracer.camera.rot, pos:this.tracer.camera.pos});

            if(this.interval % 500000 == 0){
                //console.log(this.tracer.camera.getRight());
                //Ray.calcCameraRay(this.tracer.camera, Config.window_width, Config.window_height, this.display.getAR(), 0, 0);
            }
        }


        /*if (this.tracer != null && this.display != null)
         {
         var width:number = Config.window_width;
         var height:number = Config.window_height;
         var ray_primary:Ray = new Ray();
         for (var y:number = this.yoffset; y < this.yoffset + this.height; y++)
         {
         for (var x:number = this.xoffset; x < this.xoffset + this.width; x++)
         {
         ray_primary = Ray.calcCameraRay(this.tracer.getCamera(), width, height, this.display.getAR(), x, y);
         this.display.drawPixelVec3f(x, y, TraceJob.traceColor(ray_primary, this.tracer.getScene(), 0));
         if (Config.debug && x == this.xoffset + 1 || Config.debug && y == this.yoffset)
         this.display.drawPixelInt(x, y, 0xFFFF00F);
         }
         }
         }*/
    }

    static traceColor(ray:Ray, scene:Scene, n:number):Vec3f {
        // Break out from the method if max recursion depth is hit
        if (n > Config.recursion_max)
            return Shader.COLOR_NULL;

        // Initialize the required intersection data
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;

        // Find the nearest intersection point
        scene.getObjects().forEach(function (obj:TracerObject) {
            obj.getPrimitives().forEach(function (primitive:Primitive) {
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
            return Shader.COLOR_NULL;

        // Initialize the main color which will be calculated and returned
        var cFinal:Vec3f = new Vec3f();

        // Shade the surface point against all lights in the scene
        scene.getLights().forEach(function (light:Light) {
            cFinal.set(cFinal.add(Shader.main(ray, xFinal, light, xObject.getMaterial())));

            var ray_shadow:Ray = null;

            if (xObject.getMaterial().getReflectivity() != 1.0) {
                var L_Vector:Vec3f = light.getPos().sub(xFinal.getPos());
                var L_length:number = L_Vector.length();

                if (light.getLightType() == light_types.DIRECTIONAL) {

                    ray_shadow = new Ray(xFinal.getPos(), light.getDir().negate());
                    L_length = Number.MAX_VALUE;
                }
                else if (light.getLightType() == light_types.POINT) {

                    ray_shadow = new Ray(xFinal.getPos(), L_Vector);
                }

                if (ray_shadow != null) {
                    cFinal.set(cFinal.scale(Math.min(TraceJob.traceShadow(ray_shadow, scene, xObject, L_length) + xObject.getMaterial().getReflectivity(), 1.0)));
                }
            }

        });

        if (xObject.getMaterial().getReflectivity() > 0.0) {
            var ray_reflected:Ray = new Ray(xFinal.getPos(), ray.getDir().reflect(xFinal.getNorm()));
            cFinal.set(cFinal.add(TraceJob.traceColor(ray_reflected, scene, n + 1).scale(xObject.getMaterial().getReflectivity())));
        }

        if (xObject.getMaterial().getRefractivity() > 0.0) {
            var ray_refracted:Ray;
            var N:Vec3f = xFinal.getNorm();
            var NdotI:number = ray.getDir().dot(N), ior, n1, n2, cos_t;

            if (NdotI > 0.0) {
                n1 = ray.getIOR();
                n2 = xObject.getMaterial().getIOR();
                N = N.negate();
            } else {
                n1 = xObject.getMaterial().getIOR();
                n2 = ray.getIOR();
                NdotI = -NdotI;
            }

            ior = n2 / n1;
            cos_t = ior * ior * (1.0 - NdotI * NdotI);

            ray_refracted = new Ray(xFinal.getPos(), ray.getDir().refract(N, ior, NdotI, cos_t), 1.0);
            cFinal.set(cFinal.add(TraceJob.traceColor(ray_refracted, scene, n + 1).scale(xObject.getMaterial().getRefractivity())));
        }

        cFinal.set(cFinal.add(xObject.getMaterial().getColorAmbient()));

        return <Vec3f>MathUtils.clamp(cFinal, 0.0, 1.0);
    }

    static traceShadow(ray:Ray, s:Scene, thisobj:TracerObject, L_length:number) {
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;
        var weight:number = 1.0;

        s.getObjects().forEach(function (obj:TracerObject) {
            if (obj === thisobj) {
                return;
            }

            obj.getPrimitives().forEach(function (primitive:Primitive) {
                xInit = primitive.intersect(ray);
                if (xInit != null && xInit.getT() < tInit && xInit.getT() < L_length) {
                    xFinal = xInit;
                    tInit = xFinal.getT();
                    xObject = obj;
                }
            });
        });

        if (xFinal == null) {
            return 1.0;
        }

        if (xObject.getMaterial().getReflectivity() > 0.0) {
            weight -= xObject.getMaterial().getReflectivity();
        }

        if (xObject.getMaterial().getRefractivity() > 0.0) {
            weight *= xObject.getMaterial().getRefractivity();
        }

        return weight;
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

    setDisplay(display:Display):void {
        this.display = display;
    }
}
