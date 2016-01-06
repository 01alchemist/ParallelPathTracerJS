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
    public finished:boolean;

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
        this.finished = false;
        this.tracer = tracer;
        var self = this;

        this.thread = new Thread("Worker: " + id);
        this.thread.onInitComplete = function(){
            self.finished = true;
        };
        this.thread.onTraceComplete = function(){
            //console.timeEnd("TRACE_"+id);
            self.finished = true;
        };
        this.thread.sendCommand(TraceWorker.INIT);
        this.thread.sendData({
            id: id,
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

    run():void {
        //console.log("i am running...");
        if(this.thread.initialized && !this.thread.isTracing){
            this.finished = false;
            //console.time("TRACE_"+this.id);
            this.thread.trace();
            this.thread.sendData({ar: this.display.getAR(), rot:this.tracer.camera.rot, pos:this.tracer.camera.pos});
        }
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
