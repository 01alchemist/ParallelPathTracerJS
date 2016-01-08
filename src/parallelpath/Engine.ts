import {Display} from "./gfx/Display";
import {Tracer} from "./gfx/Tracer";
import {InputListener} from "./InputListener";
import {Logger} from "./util/Logger";
import {TimeUtils} from "./util/TimeUtils";
export class Engine
{

	private running:boolean;

	private display:Display;
	private tracer:Tracer;
	private ilistener:InputListener;
	private log:Logger;

    constructor(display:Display, tracer:Tracer)
	{
		this.display = display;
		this.ilistener = new InputListener();
		//this.display.addKeyListener(this.ilistener);
		//this.display.addMouseListener(this.ilistener);
		//this.display.addMouseMotionListener(this.ilistener);

		this.tracer = tracer;

		this.log = new Logger('Engine');

		this.running = false;
	}

	start():void
	{
        this.tracer.start(this.display);

		if (!this.running)
		{
			this.running = true;
			this.run();
		}
	}

	stop():void
	{
		if (this.running)
		{
			this.running = false;
		}
	}

	run():void
	{
		TimeUtils.init();
		TimeUtils.updateDelta();
		TimeUtils.updateFPS();

        var self = this;

        var step = function(){
            TimeUtils.updateDelta();
            TimeUtils.updateFPS();
            self.display.setTitle(
                "Workers: "+self.tracer.numWorkers+
                " DeltaTime: "+TimeUtils.getDelta()+
                " FPS: "+TimeUtils.getFPS()+"/s"+
                " Eye: "+self.tracer.getCamera().getRot().toString()+
                " Eye_length: "+self.tracer.getCamera().getRot().length()
            );
            self.update(TimeUtils.delta);
            self.render();

            if (self.running)
            {
                requestAnimationFrame(step);
            }
        };

		requestAnimationFrame(step);

		//this.stop();
	}

	update(dt:number):void
	{
        this.tracer.update(dt);
	}

	render():void
	{
        this.tracer.render();
        this.display.render(this.tracer.pixels, this.tracer.iteration);
	}

}
