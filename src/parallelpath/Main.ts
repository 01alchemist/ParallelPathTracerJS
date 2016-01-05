import {Display, Tracer} from "./gfx/gfx";
import {Config} from "./util/util";
import {Engine} from "./Engine";

export class Main
{

	static display:Display;
	static tracer:Tracer;
	static engine:Engine;

	constructor() {
        Config.init();
		Main.display = new Display(Config.window_width, Config.window_height, Config.display_scale, "Parallel PathTracer");
        Main.display.create();
        Main.tracer = new Tracer();
        Main.engine = new Engine(Main.display, Main.tracer);
        Main.engine.start();
	}

}
new Main();