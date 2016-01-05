export class TimeUtils
{

	static second:number  = 1000000;
	static frame:number   = 1000;
	static timeres:number = 1;

	static currentTime:number=0;
	static lastTime:number=0;
	static time:number=0;
	static delta:number=1;
	static fps:number=0;

	static init():void
	{
		TimeUtils.lastTime = TimeUtils.getTime();
		TimeUtils.updateDelta();
	}

	static updateDelta():void
	{
        TimeUtils.currentTime = TimeUtils.getTime();
        if(TimeUtils.currentTime - TimeUtils.lastTime != 0){
			TimeUtils.delta = TimeUtils.delta * 0.9 + (TimeUtils.currentTime - TimeUtils.lastTime) * 0.1;
			TimeUtils.lastTime = TimeUtils.currentTime;
		}
	}

	static updateFPS():void
	{
		TimeUtils.time++;

		if (TimeUtils.time >= TimeUtils.timeres)
		{
			if (isFinite(TimeUtils.fps)){
				TimeUtils.fps = 0.0;
			}
            TimeUtils.fps = (TimeUtils.fps * 0.9 + (TimeUtils.timeres / TimeUtils.delta) * 0.1);
            TimeUtils.time -= TimeUtils.timeres;
		}
	}

	static getTime():number
	{
		return performance.now();
	}

	static getDelta():string
	{
		return TimeUtils.delta.toFixed(2);
	}

	static getFPS():string
	{
		return (TimeUtils.frame * TimeUtils.fps).toFixed(2);
	}

}
