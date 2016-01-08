import {Camera} from "./Camera";
import {Scene} from "./Scene";
import {Config} from "../util/Config";
import {Display} from "./Display";
import {Thread} from "../cpu/Thread";
import {TraceJob} from "./TraceJob";
import {Vec3f} from "../util/math/Vec3f";
import {TraceWorkerManager} from "./TraceWorkerManager";
import {Mat4f} from "../util/math/Mat4f";

export interface Navigator {
    hardwareConcurrency:number;
}

export class Tracer {
    public camera:Camera;
    public scene:Scene;
    private workerManager:TraceWorkerManager;

    angleX = 0;
    angleY = 0;
    zoomZ = 15.5;

    eye = { x: 0.0, y: 0.0, z: 0.0 };
    center = { x: 0.0, y: 0.0, z: 0.0 };
    up = { x: 0.0, y: 1.0, z: 0.0 };
    FOVY = 45.0;
    invMP:Mat4f = new Mat4f();

    constructor() {
        this.camera = new Camera(new Vec3f(0.0, 1.0, 0.0), 0.005, 0.1);
        this.scene = new Scene();
        this.workerManager = new TraceWorkerManager(this);

        this.eye.x = this.zoomZ * Math.sin(this.angleY) * Math.cos(this.angleX);
        this.eye.y = this.zoomZ * Math.sin(this.angleX);
        this.eye.z = this.zoomZ * Math.cos(this.angleY) * Math.cos(this.angleX);

    }
    get numWorkers():number{
        return this.workerManager.numWorkers;
    }
    get pixels():Uint8Array{
        return this.workerManager.pixels;
    }
    set iterations(value:number){
        this.workerManager.iterations = value;
    }
    get iterations():number{
        return this.workerManager.iterations;
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
