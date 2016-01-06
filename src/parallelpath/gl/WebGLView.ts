/**
 * Created by r3f on 5/1/2016.
 */
export class WebGLView {

    gl;

    shaders = {

        vertex: [
            "attribute vec2 a_position;",
            "attribute vec2 a_texCoord;",

            "varying vec2 v_texCoord;",

            "void main() {",
            "gl_Position = vec4(a_position, 0, 1);",
            "v_texCoord = a_texCoord;",
            "}"
        ].join("\n"),

        fragment: [
            "precision mediump float;",
            "uniform sampler2D u_image;",

            "varying vec2 v_texCoord;",

            "void main() {",
            "gl_FragColor = texture2D(u_image, v_texCoord);",
            //"gl_FragColor = vec4(0, 1, 0, 1);",
            "}"
        ].join("\n")
    };

    constructor(canvas, pixels:Uint8Array) {
        this.init(canvas, pixels);
    }

    private init(canvas, pixels:Uint8Array):void {
        this.gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
        var gl = this.gl;
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

            var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

            // provide texture coordinates for the rectangle.
            var texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                1.0, 1.0]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

            // Create a texture.
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            //pixels = new Uint8Array(640 * 360 * 3);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, pixels);
            this.render();
        }
    }

    setRectangle(x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), this.gl.STATIC_DRAW);
    }

    render(/*pixels:Uint8Array*/) {
        // draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    createProgram() {
        var program = this.gl.createProgram();
        var vertex = this.createShader(this.gl.VERTEX_SHADER, this.shaders.vertex);
        var fragment = this.createShader(this.gl.FRAGMENT_SHADER, this.shaders.fragment);
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

    createShader(shaderType, shaderSource) {

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