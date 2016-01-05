export class InputListener
{

	static keyboard_keys:boolean[]   = [];//255
	static mouse_buttons:boolean[]   = [];//8
	static mouse_x:number         = 0;
	static mouse_y:number         = 0;
	static mouse_dragged_x:number = 0;
	static mouse_dragged_y:number = 0;
	static mouse_moved_x:number   = 0;
	static mouse_moved_y:number   = 0;

	static KEY_UP:number            = 38;
	static KEY_DOWN:number          = 40;
	static KEY_LEFT:number          = 37;
	static KEY_RIGHT:number         = 39;
	static KEY_SPACE:number         = 32;
	static KEY_W:number             = 87;
	static KEY_S:number             = 83;
	static KEY_A:number             = 65;
	static KEY_D:number             = 68;
	static KEY_1:number             = 49;
	static KEY_2:number             = 50;
	static KEY_3:number             = 51;
	static KEY_R:number             = 82;
	static KEY_F:number             = 70;
	static KEY_Q:number             = 81;
	static KEY_E:number             = 69;
	static KEY_PLUS:number          = 107;
	static KEY_MINUS:number         = 109;

	constructor(){
        window.onkeydown = function(event){
            InputListener.keyPressed(event);
        };
        window.onkeyup = function(event){
            InputListener.keyReleased(event);
        };
    }

    static keyTyped(e):void
	{

	}

    static keyPressed(e):void
	{
		InputListener.keyboard_keys[e.keyCode] = true;
	}

    static keyReleased(e):void
	{
		InputListener.keyboard_keys[e.keyCode] = false;
	}

    static mouseClicked(e):void
	{

	}

    static mousePressed(e):void
	{
		InputListener.mouse_buttons[e.getButton()] = true;
	}

    static mouseReleased(e):void
	{
        InputListener.mouse_buttons[e.getButton()] = false;
	}

    static mouseEntered(e):void
	{

	}

    static mouseExited(e):void
	{

	}

    static mouseDragged(e):void
	{
        InputListener.mouse_x = e.getX();
        InputListener.mouse_y = e.getY();
        InputListener.mouse_dragged_x = e.getX();
        InputListener.mouse_dragged_y = e.getY();
	}

    static mouseMoved(e):void
	{
        InputListener.mouse_x = e.getX();
        InputListener.mouse_y = e.getY();
        InputListener.mouse_moved_x = e.getX();
        InputListener.mouse_moved_y = e.getY();
	}

	static getKeyboardKeys():boolean[]
	{
		return InputListener.keyboard_keys;
	}

    static getKey(k:number):boolean
	{
		return InputListener.keyboard_keys[k];
	}

	static getMouseButtons():boolean[]
	{
		return InputListener.mouse_buttons;
	}

	static getMouseX():number
	{
		return InputListener.mouse_x;
	}

	static getMouseY():number
	{
		return InputListener.mouse_y;
	}

	static getMouseDraggedX():number
	{
		return InputListener.mouse_dragged_x;
	}

	static getMouseDraggedY():number
	{
		return InputListener.mouse_dragged_y;
	}

	static getMouseMovedX():number
	{
		return InputListener.mouse_moved_x;
	}

	static getMouseMovedY():number
	{
		return InputListener.mouse_moved_y;
	}

}
