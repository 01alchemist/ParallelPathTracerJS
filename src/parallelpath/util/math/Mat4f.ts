import {Vec3f} from "./Vec3f";
import {Quaternion} from "./Quaternion";
import {MathUtils} from "./MathUtils";
/**
 * Created by r3f on 7/1/2016.
 */
export class Mat4f{

    // Matrix row & column values as in i,j
    m:any;

    /*
     * Constructor Mat4f()
     * @info: Rows and columns are 0 by default
     */
    constructor()
    {
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                this.m = [i][j] = 0;
            }
        }

    }

    initIdentity()
    {
        this.m[0][0] = 1;		this.m[0][1] = 0;		this.m[0][2] = 0;		this.m[0][3] = 0;
        this.m[1][0] = 0;		this.m[1][1] = 1;		this.m[1][2] = 0;		this.m[1][3] = 0;
        this.m[2][0] = 0;		this.m[2][1] = 0;		this.m[2][2] = 1;		this.m[2][3] = 0;
        this.m[3][0] = 0;		this.m[3][1] = 0;		this.m[3][2] = 0;		this.m[3][3] = 1;
    }

    initTranslation(x, y, z)
    {
        this.m[0][0] = 1;		this.m[0][1] = 0;		this.m[0][2] = 0;		this.m[0][3] = x;
        this.m[1][0] = 0;		this.m[1][1] = 1;		this.m[1][2] = 0;		this.m[1][3] = y;
        this.m[2][0] = 0;		this.m[2][1] = 0;		this.m[2][2] = 1;		this.m[2][3] = z;
        this.m[3][0] = 0;		this.m[3][1] = 0;		this.m[3][2] = 0;		this.m[3][3] = 1;
    }

    initScale(x, y, z)
    {
        this.m[0][0] = x;		this.m[0][1] = 0;		this.m[0][2] = 0;		this.m[0][3] = 0;
        this.m[1][0] = 0;		this.m[1][1] = y;		this.m[1][2] = 0;		this.m[1][3] = 0;
        this.m[2][0] = 0;		this.m[2][1] = 0;		this.m[2][2] = z;		this.m[2][3] = 0;
        this.m[3][0] = 0;		this.m[3][1] = 0;		this.m[3][2] = 0;		this.m[3][3] = 1;
    }

    initRotationWithQuaternion(q:Quaternion)
    {
        var f:Vec3f = q.getForwardVector();
        var u:Vec3f = q.getUpVector();
        var r:Vec3f = q.getRightVector();

        this.m[0][0] = r.x;		this.m[0][1] = r.y;		this.m[0][2] = r.z;		this.m[0][3] = 0;
        this.m[1][0] = u.x;		this.m[1][1] = u.y;		this.m[1][2] = u.z;		this.m[1][3] = 0;
        this.m[2][0] = f.x;		this.m[2][1] = f.y;		this.m[2][2] = f.z;		this.m[2][3] = 0;
        this.m[3][0] = 0;		this.m[3][1] = 0;		this.m[3][2] = 0;		this.m[3][3] = 1;
    }

    /*
     * Ugly euler angles, I hate them.
     * Luckily all my rotations are now using Quaternions, which are beautiful and elegant.
     */
    initRotation(x, y, z)
    {
        var Mx:Mat4f = new Mat4f();
        var My:Mat4f = new Mat4f();
        var Mz:Mat4f = new Mat4f();

        Mx.initIdentity();
        My.initIdentity();
        Mz.initIdentity();

        Mx.m[1][1] = Math.cos(MathUtils.toRadians(x));
        Mx.m[1][2] = Math.sin(MathUtils.toRadians(x));
        Mx.m[2][1] = -Math.sin(MathUtils.toRadians(x));
        Mx.m[2][2] = Math.cos(MathUtils.toRadians(x));

        My.m[0][0] = Math.cos(MathUtils.toRadians(y));
        My.m[0][2] = -Math.sin(MathUtils.toRadians(y));
        My.m[2][0] = Math.sin(MathUtils.toRadians(y));
        My.m[2][2] = Math.cos(MathUtils.toRadians(y));

        Mz.m[0][0] = Math.cos(MathUtils.toRadians(z));
        Mz.m[0][1] = Math.sin(MathUtils.toRadians(z));
        Mz.m[1][0] = -Math.sin(MathUtils.toRadians(z));
        Mz.m[1][1] = Math.cos(MathUtils.toRadians(z));

        this.m = Mat4f.mulMatrix(Mz, Mat4f.mulMatrix(My, Mx)).getM();
    }

    static mulMatrix(left:Mat4f, right:Mat4f):Mat4f
    {
        var data:Mat4f = new Mat4f();

        for (var i = 0; i < 4; i++)
        {
            for (var j = 0; j < 4; j++)
            {
                data.m[i][j] = left.m[i][0] * right.m[0][j] +
                    left.m[i][1] * right.m[1][j] +
                    left.m[i][2] * right.m[2][j] +
                    left.m[i][3] * right.m[3][j];
            }
        }

        return data;
    }

    static mulVec(left:Mat4f, right:Vec3f, w):Vec3f
    {
        var result:Vec3f = new Vec3f();

        for (var i = 0; i < 4; i++)
        {
            var value = 0.0;
            for (var j = 0; j < 4; j++)
            {
                value += left.m[i][j] * right.getComponent(j, w);
            }
            result.setComponent(i, value);
        }

        return result;
    }

    getM()
    {
        var data = [];

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                data[i][j] = this.m[i][j];
            }
        }

        return data;
    }
}