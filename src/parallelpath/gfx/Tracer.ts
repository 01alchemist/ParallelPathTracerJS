import {Camera} from "./Camera";
import {Scene} from "./Scene";
import {Config} from "../util/Config";
import {Display} from "./Display";
import {Thread} from "../cpu/Thread";
import {TraceJob} from "./TraceJob";
import {Vec3f} from "../util/math/Vec3f";
import {TraceWorkerManager} from "./TraceWorkerManager";

export interface Navigator {
    hardwareConcurrency:number;
}

export class Tracer {
    public camera:Camera;
    public scene:Scene;
    private workerManager:TraceWorkerManager;

    constructor() {
        this.camera = new Camera(new Vec3f(0.0, 1.0, 0.0), 0.005, 0.1);
        this.scene = new Scene();
        this.workerManager = new TraceWorkerManager(this);
    }
    get numWorkers():number{
        return this.workerManager.numWorkers;
    }
    get pixels():Uint8Array{
        return this.workerManager.pixels;
    }
    get iteration():number{
        return this.workerManager.iteration;
    }
    update(dt:number) {
        this.scene.update(dt);
        this.camera.update(dt);
    }

    start(display:Display) {
        this.workerManager.start(display);
    }
    render() {
        this.workerManager.render();
    }

    getCamera():Camera {
        return this.camera;
    }

    getScene():Scene {
        return this.scene;
    }
}
