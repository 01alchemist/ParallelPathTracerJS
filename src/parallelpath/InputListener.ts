import {Display} from "./gfx/Display";
import {Tracer} from "./gfx/Tracer";
import {Mat4f} from "./util/math/Mat4f";
export class InputListener {

    static keyboard_keys:boolean[] = [];//255
    static mouse_buttons:boolean[] = [];//8
    static mouse_x:number = 0;
    static mouse_y:number = 0;
    static mouse_dragged_x:number = 0;
    static mouse_dragged_y:number = 0;
    static mouse_moved_x:number = 0;
    static mouse_moved_y:number = 0;

    static KEY_UP:number = 38;
    static KEY_DOWN:number = 40;
    static KEY_LEFT:number = 37;
    static KEY_RIGHT:number = 39;
    static KEY_SPACE:number = 32;
    static KEY_W:number = 87;
    static KEY_S:number = 83;
    static KEY_A:number = 65;
    static KEY_D:number = 68;
    static KEY_1:number = 49;
    static KEY_2:number = 50;
    static KEY_3:number = 51;
    static KEY_R:number = 82;
    static KEY_F:number = 70;
    static KEY_Q:number = 81;
    static KEY_E:number = 69;
    static KEY_PLUS:number = 107;
    static KEY_MINUS:number = 109;

    constructor() {
        window.onkeydown = function (event) {
            InputListener.keyPressed(event);
        };
        window.onkeyup = function (event) {
            InputListener.keyReleased(event);
        };
    }

    register(display:Display, tracer:Tracer):void {

        display.canvas.onmousedown = handleMouseDown;
        display.canvas.oncontextmenu = function (ev) {
            return false;
        };
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;

        /* Mouse interaction */
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
                // update the angles based on how far we moved since last time
                tracer.angleY -= deltaX * 0.01;
                tracer.angleX += deltaY * 0.01;

                // don't go upside down
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

            var modelview:Mat4f = new Mat4f().lookAt(
                [tracer.eye.x, tracer.eye.y, tracer.eye.z],
                [tracer.center.x, tracer.center.y, tracer.center.z],
                [tracer.up.x, tracer.up.y, tracer.up.z]
            );

            var projection:Mat4f = new Mat4f().perspective(tracer.FOVY, display.width / display.height, 0.1, 100.0, true);

            var modelviewprojection:Mat4f = projection.multiply(modelview);

            var inversemp:Mat4f = modelviewprojection.inverse();

            tracer.invMP = inversemp;

            tracer.iterations = 0;
        }

    }


    static keyTyped(e):void {

    }

    static keyPressed(e):void {
        InputListener.keyboard_keys[e.keyCode] = true;
    }

    static keyReleased(e):void {
        InputListener.keyboard_keys[e.keyCode] = false;
    }

    static mouseClicked(e):void {

    }

    static mousePressed(e):void {
        InputListener.mouse_buttons[e.getButton()] = true;
    }

    static mouseReleased(e):void {
        InputListener.mouse_buttons[e.getButton()] = false;
    }

    static mouseEntered(e):void {

    }

    static mouseExited(e):void {

    }

    static mouseDragged(e):void {
        InputListener.mouse_x = e.getX();
        InputListener.mouse_y = e.getY();
        InputListener.mouse_dragged_x = e.getX();
        InputListener.mouse_dragged_y = e.getY();
    }

    static mouseMoved(e):void {
        InputListener.mouse_x = e.getX();
        InputListener.mouse_y = e.getY();
        InputListener.mouse_moved_x = e.getX();
        InputListener.mouse_moved_y = e.getY();
    }

    static getKeyboardKeys():boolean[] {
        return InputListener.keyboard_keys;
    }

    static getKey(k:number):boolean {
        return InputListener.keyboard_keys[k];
    }

    static getMouseButtons():boolean[] {
        return InputListener.mouse_buttons;
    }

    static getMouseX():number {
        return InputListener.mouse_x;
    }

    static getMouseY():number {
        return InputListener.mouse_y;
    }

    static getMouseDraggedX():number {
        return InputListener.mouse_dragged_x;
    }

    static getMouseDraggedY():number {
        return InputListener.mouse_dragged_y;
    }

    static getMouseMovedX():number {
        return InputListener.mouse_moved_x;
    }

    static getMouseMovedY():number {
        return InputListener.mouse_moved_y;
    }
}
