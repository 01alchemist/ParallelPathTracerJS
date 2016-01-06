import {Vec3f} from "../util/math/Vec3f";
import {MathUtils} from "../util/math/MathUtils";
import {Config} from "../util/Config";
import {WebGLView} from "../gl/WebGLView";
export class Display {

    static serialVersionUID:number = 1;

    private title:string;
    private width:number;
    private height:number;
    private scale:number;
    private pixels:Uint8Array;
    private image;//:BufferedImage;
    private dimension;//:Dimension;
    private info;
    private canvas;
    private ctx;
    private glView:WebGLView;
    private bufferstrategy;//:BufferStrategy;

    constructor(width:number, height:number, scale:number, title:string) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    public create(pixels:Uint8Array):void {

        this.info = document.getElementById("info");
        this.canvas = document.getElementById("viewport");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        //this.glView = new WebGLView(this.canvas, pixels);

        this.ctx = this.canvas.getContext("2d");
        if (this.image == null) {
            this.image = new ImageData(this.width, this.height);
            this.pixels = this.image.data;
            this.clear();
        }
        this.ctx.putImageData(this.image, 0, 0);
    }

    public render(_pixels):void {

        //this.glView.render();
        //var proxy = this.image.data;



        for (var y = 0; y < this.image.height; y++) {
            for (var x = 0; x < this.image.width; x++) {
                var index = ((y * (this.image.width * 3)) + (x * 3));
                var i = ((y * (this.image.width * 4)) + (x * 4));
                this.pixels[i] = _pixels[index];
                this.pixels[i + 1] = _pixels[index + 1];
                this.pixels[i + 2] = _pixels[index + 2];
                this.pixels[i + 3] = 255;
            }
        }

        this.ctx.putImageData(this.image, 0, 0);
        /*this.ctx.fillStyle = 'rgba(255,0,0,255)';
         this.ctx.fillRect(Math.random() * 100,Math.random() * 100,50,50);*/

    }

    clear() {
        //Array.fill(this.pixels, 0x000000);
    }

    getWidth():number {
        return this.width;
    }

    getHeight():number {
        return this.height;
    }

    getPixels():Uint8Array {
        return this.pixels;
    }

    getImage() {
        return this.image;
    }

    getDimension() {
        return this.dimension;
    }

    /*getJFrame()
     {
     return this.jframe;
     }*/

    get2dContex() {
        return this.ctx;
    }

    getAR():number {
        return this.width / this.height;
    }

    getScale():number {
        return this.scale;
    }

    setTitle(title:string) {
        //this.jframe.setTitle(this.title + " | " + this.title);
        this.info.innerHTML = this.title + " | " + title;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setPixels(pixels:Uint8Array) {
        this.pixels = pixels;
    }

    setImage(image) {
        this.image = image;
    }

    setDimension(dimension) {
        this.dimension = dimension;
    }

    /*setJFrame(jframe)
     {
     this.jframe = jframe;
     }*/

    setScale(scale:number) {
        this.scale = scale;
    }

}