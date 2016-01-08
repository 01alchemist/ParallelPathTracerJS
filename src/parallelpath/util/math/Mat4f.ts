import {Vec3f} from "./Vec3f";
import {Quaternion} from "./Quaternion";
import {MathUtils} from "./MathUtils";
import {Vec4f} from "./Vec4f";
/**
 * Created by r3f on 7/1/2016.
 */
export class Mat4f{

    // Matrix row & column values as in i,j
    m:Float32Array;

    /*
     * Constructor Mat4f()
     * @info: Rows and columns are 0 by default
     */
    constructor(m?:Float32Array)
    {
        this.m = m?m:new Float32Array(16);
    }
    identity(overwrite:boolean=false):Mat4f {
        if (!overwrite) {
            var mat = new Mat4f()
            mat.m[0] = 1;
            mat.m[1] = 0;
            mat.m[2] = 0;
            mat.m[3] = 0;
            mat.m[4] = 0;
            mat.m[5] = 1;
            mat.m[6] = 0;
            mat.m[7] = 0;
            mat.m[8] = 0;
            mat.m[9] = 0;
            mat.m[10] = 1;
            mat.m[11] = 0;
            mat.m[12] = 0;
            mat.m[13] = 0;
            mat.m[14] = 0;
            mat.m[15] = 1;
            return mat;
        }
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
    }
    transpose(overwrite:boolean=false):Mat4f {
        if (!overwrite) {
            var mat = new Mat4f();
            var a01 = this.m[1], a02 = this.m[2], a03 = this.m[3],
                a12 = this.m[6], a13 = this.m[7],
                a23 = this.m[11];

            mat.m[1] = mat[4];
            mat.m[2] = mat[8];
            mat.m[3] = mat[12];
            mat.m[4] = a01;
            mat.m[6] = mat[9];
            mat.m[7] = mat[13];
            mat.m[8] = a02;
            mat.m[9] = a12;
            mat.m[11] = mat[14];
            mat.m[12] = a03;
            mat.m[13] = a13;
            mat.m[14] = a23;
            return mat;
        }

        this.m[0] = this.m[0];
        this.m[1] = this.m[4];
        this.m[2] = this.m[8];
        this.m[3] = this.m[12];
        this.m[4] = this.m[1];
        this.m[5] = this.m[5];
        this.m[6] = this.m[9];
        this.m[7] = this.m[13];
        this.m[8] = this.m[2];
        this.m[9] = this.m[6];
        this.m[10] = this.m[10];
        this.m[11] = this.m[14];
        this.m[12] = this.m[3];
        this.m[13] = this.m[7];
        this.m[14] = this.m[11];
        this.m[15] = this.m[15];
        return this;
    }
    determinant():number {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = this.m[0], a01 = this.m[1], a02 = this.m[2], a03 = this.m[3],
            a10 = this.m[4], a11 = this.m[5], a12 = this.m[6], a13 = this.m[7],
            a20 = this.m[8], a21 = this.m[9], a22 = this.m[10], a23 = this.m[11],
            a30 = this.m[12], a31 = this.m[13], a32 = this.m[14], a33 = this.m[15];

        return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
        a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
        a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
        a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
        a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
        a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
    }

    inverse(overwrite:boolean=false) {

        var mat = this.m;

        if(overwrite){
            var dest:Mat4f = this;
        }else{

            var dest = new Mat4f();
        }

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
            invDet;

        // Calculate the determinant
        if (!d) { return null; }
        invDet = 1 / d;

        dest.m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        dest.m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        dest.m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        dest.m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        dest.m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
        dest.m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        dest.m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        dest.m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        dest.m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        dest.m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        dest.m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        dest.m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        dest.m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        dest.m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        dest.m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        dest.m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;


        return dest;
    }

