import {Logger} from "./Logger";

export enum material_types{
    PHONG, COOKTORRANCE
}

export enum light_types
{
    DIRECTIONAL, POINT
}
export class Config
{

	static LOG:Logger;

	static RES_ROOT:string = "./res/";

	static window_width:number = 640;
	static window_height:number = 360;
	static display_scale:number = 1;
	static recursion_max:number = 8;
	static thread_amount:number = -1;
    static epsilon:number = 1e-3;
	static debug:boolean = true;
	static ss_enabled:boolean = false;
	static ss_amount:number = 3;
	static ss_jitter:number = 0.001;

    constructor(){

    }

	static init():void
	{
        //Config.LOG = new Logger('ParallelRay');
		/*File f = new File(Config.RES_ROOT + "config.cfg");
		if (f.exists() && !f.isDirectory())
		{
			load();
		} else
		{
			create();
			init();
		}*/
        Config.create();
	}

	static create():void
	{
		/*var p:Map<string,any> = new Map<string,any>();
		var o = null;
		try
		{
			//o = new FileOutputStream(Config.RES_ROOT + "config.json");

			// Set each variable
			p.set("window_width", Config.window_width);
			p.set("window_height", Config.window_height);
			p.set("display_scale", Config.display_scale);
			p.set("recursion_max", Config.recursion_max);
			p.set("thread_amount", Config.thread_amount);
			p.set("epsilon", Config.epsilon);
			p.set("debug", Config.debug);

			// Store the variables
			//p.store(o, null);

			// Close the outputstream object
			//o.close();

			Config.LOG.printMsg(Config.RES_ROOT + "config.cfg" + " Created succesfully!");
		} catch (e)
		{
            Config.LOG.printErr("Couldn't create the main configuration file, closing program...");
		}*/
	}

	static load():void
	{
        /*var p:Map<string,any> = new Map<string,any>();
		var i = null;
		try
		{
			//i = new FileInputStream(Config.RES_ROOT + "config.cfg");

			// Load the file
			//p.load(i);

			// Get the properties and set the config variables
            Config.window_width = p.get("window_width");
            Config.window_height = p.get("window_height");
            Config.display_scale = p.get("display_scale");
            Config.recursion_max = p.get("recursion_max");
            Config.thread_amount = p.get("thread_amount");
            Config.epsilon = p.get("epsilon");
            Config.debug = p.get("debug");

			// Close the inputstream object
			//i.close();

            Config.LOG.printMsg(Config.RES_ROOT + "config.cfg" + " loaded succesfully!");
		} catch (e)
		{
            Config.LOG.printErr("Couldn't load the main configuration file, closing program...");
		}*/
	}

}
