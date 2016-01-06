import {Config} from "../util/Config";
import {TraceJob} from "./TraceJob";
import {Thread} from "../cpu/Thread";
import {Display} from "./Display";
import {Tracer} from "./Tracer";
import {TraceWorker} from "../worker/TraceWorker";
/**
 * Created by r3f on 4/1/2016.
 */

export interface SharedArrayBuffer extends ArrayBuffer {

}

//export var SharedArrayBuffer = SharedArrayBuffer || ArrayBuffer;

export class TraceWorkerManager {

    private propertySize:number = 512;
    private propertyMemory:Uint8Array;
    private sceneMemory:Uint8Array;
    private pixelMemory:Uint8ClampedArray;

    private jobs:Array<TraceJob>;

    constructor(private tracer:Tracer) {

        var width:number = Config.window_width;
        var height:number = Config.window_height;
        this.propertyMemory = new Uint8Array(new SharedArrayBuffer(this.propertySize));
        this.pixelMemory = new Uint8Array(new SharedArrayBuffer(width * height * 3));

        this.jobs = [];

        this.setWorkerAmount(Config.thread_amount);
    }

    get numWorkers():number {
        return this.jobs.length;
    }

    get pixels():Uint8Array {
        return this.pixelMemory;
    }

    setWorkerAmount(n:number):void {
        if (n <= 0) {
            n = navigator["hardwareConcurrency"] || 2;
        }

        n = n > 2 ? 2 : n;

        n = 4;

        console.info("hardwareConcurrency:" + n);

        this.jobs = [];

        var width:number = Config.window_width;
        var height:number = Config.window_height;

        var thread_id = 0;

        if (n > 1) {
            width /= n;
            height /= n;
            for (var j = 0; j < n; j++) {
                for (var i = 0; i < n; i++) {
                    this.jobs.push(new TraceJob(
                        this.pixelMemory,
                        width, height, i * width, j * height, ++thread_id, this.tracer
                    ));
                }
            }
        } else {
            this.jobs.push(new TraceJob(
                this.pixelMemory, width, height, 0, 0, 0, this.tracer
            ));
        }
    }

    start(display:Display):void {
        console.log("start");
        this.jobs.forEach(function (w:TraceJob) {
            w.setDisplay(display);
        });
    }

    render():void {
        if (this.workersFinished()) {
            this.jobs.forEach(function (w:TraceJob) {
                w.run();
            });
        }
    }

    workersFinished():boolean {
        var isAllFinished:boolean = true;
        for (var i = 0; i < this.jobs.length; i++) {
            if (!this.jobs[i].thread.initialized || !this.jobs[i].finished) {
                isAllFinished = false;
            }
        }
        return isAllFinished;
    }
}