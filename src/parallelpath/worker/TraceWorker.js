System.register(["../gfx/gfx", "../util/util", "../shader/Shader", "../util/math/Plane", "../util/math/Sphere", "../gfx/Camera", "../gfx/Material", "../util/math/Vec2f", "../util/math/Mat4f"], function(exports_1) {
    var gfx_1, util_1, Shader_1, Plane_1, Sphere_1, Camera_1, Material_1, Vec2f_1, Mat4f_1;
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
            },
            function (Vec2f_1_1) {
                Vec2f_1 = Vec2f_1_1;
            },
            function (Mat4f_1_1) {
                Mat4f_1 = Mat4f_1_1;
            }],
        execute: function() {
            TraceWorker = (function () {
                function TraceWorker() {
                    this.time = 1;
                    this.samples_taken = 1;
                    this.SSAA = 0;
                    console.log("v2");
                    this.eye = new util_1.Vec3f();
                    this.center = new util_1.Vec3f();
                    this.invMP = new Mat4f_1.Mat4f();
                    this.r1_scale = new util_1.Vec3f(12.9898, 78.233, 151.7182);
                    this.r2_scale = new util_1.Vec3f(63.7264, 10.873, 623.6736);
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
                            self.eye.setVec(e.data.eye);
                            self.center.setVec(e.data.center);
                            self.invMP.m = e.data.invMP;
                            self.iterations = e.data.iterations;
                            if (self.iterations == 0) {
                                self.clear();
                            }
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
                    console.log("inited");
                };
                TraceWorker.prototype.clear = function () {
                    this.samples = new Uint8ClampedArray(this.width * this.height * 3);
                    this.samples_taken = 1;
                    console.log("cleared");
                };
                TraceWorker.prototype.run = function () {
                    this.finished = false;
                    if (this.tracer != null) {
                        var ray_primary;
                        var depth = util_1.Config.ss_amount;
                        var w = this.width;
                        var h = this.height;
                        var i = 0;
                        var color;
                        for (var y = this.yoffset; y < this.yoffset + this.height; y++) {
                            for (var x = this.xoffset; x < this.xoffset + this.width; x++) {
                                var InitRay = new util_1.Vec3f();
                                var r = util_1.Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);
                                InitRay = r.dir;
                                TraceWorker.initRay = InitRay;
                                var t = (0.0 - this.eye.z) / r.dir.z;
                                var InitPixel = r.origin.add(r.dir.scaleNumber(t));
                                var r1 = Math.sin(TraceWorker.getrandom(r.dir.scale(this.r1_scale), this.time));
                                var r2 = Math.cos(TraceWorker.getrandom(r.dir.scale(this.r2_scale), this.time + 1.0));
                                if (this.SSAA > 0) {
                                    var u = r1 / 2.0 / this.width;
                                    var v = r2 / 2.0 / this.height;
                                    InitPixel.x += u;
                                    InitPixel.y += v;
                                    InitPixel.z += 0;
                                    r.dir = InitPixel.sub(this.eye).normalize();
                                }
                                r.ior = 1.0;
                                var finalCol = new util_1.Vec3f(0.0);
                                this.pathTrace(r, 1, finalCol);
                                var _x = x - this.xoffset;
                                var _y = y - this.yoffset;
                                var index = ((_y * (w * 3)) + (_x * 3));
                                this.samples[index] += finalCol.x;
                                this.samples[index + 1] += finalCol.y;
                                this.samples[index + 2] += finalCol.z;
                                finalCol.x = util_1.MathUtils.mix(finalCol.x / 5.0, this.samples[index], this.iterations / (1.0 + this.iterations));
                                finalCol.y = util_1.MathUtils.mix(finalCol.y / 5.0, this.samples[index + 1], this.iterations / (1.0 + this.iterations));
                                finalCol.z = util_1.MathUtils.mix(finalCol.z / 5.0, this.samples[index + 2], this.iterations / (1.0 + this.iterations));
                                finalCol.x = this.samples[index] / this.iterations;
                                finalCol.y = this.samples[index + 1] / this.iterations;
                                finalCol.z = this.samples[index + 2] / this.iterations;
                                var screen_index = ((y * (this.window_width * 3)) + (x * 3));
                                this.drawPixelVec3f(screen_index, finalCol);
                                this.samples_taken++;
                                if (util_1.Config.debug && x == this.xoffset || util_1.Config.debug && y == this.yoffset) {
                                    this.drawPixelInt(screen_index, 0xFFFF00F);
                                }
                            }
                        }
                    }
                    this.iterations++;
                    this.time++;
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
                TraceWorker.prototype.drawPixelVec3f = function (index, color) {
                    var red = (color.x * 255.0);
                    var green = (color.y * 255.0);
                    var blue = (color.z * 255.0);
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                };
                TraceWorker.prototype.drawPixelInt = function (index, color) {
                    var red = (color >> 16) & 255;
                    var green = (color >> 8) & 255;
                    var blue = color & 255;
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                };
                TraceWorker.prototype.pathTrace = function (ray, rayDepth, color) {
                    var colorMask = new util_1.Vec3f(1);
                    var incidentIOR = 1.0;
                    var transmittedIOR = 1.0;
                    var internalReflection = false;
                    var reflective = false;
                    var refractive = false;
                    var shift = 0.01;
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    var depth = 5;
                    for (var i = 0; i < depth; i++) {
                        xFinal = null;
                        var seed = this.time + i;
                        this.tracer.scene.objects.forEach(function (obj) {
                            obj.primitives.forEach(function (primitive) {
                                xInit = primitive.intersect(ray);
                                if (xInit != null && xInit.getT() < tInit) {
                                    xFinal = xInit;
                                    tInit = xFinal.getT();
                                    xObject = obj;
                                }
                            });
                        });
                        if (xFinal == null) {
                            color.setVec(Shader_1.Shader.COLOR_NULL);
                            return color;
                        }
                        if (xObject.material.emittance.length() > 0.0) {
                            color.setVec(xObject.material.emittance);
                            return color;
                        }
                        var material = xObject.material;
                        var P = xFinal.pos;
                        var N = xFinal.norm;
                        var RO = ray.origin;
                        var RD = ray.dir;
                        var Kd = material.reflectance.length();
                        var Ks = material.reflectivity;
                        var Pp = Kd / (Kd + Ks);
                        var Pr = Math.random();
                        var intersect = xFinal;
                        if (material.refractivity == 0 && material.reflectivity == 0) {
                            colorMask = colorMask.scale(material.color_diffuse);
                            color.setVec(colorMask);
                            var randomnum = TraceWorker.rand(intersect.pos.xy);
                            ray.dir = TraceWorker.calculateRandomDirectionInHemisphere(seed + randomnum, intersect.norm).normalize();
                            ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                        }
                        else {
                            var isInsideOut = ray.dir.dot(intersect.norm) > 0.0;
                            if (material.refractivity > 0.0) {
                                var random = new util_1.Vec3f(TraceWorker.rand(intersect.pos.xy), TraceWorker.rand(intersect.pos.xz), TraceWorker.rand(intersect.pos.yz));
                                var oldIOR = ray.ior;
                                var newIOR = material.ior;
                                var fresnel;
                                var reflect_range = -1.0;
                                var IOR12 = oldIOR / newIOR;
                                var NdotI = ray.dir.dot(xFinal.norm);
                                var cos_t = IOR12 * IOR12 * (1.0 - NdotI * NdotI);
                                var reflectR = ray.dir.reflect(intersect.norm);
                                var refractR = ray.dir.refract(intersect.norm, IOR12, NdotI, cos_t);
                                fresnel = TraceWorker.calculateFresnel(intersect.norm, ray.dir, oldIOR, newIOR);
                                reflect_range = fresnel.reflectionCoefficient;
                                var randomnum = TraceWorker.getrandom(random, seed);
                                if (randomnum < reflect_range) {
                                    ray.dir = reflectR;
                                    ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                                    if (material.subsurfaceScatter > 0) {
                                        var _random = TraceWorker.rand(intersect.pos.xy);
                                        var scatterColor = TraceWorker.subScatterFS(intersect, material.color_diffuse, _random);
                                        colorMask = colorMask.scale(scatterColor);
                                    }
                                }
                                else {
                                    ray.dir = refractR;
                                    ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                                }
                                if (!isInsideOut) {
                                    ray.ior = newIOR;
                                }
                                else {
                                    ray.ior = 1.0;
                                }
                                colorMask = colorMask.scale(material.color_diffuse);
                                color.setVec(colorMask);
                            }
                            else if (material.reflectivity > 0.0) {
                                if (material.subsurfaceScatter > 0) {
                                    var _random = TraceWorker.rand(intersect.pos.xy);
                                    colorMask = colorMask.scale(TraceWorker.subScatterFS(intersect, material.color_diffuse, _random));
                                }
                                colorMask = colorMask.scale(material.color_diffuse);
                                color.setVec(colorMask);
                                ray.ior = 1.0;
                                ray.dir = ray.dir.reflect(intersect.norm);
                                ray.origin = intersect.pos.add(ray.dir.scaleNumber(shift));
                            }
                            else {
                            }
                        }
                    }
                };
                TraceWorker.rand = function (co) {
                    var a = 12.9898;
                    var b = 78.233;
                    var c = 43758.5453;
                    var dt = util_1.MathUtils.dotVec2(co, new Vec2f_1.Vec2f(a, b));
                    var sn = util_1.MathUtils.mod(dt, 3.14);
                    return util_1.MathUtils.fract(Math.sin(sn) * c);
                };
                TraceWorker.getrandom = function (noise, seed) {
                    return util_1.MathUtils.fract(Math.sin(util_1.MathUtils.dotVec3(TraceWorker.initRay.addNumber(seed), noise)) * 43758.5453 + seed);
                };
                TraceWorker.calculateRandomDirectionInHemisphere = function (seed, normal) {
                    var u = TraceWorker.getrandom(new util_1.Vec3f(12.9898, 78.233, 151.7182), seed);
                    var v = TraceWorker.getrandom(new util_1.Vec3f(63.7264, 10.873, 623.6736), seed);
                    var up = Math.sqrt(u);
                    var over = Math.sqrt(1.0 - up * up);
                    var around = v * 3.141592 * 2.0;
                    var directionNotNormal;
                    if (Math.abs(normal.x) < 0.577350269189) {
                        directionNotNormal = new util_1.Vec3f(1, 0, 0);
                    }
                    else if (Math.abs(normal.y) < 0.577350269189) {
                        directionNotNormal = new util_1.Vec3f(0, 1, 0);
                    }
                    else {
                        directionNotNormal = new util_1.Vec3f(0, 0, 1);
                    }
                    var perpendicularDirection1 = normal.cross(directionNotNormal).normalize();
                    var perpendicularDirection2 = normal.cross(perpendicularDirection1).normalize();
                    return normal.scaleNumber(up).add(perpendicularDirection1.scaleNumber(Math.cos(around) * over)).add(perpendicularDirection2.scaleNumber(Math.sin(around) * over));
                };
                TraceWorker.calculateFresnel = function (normal, incident, incidentIOR, transmittedIOR) {
                    var fresnel = {
                        reflectionCoefficient: 0,
                        transmissionCoefficient: 0
                    };
                    incident = incident.normalize();
                    normal = normal.normalize();
                    var cosThetaI = Math.abs(normal.dot(incident));
                    var sinIncidence = Math.sqrt(1.0 - Math.pow(cosThetaI, 2.0));
                    var cosThetaT = Math.sqrt(1.0 - Math.pow(((incidentIOR / transmittedIOR) * sinIncidence), 2.0));
                    if (cosThetaT <= 0.0) {
                        fresnel.reflectionCoefficient = 1.0;
                        fresnel.transmissionCoefficient = 0.0;
                        return fresnel;
                    }
                    else {
                        var RsP = Math.pow((incidentIOR * cosThetaI - transmittedIOR * cosThetaT) / (incidentIOR * cosThetaI + transmittedIOR * cosThetaT), 2.0);
                        var RpP = Math.pow((incidentIOR * cosThetaT - transmittedIOR * cosThetaI) / (incidentIOR * cosThetaT + transmittedIOR * cosThetaI), 2.0);
                        fresnel.reflectionCoefficient = (RsP + RpP) / 2.0;
                        fresnel.transmissionCoefficient = 1.0 - fresnel.reflectionCoefficient;
                        return fresnel;
                    }
                };
                TraceWorker.subScatterFS = function (intersect, color, seed) {
                    var RimScalar = 1.0;
                    var MaterialThickness = 0.5;
                    var ExtinctionCoefficient = new util_1.Vec3f(1.0, 1.0, 1.0);
                    var SpecColor = new util_1.Vec3f(1.0, 1.0, 1.0);
                    var lightPoint = new util_1.Vec3f(0.0, 5.0, 0.0);
                    var attenuation = 10.0 * (1.0 / lightPoint.distance(intersect.pos));
                    var eVec = intersect.pos.normalize();
                    var lVec = lightPoint.sub(intersect.pos).normalize();
                    var wNorm = intersect.norm.normalize();
                    var dotLN = new util_1.Vec3f(TraceWorker.halfLambert(lVec, wNorm) * attenuation);
                    dotLN = dotLN.scale(color);
                    var indirectLightComponent = new util_1.Vec3f(MaterialThickness * Math.max(0.0, lVec.dot(wNorm.negate())));
                    indirectLightComponent.addNumber(MaterialThickness * TraceWorker.halfLambert(eVec.negate(), lVec));
                    indirectLightComponent.scaleNumber(attenuation);
                    indirectLightComponent.x *= ExtinctionCoefficient.x;
                    indirectLightComponent.y *= ExtinctionCoefficient.y;
                    indirectLightComponent.z *= ExtinctionCoefficient.z;
                    var rim = new util_1.Vec3f(1.0 - Math.max(0.0, wNorm.dot(eVec)));
                    rim = rim.scale(rim);
                    rim = SpecColor.scale(rim.scaleNumber(Math.max(0.0, wNorm.dot(lVec))));
                    var finalCol = dotLN.add(indirectLightComponent);
                    finalCol.add(rim.scaleNumber(RimScalar * attenuation));
                    var SpecularPower = 15.0;
                    finalCol = finalCol.add(SpecColor.scaleNumber(TraceWorker.blinnPhongSpecular(wNorm, lVec, SpecularPower) * attenuation * 0.1));
                    return finalCol;
                };
                TraceWorker.blinnPhongSpecular = function (normalVec, lightVec, specPower) {
                    var halfAngle = normalVec.add(lightVec).normalize();
                    return Math.pow(util_1.MathUtils.clamp2(0.0, 1.0, normalVec.dot(halfAngle)), specPower);
                };
                TraceWorker.halfLambert = function (vect1, vect2) {
                    var product = vect1.dot(vect2);
                    return product * 0.5 + 0.5;
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
                TraceWorker.interval = 0;
                return TraceWorker;
            })();
            exports_1("TraceWorker", TraceWorker);
            new TraceWorker();
        }
    }
});
//# sourceMappingURL=TraceWorker.js.map