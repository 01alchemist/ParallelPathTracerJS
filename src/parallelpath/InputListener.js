System.register([], function(exports_1) {
    var InputListener;
    return {
        setters:[],
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