import {Quaternion} from "./Quaternion";
import {Vec2f} from "./Vec2f";
export class Vec3f {

    x:number;
    y:number;
    z:number;

    constructor(x?:number, y?:number, z?:number) {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
        this.z = z == undefined ? x : z;
    }

    private _isThis(value:any):boolean {
        return value instanceof Object || value instanceof Vec3f;
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

    toString():string {
        return "Vec3f[" + this.x + "," + this.y + "," + this.z + "]";
    }

    equals(v:Vec3f):boolean {
        return (this.x == v.x && this.y == v.y && this.z == v.z);
    }

    set(x:number, y?:number, z?:number):Vec3f {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
        this.z = z == undefined ? x : z;
        return this;
    }

    setVec(v:Vec3f):Vec3f {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    add(v:Vec3f):Vec3f {
        return new Vec3f(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    addNumber(f:number):Vec3f {
        return new Vec3f(this.x + f, this.y + f, this.z + f);
    }

    sub(v:Vec3f):Vec3f {
        return new Vec3f(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    subNumber(f:number):Vec3f {
        return new Vec3f(this.x - f, this.y - f, this.z - f);
    }

    scale(v:Vec3f):Vec3f {
        return new Vec3f(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    scaleNumber(f:number):Vec3f {
        return new Vec3f(this.x * f, this.y * f, this.z * f);
    }

    divide(v:Vec3f):Vec3f {
        return new Vec3f(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    divideNumber(f:number):Vec3f {
        return new Vec3f(this.x / f, this.y / f, this.z / f);
    }

    distance(v:Vec3f):number {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy+ dz * dz);
    }

    cross(v:Vec3f):Vec3f {
        let x = this.y * v.z - v.y * this.z;
        let y = this.z * v.x - v.z * this.x;
        let z = this.x * v.y - v.x * this.y;
        return new Vec3f(x, y, z);
    }

    dot(v:Vec3f):number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    mul(q:Quaternion):Vec3f {
        let q_inv:Quaternion = q.conjugate();

        let w:Quaternion = q.mulVector(this).mul(q_inv);

        return new Vec3f(w.x, w.y, w.z);
    }

    length():number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize():Vec3f {
        let length:number = this.length();
        return new Vec3f(this.x / length, this.y / length, this.z / length);
    }

    negate():Vec3f {
        return new Vec3f(-this.x, -this.y, -this.z);
    }

    reflect(N:Vec3f):Vec3f {
        return this.sub(N.scaleNumber(N.dot(this)).scaleNumber(2.0));
    }

    refract(N:Vec3f, n:number, NdotI:number, cos_t:number):Vec3f {
        cos_t = Math.sqrt(1.0 - cos_t);

        if (cos_t < 1.0)
            return this.scaleNumber(n).add(N.scaleNumber(n * NdotI - cos_t));
        else
            return this.reflect(N);
    }

    rotateTowards(w:Vec3f):Vec3f {
        var dot:number = w.z;

        // No rotation needed
        if (dot > 0.9999) {
            return new Vec3f(this.x, this.y, this.z);
        }

        // Mirror along the z-axis
        if (dot < -0.9999) {
            return new Vec3f(this.x, this.y, -this.z);
        }

        var up:Vec3f = new Vec3f(0.0, 0.0, 1.0);
        var a1:Vec3f = up.cross(w).normalize();
        var a2:Vec3f = a1.cross(w).normalize();

        return a1.scaleNumber(this.x).add(a2.scaleNumber(this.y)).add(w.scaleNumber(this.z)).normalize();
    }

    randomHemisphere():Vec3f {
        var phi:number = Math.random() * (2.0 * Math.PI);
        var rq:number = Math.random();
        var r:number = Math.sqrt(rq);

        var V:Vec3f = new Vec3f(Math.cos(phi) * r, Math.sin(phi) * r, Math.sqrt(1.0 - rq)).normalize();
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