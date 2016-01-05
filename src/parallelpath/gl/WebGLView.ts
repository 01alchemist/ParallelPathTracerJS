/**
 * Created by r3f on 5/1/2016.
 */
export class WebGLView {

    gl;

    shaders = {

        vertex: [
            "attribute vec2 a_position;",

            "void main() {",
                "gl_Position = vec4(a_position, 0, 1);",
            "}"
        ].join("\n"),

        fragment: [
            "precision mediump float;",
            "uniform sampler2D u_image;",

            "varying vec2 v_texCoord;",

            "void main() {",
            "gl_FragColor = texture2D(u_image, v_texCoord);",
            "}"
        ].join("\n")
    };

    constructor(canvas) {
        this.init(canvas);
    }

    private init(canvas):void {
        this.gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");

        if (this.gl) {
            var program = this.createProgram();
            this.gl.useProgram(program);
            var positionLocation = this.gl.getAttribLocation(program, "a_position");

            // Create a buffer and put a single clipspace rectangle in
            // it (2 triangles)
            var buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array([
                    -1.0, -1.0,
                    1.0, -1.0,
                    -1.0, 1.0,
                    -1.0, 1.0,
                    1.0, -1.0,
                    1.0, 1.0]),
                this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

            // draw
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        }
    }
    createProgram(){
        var program = this.gl.createProgram();
        var vertex = this.createShader(this.gl.VERTEX_SHADER, this.shaders.vertex);
        var fragment = this.createShader(this.gl.FRAGMENT_SHADER, this.shaders.vertex);
        this.gl.attachShader(program, vertex);
        this.gl.attachShader(program, fragment);
        this.gl.linkProgram(program);
        var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (!linked) {
            // something went wrong with the link
            var lastError = this.gl.getProgramInfoLog(program);
            console.error("Error in program linking:" + lastError);

            this.gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    createShader(shaderType, shaderSource){

        var shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            var lastError = this.gl.getShaderInfoLog(shader);
            console.error("*** Error compiling shader '" + shader + "':" + lastError);
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}