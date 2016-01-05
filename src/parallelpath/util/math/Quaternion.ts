import {MathUtils} from "./MathUtils";
import {Vec3f} from "./Vec3f";

export class Quaternion {

    w:number;
    x:number;
    y:number;
    z:number;

    constructor(w?:number, x?:number, y?:number, z?:number) {
        this.w = w == undefined?0:w;
        this.x = x == undefined?0:x;
        this.y = y == undefined?0:y;
        this.z = z == undefined?0:z;
    }

    set(w:Quaternion|number, x?:number, y?:number, z?:number):Quaternion {
        let q:Quaternion = this._isThis(w) ? <Quaternion>w : null;

        if(q){
            this.w = q.w;
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
        }else{
            this.w = <number>w;
            this.x = x;
            this.y = y;
            this.z = z;
        }

        return this;
    }

    private _isThis(value:any):boolean{
        if(value instanceof Object || value instanceof Quaternion){
            if(value.w != undefined && value.x != undefined && value.y != undefined&& value.z != undefined){
                return true;
            }
        }
        return false;
    }

    toString():string {
        return "Quaternion[" + this.w + "," + this.x + "," + this.y + "," + this.z + "]";
    }

    equals(q:Quaternion):boolean {
        return (this.w == q.w && this.x == q.x && this.y == q.y && this.z == q.z);
    }

    createFromAxisAngle(x:number, y:number, z:number, theta:number):Quaternion {
        theta = MathUtils.toRadians(theta);

        this.w = Math.cos(theta / 2.0);
        this.x = x * Math.sin(theta / 2.0);
        this.y = y * Math.sin(theta / 2.0);
        this.z = z * Math.sin(theta / 2.0);

        return this;
    }

    mul(value:Quaternion|Vec3f):Quaternion {
        let r:Quaternion = new Quaternion();
        if (this._isThis(value)) {

            let q:Quaternion = <Quaternion>value;

            r.w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
            r.x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
            r.y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
            r.z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        } else if (value instanceof Vec3f || value instanceof Object) {
            r = this.mulVector(<Vec3f>value);
        }

        return r;
    }

    mulVector(v:Vec3f):Quaternion {
        let r:Quaternion = new Quaternion();

        r.w = -this.x * v.x - this.y * v.y - this.z * v.z;
        r.x = this.w * v.x + this.y * v.z - this.z * v.y;
        r.y = this.w * v.y + this.z * v.x - this.x * v.z;
        r.z = this.w * v.z + this.x * v.y - this.y * v.x;

        return r;
    }

    conjugate():Quaternion {
        return new Quaternion(this.w, -this.x, -this.y, -this.z);
    }

    normalize():Quaternion {
        let length:number = this.length();
        return new Quaternion(this.w / length, this.x / length, this.y / length, this.z / length);
    }

    length() {
        return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
    }

    getForwardVector():Vec3f {
        return new Vec3f(0, 0, 1).mul(this);
    }

    getUpVector():Vec3f {
        return new Vec3f(0, 1, 0).mul(this);
    }

    getRightVector():Vec3f {
        return new Vec3f(1, 0, 0).mul(this);
    }

}
