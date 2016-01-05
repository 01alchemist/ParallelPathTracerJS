import {Quaternion} from "./Quaternion";
export class Vec3f {

    x:number;
    y:number;
    z:number;

    constructor(x?:number, y?:number, z?:number) {
        x = x == undefined ? 0 : x;
        y = y == undefined ? x : y;
        z = z == undefined ? x : z;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    private _isThis(value:any):boolean {
        return value instanceof Object || value instanceof Vec3f;
    }

    toString():string {
        return "Vec3f[" + this.x + "," + this.y + "," + this.z + "]";
    }

    equals(v:Vec3f):boolean {
        return (this.x == v.x && this.y == v.y && this.z == v.z);
    }

    set(x:number|Vec3f, y?:number, z?:number):Vec3f {
        let v:Vec3f = this._isThis(x) ? <Vec3f>x : null;
        if (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        } else {
            this.x = <number>x;
            this.y = y;
            this.z = z;
        }

        return this;
    }

    add(value:Vec3f | number):Vec3f {
        let v:Vec3f = this._isThis(value) ? <Vec3f>value : null;
        if (v) {
            return new Vec3f(this.x + v.x, this.y + v.y, this.z + v.z);
        } else {
            let f:number = <number>value;
            return new Vec3f(this.x + f, this.y + f, this.z + f);
        }
    }

    sub(value:Vec3f | number):Vec3f {
        let v:Vec3f = this._isThis(value) ? <Vec3f>value : null;
        if (v) {
            return new Vec3f(this.x - v.x, this.y - v.y, this.z - v.z);
        } else {
            let f:number = <number>value;
            return new Vec3f(this.x - f, this.y - f, this.z - f);
        }
    }

    scale(value:Vec3f | number):Vec3f {
        let v:Vec3f = this._isThis(value) ? <Vec3f>value : null;
        if (v) {
            return new Vec3f(this.x * v.x, this.y * v.y, this.z * v.z);
        } else {
            let f:number = <number>value;
            return new Vec3f(this.x * f, this.y * f, this.z * f);
        }
    }

    divide(value:Vec3f | number):Vec3f {
        let v:Vec3f = this._isThis(value) ? <Vec3f>value : null;
        if (v) {
            return new Vec3f(this.x / v.x, this.y / v.y, this.z / v.z);
        } else {
            let f:number = <number>value;
            return new Vec3f(this.x / f, this.y / f, this.z / f);
        }
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

        let w:Quaternion = q.mul(this).mul(q_inv);

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
        return this.sub(N.scale(N.dot(this)).scale(2.0));
    }

    refract(N:Vec3f, n:number, NdotI:number, cos_t:number):Vec3f {
        cos_t = Math.sqrt(1.0 - cos_t);

        if (cos_t < 1.0)
            return this.scale(n).add(N.scale(n * NdotI - cos_t));
        else
            return this.reflect(N);
    }
    rotateTowards(w:Vec3f):Vec3f
    {
        var dot:number = w.z;
    
        // No rotation needed
        if (dot > 0.9999)
        {
            return new Vec3f(this.x, this.y, this.z);
        }
    
        // Mirror along the z-axis
        if (dot < -0.9999)
        {
            return new Vec3f(this.x, this.y, -this.z);
        }
    
        var up:Vec3f = new Vec3f(0.0, 0.0, 1.0);
        var a1:Vec3f = up.cross(w).normalize();
        var a2:Vec3f = a1.cross(w).normalize();
    
        return a1.scale(this.x).add(a2.scale(this.y)).add(w.scale(this.z)).normalize();
    }
    
    randomHemisphere():Vec3f
    {
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