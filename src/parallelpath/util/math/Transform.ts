import {Vec3f} from "./Vec3f";
import {Quaternion} from "./Quaternion";
import {Mat4f} from "./Mat4f";
/**
 * Created by r3f on 7/1/2016.
 */
export class Transform {

    position:Vec3f;
    rotation:Quaternion;
    scale:Vec3f;

    constructor(position?:Vec3f, rotation?:Quaternion, scale?:Vec3f) {
        this.position = position || new Vec3f(0.0);
        this.rotation = rotation || new Quaternion().initIdentity();
        this.scale = scale || new Vec3f(1.0);
    }

    /*getTransformation():Mat4f {
        var translationMatrix:Mat4f = new Mat4f();
        var rotationMatrix:Mat4f = new Mat4f();
        var scaleMatrix:Mat4f = new Mat4f();

        translationMatrix.initTranslation(this.position.x, this.position.y, this.position.z);
        rotationMatrix.initRotationWithQuaternion(this.rotation);
        scaleMatrix.initScale(this.scale.x, this.scale.y, this.scale.z);

        return Mat4f.mulMatrix(translationMatrix, Mat4f.mulMatrix(rotationMatrix, scaleMatrix));
    }*/

    getPos():Vec3f {
        return this.position;
    }

    getRot():Quaternion {
        return this.rotation;
    }

    getScale():Vec3f {
        return this.scale;
    }
}