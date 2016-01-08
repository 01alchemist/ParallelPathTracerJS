System.register(["./util/math/Mat4f"], function(exports_1) {
    var Mat4f_1;
    var InputListener;
    return {
        setters:[
            function (Mat4f_1_1) {
                Mat4f_1 = Mat4f_1_1;
            }],
        execute: function() {
            InputListener = (function () {
                function InputListener() {
                    window.onkeydown = function (event) {
                        InputListener.keyPressed(event);
                    };
                    window.onkeyup = function (event) {
                        InputListener.keyReleased(event);
                    };
                }
                InputListener.prototype.register = function (display, tracer) {
                    display.canvas.onmousedown = handleMouseDown;
                    display.canvas.oncontextmenu = function (ev) {
                        return false;
                    };
                    document.onmouseup = handleMouseUp;
                    document.onmousemove = handleMouseMove;
                    var mouseLeftDown = false;
                    var mouseRightDown = false;
                    var mouseMidDown = false;
                    var lastMouseX = null;
                    var lastMouseY = null;
                    var pause = false;
                    function handleMouseDown(event) {
                        if (event.button == 2) {
                            mouseLeftDown = false;
                            mouseRightDown = true;
                            mouseMidDown = false;
                        }
                        else if (event.button == 0) {
                            mouseLeftDown = true;
                            mouseRightDown = false;
                            mouseMidDown = false;
                        }
                        else if (event.button == 1) {
                            mouseLeftDown = false;
                            mouseRightDown = false;
                            mouseMidDown = true;
                        }
                        lastMouseX = event.clientX;
                        lastMouseY = event.clientY;
                    }
                    function handleMouseUp(event) {
                        mouseLeftDown = false;
                        mouseRightDown = false;
                        mouseMidDown = false;
                    }
                    function handleMouseMove(event) {
                        if (!(mouseLeftDown || mouseRightDown || mouseMidDown)) {
                            return;
                        }
                        var newX = event.clientX;
                        var newY = event.clientY;
                        var deltaX = newX - lastMouseX;
                        var deltaY = newY - lastMouseY;
                        if (mouseLeftDown) {
                            tracer.angleY -= deltaX * 0.01;
                            tracer.angleX += deltaY * 0.01;
                            tracer.angleX = Math.max(tracer.angleX, -Math.PI / 2 + 0.01);
                            tracer.angleX = Math.min(tracer.angleX, Math.PI / 2 - 0.01);
                            tracer.eye.x = tracer.zoomZ * Math.sin(tracer.angleY) * Math.cos(tracer.angleX);
                            tracer.eye.y = tracer.zoomZ * Math.sin(tracer.angleX);
                            tracer.eye.z = tracer.zoomZ * Math.cos(tracer.angleY) * Math.cos(tracer.angleX);
                        }
                        else if (mouseRightDown) {
                            tracer.zoomZ += 0.01 * deltaY;
                            tracer.zoomZ = Math.min(Math.max(tracer.zoomZ, 4.0), 20.0);
                            tracer.eye.x = tracer.zoomZ * Math.sin(tracer.angleY) * Math.cos(tracer.angleX);
                            tracer.eye.y = tracer.zoomZ * Math.sin(tracer.angleX);
                            tracer.eye.z = tracer.zoomZ * Math.cos(tracer.angleY) * Math.cos(tracer.angleX);
                        }
                        else if (mouseMidDown) {
                            tracer.center.x -= 0.01 * deltaX;
                            tracer.center.y += 0.01 * deltaY;
                            tracer.eye.x -= 0.01 * deltaX;
                            tracer.eye.y += 0.01 * deltaY;
                        }
                        lastMouseX = newX;
                        lastMouseY = newY;
                        var modelview = new Mat4f_1.Mat4f().lookAt([tracer.eye.x, tracer.eye.y, tracer.eye.z], [tracer.center.x, tracer.center.y, tracer.center.z], [tracer.up.x, tracer.up.y, tracer.up.z]);
                        var projection = new Mat4f_1.Mat4f().perspective(tracer.FOVY, display.width / display.height, 0.1, 100.0, true);
                        var modelviewprojection = projection.multiply(modelview);
                        var inversemp = modelviewprojection.inverse();
                        tracer.invMP = inversemp;
                        tracer.iterations = 0;
                    }
                };
                InputListener.keyTyped = function (e) {
                };
                InputListener.keyPressed = function (e) {
                    InputListener.keyboard_keys[e.keyCode] = true;
                };
                InputListener.keyReleased = function (e) {
                    InputListener.keyboard_keys[e.keyCode] = false;
                };
                InputListener.mouseClicked = function (e) {
                };
                InputListener.mousePressed = function (e) {
                    InputListener.mouse_buttons[e.getButton()] = true;
                };
                InputListener.mouseReleased = function (e) {
                    InputListener.mouse_buttons[e.getButton()] = false;
                };
                InputListener.mouseEntered = function (e) {
                };
                InputListener.mouseExited = function (e) {
                };
                InputListener.mouseDragged = function (e) {
                    InputListener.mouse_x = e.getX();
                    InputListener.mouse_y = e.getY();
                    InputListener.mouse_dragged_x = e.getX();
                    InputListener.mouse_dragged_y = e.getY();
                };
                InputListener.mouseMoved = function (e) {
                    InputListener.mouse_x = e.getX();
                    InputListener.mouse_y = e.getY();
                    InputListener.mouse_moved_x = e.getX();
                    InputListener.mouse_moved_y = e.getY();
                };
                InputListener.getKeyboardKeys = function () {
                    return InputListener.keyboard_keys;
                };
                InputListener.getKey = function (k) {
                    return InputListener.keyboard_keys[k];
                };
                InputListener.getMouseButtons = function () {
                    return InputListener.mouse_buttons;
                };
                InputListener.getMouseX = function () {
                    return InputListener.mouse_x;
                };
                InputListener.getMouseY = function () {
                    return InputListener.mouse_y;
                };
                InputListener.getMouseDraggedX = function () {
                    return InputListener.mouse_dragged_x;
                };
                InputListener.getMouseDraggedY = function () {
                    return InputListener.mouse_dragged_y;
                };
                InputListener.getMouseMovedX = function () {
                    return InputListener.mouse_moved_x;
                };
                InputListener.getMouseMovedY = function () {
                    return InputListener.mouse_moved_y;
                };
                InputListener.keyboard_keys = [];
                InputListener.mouse_buttons = [];
                InputListener.mouse_x = 0;
                InputListener.mouse_y = 0;
                InputListener.mouse_dragged_x = 0;
                InputListener.mouse_dragged_y = 0;
                InputListener.mouse_moved_x = 0;
                InputListener.mouse_moved_y = 0;
                InputListener.KEY_UP = 38;
                InputListener.KEY_DOWN = 40;
                InputListener.KEY_LEFT = 37;
                InputListener.KEY_RIGHT = 39;
                InputListener.KEY_SPACE = 32;
                InputListener.KEY_W = 87;
                InputListener.KEY_S = 83;
                InputListener.KEY_A = 65;
                InputListener.KEY_D = 68;
                InputListener.KEY_1 = 49;
                InputListener.KEY_2 = 50;
                InputListener.KEY_3 = 51;
                InputListener.KEY_R = 82;
                InputListener.KEY_F = 70;
                InputListener.KEY_Q = 81;
                InputListener.KEY_E = 69;
                InputListener.KEY_PLUS = 107;
                InputListener.KEY_MINUS = 109;
                return InputListener;
            })();
            exports_1("InputListener", InputListener);
        }
    }
});
//# sourceMappingURL=InputListener.js.map