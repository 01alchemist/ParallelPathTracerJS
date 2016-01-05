export class Logger
{
	
	private prefix:string;

	constructor(prefix:string)
	{
		this.prefix = prefix;
		this.printMsg("Logger has started!");
	}

	printMsg(msg:string):void
	{
		console.log("[" + this.prefix + "]: " + msg);
	}

	printErr(msg:string):void
	{
		console.error("[" + this.prefix + "]: ERROR: " + msg);
	}

}
