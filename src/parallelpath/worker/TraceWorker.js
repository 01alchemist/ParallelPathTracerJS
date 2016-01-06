System.register(["../gfx/gfx", "../util/util", "../shader/Shader", "../util/math/Plane", "../util/math/Sphere", "../gfx/Camera", "../gfx/Material"], function(exports_1) {
    var gfx_1, util_1, Shader_1, Plane_1, Sphere_1, Camera_1, Material_1;
    var TraceWorker;
    return {
        setters:[
            function (gfx_1_1) {
                gfx_1 = gfx_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Shader_1_1) {
                Shader_1 = Shader_1_1;
            },
            function (Plane_1_1) {
                Plane_1 = Plane_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Material_1_1) {
                Material_1 = Material_1_1;
            }],
        execute: function() {
            TraceWorker = (function () {
                function TraceWorker() {
                    var self = this;
                    addEventListener('message', function (e) {
                        if (self.command == null) {
                            self.command = e.data;
                        }
                        else if (self.command == TraceWorker.INIT) {
                            self.command = null;
                            self.pixelMemory = new Uint8ClampedArray(e.data.pixelMemory);
                            postMessage(TraceWorker.INITED);
                            self.id = e.data.id;
                            self.tracer = e.data.tracer;
                            self.tracer.camera = Camera_1.Camera.cast(self.tracer.camera);
                            self.tracer.scene.objects.forEach(function (obj) {
                                obj.primitives.forEach(function (primitive, index) {
                                    primitive = primitive.type == "plane" ? Plane_1.Plane.cast(primitive) : Sphere_1.Sphere.cast(primitive);
                                    obj.primitives[index] = primitive;
                                });
                                obj.material = Material_1.Material.cast(obj.material);
                            });
                            self.tracer.scene.lights.forEach(function (light, index) {
                                self.tracer.scene.lights[index] = gfx_1.Light.cast(light);
                            });
                            self.window_width = e.data.window_width;
                            self.window_height = e.data.window_height;
                            self.init(e.data.width, e.data.height, e.data.xoffset, e.data.yoffset, e.data.id);
                        }
                        else if (self.command == TraceWorker.TRACE) {
                            self.command = null;
                            self.ar = e.data.ar;
                            self.tracer.camera.rot.setFromQuaternion(e.data.rot);
                            self.tracer.camera.pos.setVec(e.data.pos);
                            self.run();
                            postMessage(TraceWorker.TRACED);
                        }
                    }, false);
                }
                TraceWorker.prototype.init = function (width, height, xoffset, yoffset, id) {
                    this.width = width;
                    this.height = height;
                    this.xoffset = xoffset;
                    this.yoffset = yoffset;
                    this.id = id;
                    this.finished = true;
                    this.samples = new Uint8ClampedArray(width * height * 3);
                    this.samples_taken = 1;
                };
                TraceWorker.prototype.run = function () {
                    this.finished = false;
                    if (this.tracer != null) {
                        var ray_primary = new util_1.Ray();
                        for (var y = this.yoffset; y < this.yoffset + this.height; y++) {
                            for (var x = this.xoffset; x < this.xoffset + this.width; x++) {
                                var _x = x - this.xoffset;
                                var _y = y - this.yoffset;
                                var index = ((_y * (this.width * 3)) + (_x * 3));
                                var color;
                                if (util_1.Config.ss_enabled) {
                                    var sample = Shader_1.Shader.COLOR_NULL;
                                    for (var i = 0; i < util_1.Config.ss_amount; i++) {
                                        var ray = util_1.Ray.calcSupersampledCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y, util_1.Config.ss_jitter);
                                        sample = sample.add(TraceWorker.pathTrace(ray, this.tracer.scene, 0, 1.0));
                                    }
                                    var sample_averaged = sample.divideNumber(util_1.Config.ss_amount);
                                    color = sample_averaged;
                                    color.x = this.samples[index] = this.samples[index] + sample_averaged.x;
                                    color.y = this.samples[index + 1] = this.samples[index] + sample_averaged.y;
                                    color.z = this.samples[index + 2] = this.samples[index] + sample_averaged.z;
                                }
                                else {
                                    ray_primary = util_1.Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);
                                    color = TraceWorker.pathTrace(ray_primary, this.tracer.scene, 0, 1.0);
                                    color.x = this.samples[index] = this.samples[index] + color.x;
                                    color.y = this.samples[index + 1] = this.samples[index] + color.y;
                                    color.z = this.samples[index + 2] = this.samples[index] + color.z;
                                }
                                var screen_index = ((y * (this.window_width * 3)) + (x * 3));
                                this.drawPixelVec3fAveraged(screen_index, color, this.samples_taken);
                                if (util_1.Config.debug && x == this.xoffset || util_1.Config.debug && y == this.yoffset) {
                                    this.drawPixelInt(screen_index, 0xFFFF00F);
                                }
                            }
                        }
                    }
                    this.samples_taken++;
                    this.finished = true;
                };
                TraceWorker.prototype.drawPixelVec3fAveraged = function (index, color, factor) {
                    var average = util_1.MathUtils.clamp(color.divideNumber(factor), 0.0, 1.0);
                    var red = (average.x * 255.0);
                    var green = (average.y * 255.0);
                    var blue = (average.z * 255.0);
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                };
                TraceWorker.prototype.drawPixelVec3f = function (x, y, color) {
                    color = util_1.MathUtils.smoothstep(util_1.MathUtils.clamp(color, 0.0, 1.0), 0.0, 1.0);
                    var index = ((y * (this.window_width * 3)) + (x * 3));
                    var red = (color.x * 255.0);
                    var green = (color.y * 255.0);
                    var blue = (color.z * 255.0);
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                    this.pixelMemory[index + 3] = 255;
                };
                TraceWorker.prototype.drawPixelInt = function (index, color) {
                    var red = (color >> 16) & 255;
                    var green = (color >> 8) & 255;
                    var blue = color & 255;
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                };
                TraceWorker.pathTrace = function (ray, scene, n, weight) {
                    if (n > util_1.Config.recursion_max) {
                        return Shader_1.Shader.COLOR_WHITE;
                    }
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    scene.objects.forEach(function (obj) {
                        obj.primitives.forEach(function (primitive) {
                            xInit = primitive.intersect(ray);
                            if (xInit != null && xInit.getT() < tInit) {
                                xFinal = xInit;
                                tInit = xFinal.getT();
                                xObject = obj;
                            }
                        });
                    });
                    if (xFinal == null)
                        return Shader_1.Shader.COLOR_RED;
                    if (xObject.material.emittance.length() > 0.0 && xFinal.getT() > util_1.Config.epsilon) {
                        return xObject.material.emittance.scaleNumber(weight);
                    }
                    var M = xObject.material;
                    var P = xFinal.pos;
                    var N = xFinal.norm;
                    var RO = ray.pos;
                    var RD = ray.dir;
                    var color = new util_1.Vec3f();
                    var Kd = M.reflectance.length();
                    var Ks = M.reflectivity;
                    var Pp = Kd / (Kd + Ks);
                    var Pr = Math.random();
                    if (M.refractivity > 0.0) {
                        weight *= M.refractivity;
                        var NdotI = RD.dot(N), IOR, n1, n2, fresnel;
                        var refractedRay;
                        if (NdotI > 0.0) {
                            n1 = ray.ior;
                            n2 = M.ior;
                            N = N.negate();
                        }
                        else {
                            n1 = M.ior;
                            n2 = ray.ior;
                            NdotI = -NdotI;
                        }
                        IOR = n2 / n1;
                        var cos_t = IOR * IOR * (1.0 - NdotI * NdotI);
                        cos_t = Math.sqrt(1.0 - cos_t);
                        fresnel = (Math.sqrt((n1 * NdotI - n2 * cos_t) / (n1 * NdotI + n2 * cos_t)) + Math.sqrt((n2 * NdotI - n1 * cos_t) / (n2 * NdotI + n1 * cos_t))) * 0.5;
                        if (Math.random() <= fresnel) {
                            refractedRay = new util_1.Ray(P, RD.reflect(N).normalize());
                        }
                        else {
                            refractedRay = new util_1.Ray(P, RD.refract(N, IOR, NdotI, cos_t).normalize());
                        }
                        color = color.add(TraceWorker.pathTrace(refractedRay, scene, n + 1, weight));
                    }
                    if (Pr < Pp && Kd + Ks != 0.0) {
                        if (M.reflectance.length() > 0.0) {
                            var randomRay = new util_1.Ray(P, N.randomHemisphere());
                            var NdotRD = Math.abs(N.dot(randomRay.dir));
                            var BRDF = M.reflectance.scaleNumber((1.0 / Math.PI) * 2.0 * NdotRD);
                            var REFLECTED = TraceWorker.pathTrace(randomRay, scene, n + 1, weight);
                            color = color.add(BRDF.scale(REFLECTED));
                        }
                    }
                    else {
                        if (M.reflectivity > 0.0) {
                            weight *= M.reflectivity;
                            var reflectedRay = new util_1.Ray(P, RD.reflect(N).normalize());
                            color = color.add(TraceWorker.pathTrace(reflectedRay, scene, n + 1, weight));
                        }
                    }
                    return color;
                };
                TraceWorker.prototype.getWidth = function () {
                    return this.width;
                };
                TraceWorker.prototype.getHeight = function () {
                    return this.height;
                };
                TraceWorker.prototype.getXOffset = function () {
                    return this.xoffset;
                };
                TraceWorker.prototype.getYOffset = function () {
                    return this.yoffset;
                };
                TraceWorker.prototype.getId = function () {
                    return this.id;
                };
                TraceWorker.prototype.isFinished = function () {
                    return this.finished;
                };
                TraceWorker.INIT = "INIT";
                TraceWorker.INITED = "INITED";
                TraceWorker.TRACE = "TRACE";
                TraceWorker.TRACED = "TRACED";
                return TraceWorker;
            })();
            exports_1("TraceWorker", TraceWorker);
            new TraceWorker();
        }
    }
});
//# sourceMappingURL=TraceWorker.js.map