export class Vec2f {

    x:number;
    y:number;

    constructor(x?:number, y?:number) {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
    }
    toString():string {
        return "Vec2f[" + this.x + "," + this.y + "]";
    }

    equals(v:Vec2f):boolean {
        return (this.x == v.x && this.y == v.y);
    }

    set(x:number, y?:number):Vec2f {
        this.x = x = x == undefined ? 0 : x;
        this.y = y == undefined ? x : y;
        return this;
    }

    setVec(v:Vec2f):Vec2f {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v:Vec2f):Vec2f {
        return new Vec2f(this.x + v.x, this.y + v.y);
    }

    addNumber(f:number):Vec2f {
        return new Vec2f(this.x + f, this.y + f);
    }

    sub(v:Vec2f):Vec2f {
        return new Vec2f(this.x - v.x, this.y - v.y);
    }

    subNumber(f:number):Vec2f {
        return new Vec2f(this.x - f, this.y - f);
    }

    scale(v:Vec2f):Vec2f {
        return new Vec2f(this.x * v.x, this.y * v.y);
    }

    scaleNumber(f:number):Vec2f {
        return new Vec2f(this.x * f, this.y * f);
    }

    divide(v:Vec2f):Vec2f {
        return new Vec2f(this.x / v.x, this.y / v.y);
    }

    divideNumber(f:number):Vec2f {
        return new Vec2f(this.x / f, this.y / f);
    }

    cross(v:Vec2f):number {
        return this.x * v.y - this.y * v.x;
    }

    dot(v:Vec2f):number {
        return this.x * v.x + this.y * v.y;
    }

    length():number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize():Vec2f {
        let length:number = this.length();
        return new Vec2f(this.x / length, this.y / length);
    }

    negate():Vec2f {
        return new Vec2f(-this.x, -this.y);
    }

}