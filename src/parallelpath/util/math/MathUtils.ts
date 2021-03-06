import {Vec3f} from "./Vec3f";
import {Vec2f} from "./Vec2f";

export class MathUtils {

    static mod(a:number, b:number):number {
        return a % b;
    }

    static dotVec2(a:Vec2f, b:Vec2f):number {
        return a.x * b.x + a.y * b.y;
    }

    static dotVec3(a:Vec3f, b:Vec3f):number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static fract(x:number):number {
        return x - Math.floor(x);
    }

    static toRadians(degree:number):number {
        return degree * Math.PI / 180;
    }

    static toDegrees(radians:number):number {
        return radians * 180 / Math.PI;
    }

    static max(v:Vec3f):number {
        return Math.max(v.x, Math.max(v.y, v.z));
    }

    static clamp(f:number| Vec3f, min:number, max:number):number | Vec3f {
        if (f instanceof Vec3f) {

            let v:Vec3f = f;
            let x:number = MathUtils.clamp2(v.x, min, max);
            let y:number = MathUtils.clamp2(v.y, min, max);
            let z:number = MathUtils.clamp2(v.z, min, max);
            return new Vec3f(x, y, z);
        } else {
            return MathUtils.clamp2(<number>f, min, max);
        }

    }

    static clamp2(f:number, min:number, max:number):number {
        return Math.max(min, Math.min(f, max));
    }

    static interpolate(f:Vec3f|number, min:number, max:number):number|Vec3f {
        if (f instanceof Vec3f) {

            let v:Vec3f = f;
            let x:number = MathUtils.interpolate2(v.x, min, max);
            let y:number = MathUtils.interpolate2(v.y, min, max);
            let z:number = MathUtils.interpolate2(v.z, min, max);
            return new Vec3f(x, y, z);
        } else {
            return MathUtils.interpolate2(<number>f, min, max);
        }
    }

    static interpolate2(f:number, min:number, max:number):number {
        return min + (max - min) * MathUtils.clamp2(f, 0.0, 1.0);
    }

    static smoothstep2(f:number, min:number, max:number):number {
        return MathUtils.clamp2((f - min) / (max - min), 0.0, 1.0);
    }

    static smoothstep(f:Vec3f|number, min:number, max:number):number|Vec3f {
        if (f instanceof Vec3f) {

            let v:Vec3f = f;
            let x:number = MathUtils.smoothstep2(v.x, min, max);
            let y:number = MathUtils.smoothstep2(v.y, min, max);
            let z:number = MathUtils.smoothstep2(v.z, min, max);
            return new Vec3f(x, y, z);
        } else {
            return MathUtils.smoothstep2(<number>f, min, max);
        }
    }

    static mix(v1:number, v2:number, a:number):number {
        return v1 + (v2 - v1) * a;
    }
}
