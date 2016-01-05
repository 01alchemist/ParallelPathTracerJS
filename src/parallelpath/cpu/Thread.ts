import {TraceWorker} from "../worker/TraceWorker";
/**
 * Created by r3f on 4/1/2016.
 */
export class Thread{

    instance:Worker;

    onTraceComplete:Function;
    onInitComplete:Function;

    initialized:boolean;
    isTracing:boolean;

    constructor(name:string){
        this.instance = new Worker("WorkerBootstrap.js");

        var self = this;

        this.instance.onmessage = function(event){
            if(event.data == TraceWorker.INITED){
                self.initialized = true;
                self.isTracing = false;
                if(self.onInitComplete){
                    self.onInitComplete();
                }
            }
            if(event.data == TraceWorker.TRACED){
                self.isTracing = false;
                if(self.onTraceComplete){
                    self.onTraceComplete();
                }
            }
        }
    }
    trace():void {
        this.isTracing = true;
        this.instance.postMessage(TraceWorker.TRACE);
    }
    sendCommand(message:string):void {
        this.instance.postMessage(message);
    }
    sendData(data:any, buffers?):void {
        this.instance.postMessage(data, buffers);
    }
}