    toRotationMat() {

        var dest:Mat4f = new Mat4f();
        dest.m[0] = this.m[0];
        dest.m[1] = this.m[1];
        dest.m[2] = this.m[2];
        dest.m[3] = this.m[3];
        dest.m[4] = this.m[4];
        dest.m[5] = this.m[5];
        dest.m[6] = this.m[6];
        dest.m[7] = this.m[7];
        dest.m[8] = this.m[8];
        dest.m[9] = this.m[9];
        dest.m[10] = this.m[10];
        dest.m[11] = this.m[11];
        dest.m[12] = 0;
        dest.m[13] = 0;
        dest.m[14] = 0;
        dest.m[15] = 1;

        return dest;
    }
    frustum(left, right, bottom, top, near, far, overwrite:boolean=false) {
        if(overwrite){
            var dest:Mat4f = this;
        }else{
            dest = new Mat4f();
        }
        var rl = (right - left),
            tb = (top - bottom),
            fn = (far - near);
        dest.m[0] = (near * 2) / rl;
        dest.m[1] = 0;
        dest.m[2] = 0;
        dest.m[3] = 0;
        dest.m[4] = 0;
        dest.m[5] = (near * 2) / tb;
        dest.m[6] = 0;
        dest.m[7] = 0;
        dest.m[8] = (right + left) / rl;
        dest.m[9] = (top + bottom) / tb;
        dest.m[10] = -(far + near) / fn;
        dest.m[11] = -1;
        dest.m[12] = 0;
        dest.m[13] = 0;
        dest.m[14] = -(far * near * 2) / fn;
        dest.m[15] = 0;
        return dest;
    }
    perspective(fovy, aspect, near, far, overwrite:boolean=false) {
        var top = near * Math.tan(fovy * Math.PI / 360.0),
            right = top * aspect;
        return this.frustum(-right, right, -top, top, near, far, overwrite);
    }
    lookAt(eye, center, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            centerx = center[0],
            centery = center[1],
            centerz = center[2];

        if (eyex === centerx && eyey === centery && eyez === centerz) {
            return this.identity(true);
        }

        //vec3.direction(eye, center, z);
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        // normalize (no check needed for 0 because of early return)
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        //vec3.normalize(vec3.cross(up, z, x));
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        //vec3.normalize(vec3.cross(z, x, y));
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        this.m[0] = x0;
        this.m[1] = y0;
        this.m[2] = z0;
        this.m[3] = 0;
        this.m[4] = x1;
        this.m[5] = y1;
        this.m[6] = z1;
        this.m[7] = 0;
        this.m[8] = x2;
        this.m[9] = y2;
        this.m[10] = z2;
        this.m[11] = 0;
        this.m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        this.m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        this.m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        this.m[15] = 1;

        return this;
    }

    multiply(mat2) {

        var dest = new Mat4f();
        var mat = this.m;

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[ 0], a01 = mat[ 1], a02 = mat[ 2], a03 = mat[3];
        var a10 = mat[ 4], a11 = mat[ 5], a12 = mat[ 6], a13 = mat[7];
        var a20 = mat[ 8], a21 = mat[ 9], a22 = mat[10], a23 = mat[11];
        var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        // Cache only the current line of the second matrix
        var b0  = mat2.m[0], b1 = mat2.m[1], b2 = mat2.m[2], b3 = mat2.m[3];
        dest.m[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        dest.m[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        dest.m[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        dest.m[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = mat2.m[4];
        b1 = mat2.m[5];
        b2 = mat2.m[6];
        b3 = mat2.m[7];
        dest.m[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        dest.m[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        dest.m[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        dest.m[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = mat2.m[8];
        b1 = mat2.m[9];
        b2 = mat2.m[10];
        b3 = mat2.m[11];
        dest.m[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        dest.m[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        dest.m[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        dest.m[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = mat2.m[12];
        b1 = mat2.m[13];
        b2 = mat2.m[14];
        b3 = mat2.m[15];
        dest.m[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        dest.m[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        dest.m[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        dest.m[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        return dest;
    }

    multiplyVec4(vec) {

        var dest = new Vec4f();
        var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

        dest.x = this.m[0] * x + this.m[4] * y + this.m[8] * z + this.m[12] * w;
        dest.y = this.m[1] * x + this.m[5] * y + this.m[9] * z + this.m[13] * w;
        dest.z = this.m[2] * x + this.m[6] * y + this.m[10] * z + this.m[14] * w;
        dest.w = this.m[3] * x + this.m[7] * y + this.m[11] * z + this.m[15] * w;

        return dest;
    }
}