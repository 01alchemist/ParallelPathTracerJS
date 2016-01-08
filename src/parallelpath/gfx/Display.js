System.register([], function(exports_1) {
    var Display;
    return {
        setters:[],
        execute: function() {
            Display = (function () {
                function Display(width, height, scale, title) {
                    this.paused = true;
                    this.title = title;
                    this.width = width;
                    this.height = height;
                    this.scale = scale;
                }
                Display.prototype.create = function (pixels) {
                    this.toggle = document.getElementById("toggle");
                    var self = this;
                    this.toggle.onclick = function () {
                        self.paused = !self.paused;
                        self.toggle.innerText = self.paused ? "start" : "stop";
                    };
                    this.info = document.getElementById("info");
                    this.canvas = document.getElementById("viewport");
                    this.canvas.width = this.width;
                    this.canvas.height = this.height;
                    this.ctx = this.canvas.getContext("2d");
                    if (this.image == null) {
                        this.image = new ImageData(this.width, this.height);
                        this.pixels = this.image.data;
                        this.clear();
                    }
                    this.ctx.putImageData(this.image, 0, 0);
                };
                Display.prototype.render = function (_pixels, iteration) {
                    this.ctx.clearRect(0, 0, this.image.width, this.image.height);
                    for (var y = 0; y < this.image.height; y++) {
                        for (var x = 0; x < this.image.width; x++) {
                            var index = ((y * (this.image.width * 3)) + (x * 3));
                            var i = ((y * (this.image.width * 4)) + (x * 4));
                            this.pixels[i] = _pixels[index];
                            this.pixels[i + 1] = _pixels[index + 1];
                            this.pixels[i + 2] = _pixels[index + 2];
                            this.pixels[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.image, 0, 0);
                };
                Display.prototype.clear = function () {
                };
                Display.prototype.getWidth = function () {
                    return this.width;
                };
                Display.prototype.getHeight = function () {
                    return this.height;
                };
                Display.prototype.getPixels = function () {
                    return this.pixels;
                };
                Display.prototype.getImage = function () {
                    return this.image;
                };
                Display.prototype.getDimension = function () {
                    return this.dimension;
                };
                Display.prototype.get2dContex = function () {
                    return this.ctx;
                };
                Display.prototype.getAR = function () {
                    return this.width / this.height;
                };
                Display.prototype.getScale = function () {
                    return this.scale;
                };
                Display.prototype.setTitle = function (title) {
                    this.info.innerHTML = this.title + " | " + title;
                };
                Display.prototype.setWidth = function (width) {
                    this.width = width;
                };
                Display.prototype.setHeight = function (height) {
                    this.height = height;
                };
                Display.prototype.setPixels = function (pixels) {
                    this.pixels = pixels;
                };
                Display.prototype.setImage = function (image) {
                    this.image = image;
                };
                Display.prototype.setDimension = function (dimension) {
                    this.dimension = dimension;
                };
                Display.prototype.setScale = function (scale) {
                    this.scale = scale;
                };
                Display.serialVersionUID = 1;
                return Display;
            })();
            exports_1("Display", Display);
        }
    }
});
//# sourceMappingURL=Display.js.map