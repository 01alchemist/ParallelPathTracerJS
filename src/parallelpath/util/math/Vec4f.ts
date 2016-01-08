import {Quaternion} from "./Quaternion";
import {Vec2f} from "./Vec2f";
import {Vec3f} from "./Vec3f";
export class Vec4f {

    x:number;
    y:number;
    z:number;
    w:number;

    constructor(x?:number, y?:number, z?:number, w?:number) {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
        this.z = z == undefined ? x : z;
        this.w = w == undefined ? x : w;
    }

    private _isThis(value:any):boolean {
        return value instanceof Object || value instanceof Vec4f;
    }

    get xy():Vec2f {
        return new Vec2f(this.x, this.y);
    }
    get xz():Vec2f {
        return new Vec2f(this.x, this.z);
    }
    get yz():Vec2f {
        return new Vec2f(this.y, this.z);
    }
    get xyz():Vec3f {
        return new Vec3f(this.x, this.y, this.z);
    }

    toString():string {
        return "Vec4f[" + this.x + "," + this.y + "," + this.z + "]";
    }

    equals(v:Vec4f):boolean {
        return (this.x == v.x && this.y == v.y && this.z == v.z);
    }

    set(x:number, y?:number, z?:number):Vec4f {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
        this.z = z == undefined ? x : z;
        return this;
    }

    setVec(v:Vec4f):Vec4f {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    add(v:Vec4f):Vec4f {
        return new Vec4f(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    addNumber(f:number):Vec4f {
        return new Vec4f(this.x + f, this.y + f, this.z + f);
    }

    sub(v:Vec4f):Vec4f {
        return new Vec4f(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    subNumber(f:number):Vec4f {
        return new Vec4f(this.x - f, this.y - f, this.z - f);
    }

    scale(v:Vec4f):Vec4f {
        return new Vec4f(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    scaleNumber(f:number):Vec4f {
        return new Vec4f(this.x * f, this.y * f, this.z * f);
    }

    divide(v:Vec4f):Vec4f {
        return new Vec4f(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w);
    }

    divideNumber(f:number):Vec4f {
        return new Vec4f(this.x / f, this.y / f, this.z / f, this.w / f);
    }

    distance(v:Vec4f):number {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy+ dz * dz);
    }

    cross(v:Vec4f):Vec4f {
        let x = this.y * v.z - v.y * this.z;
        let y = this.z * v.x - v.z * this.x;
        let z = this.x * v.y - v.x * this.y;
        return new Vec4f(x, y, z);
    }

    dot(v:Vec4f):number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    length():number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize():Vec4f {
        let length:number = this.length();
        return new Vec4f(this.x / length, this.y / length, this.z / length);
    }

    negate():Vec4f {
        return new Vec4f(-this.x, -this.y, -this.z);
    }

    reflect(N:Vec4f):Vec4f {
        return this.sub(N.scaleNumber(N.dot(this)).scaleNumber(2.0));
    }

    refract(N:Vec4f, n:number, NdotI:number, cos_t:number):Vec4f {
        cos_t = Math.sqrt(1.0 - cos_t);

        if (cos_t < 1.0)
            return this.scaleNumber(n).add(N.scaleNumber(n * NdotI - cos_t));
        else
            return this.reflect(N);
    }

    rotateTowards(w:Vec4f):Vec4f {
        var dot:number = w.z;

        // No rotation needed
        if (dot > 0.9999) {
            return new Vec4f(this.x, this.y, this.z);
        }

        // Mirror along the z-axis
        if (dot < -0.9999) {
            return new Vec4f(this.x, this.y, -this.z);
        }

        var up:Vec4f = new Vec4f(0.0, 0.0, 1.0);
        var a1:Vec4f = up.cross(w).normalize();
        var a2:Vec4f = a1.cross(w).normalize();

        return a1.scaleNumber(this.x).add(a2.scaleNumber(this.y)).add(w.scaleNumber(this.z)).normalize();
    }

    randomHemisphere():Vec4f {
        var phi:number = Math.random() * (2.0 * Math.PI);
        var rq:number = Math.random();
        var r:number = Math.sqrt(rq);

        var V:Vec4f = new Vec4f(Math.cos(phi) * r, Math.sin(phi) * r, Math.sqrt(1.0 - rq)).normalize();
        return V.rotateTowards(this);
    }


    getComponent(i:number, w:number):number {
        if (i == 0)
            return this.x;
        else if (i == 1)
            return this.y;
        else if (i == 2)
            return this.z;
        else if (i == 3)
            return w;
        else
            return 0.0;
    }

    setComponent(i:number, value:number):void {
        if (i == 0)
            this.x = value;
        else if (i == 1)
            this.y = value;
        else if (i == 2)
            this.z = value;
    }

}