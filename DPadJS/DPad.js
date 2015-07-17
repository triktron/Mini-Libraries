/**
 * Just call 'Touche.init(options)' with an options list
 *
 * Otions list exammple
 *
 *
 *   "btn1": {
 *      "press": function () {
 *          //presed
 *      },
 *      "unpress": function () {
 *          //unpresed
 *      },
 *      "style":{
 *          "left":"50%",
 *          "top":"50%"
 *      }
 *   }
 *
 *
 *
 * @method Touch
 * @param {String} 'CONTROLS_CSS_NOFILL'             default css nofill styles.
 * @param {String} 'CONTROLS_CSS'                    default css styles.
 * @param {String} 'DPAD_BUTTON_WIDTH_PERCENT'       default button size.
 * @param {String}  'DPAD_BUTTON_HEIGHT_PERCENT'     default button size.
 * @param {Function} 'init'                          The init script for the script.
 * @param {Function} 'CaptureTouche'                 Captures the toutche events.
 * @param {Function} 'CaptureMouseDownOrMove'        Captures the mouse move and mouse down event.
 * @param {Function} 'CaptureMouseUp'                Captures the mouse up event.
 * @param {Function} 'updateButtonState'             The function that checks if a button is presed.
 * @param {Function} 'createDPadButton'              The script thad adds a button.
 */

Touch = {};
Touch.CONTROLS_CSS_NOFILL = 'opacity:0.1; z-index: 11000; border-style: dashed; border-width: 1px';
Touch.CONTROLS_CSS = 'background-color: red; ' + Touch.CONTROLS_CSS_NOFILL;
Touch.DPAD_BUTTON_WIDTH_PERCENT = "18%";
Touch.DPAD_BUTTON_HEIGHT_PERCENT = "20%";
Touch.dpad = {}; // map of dpad control objects
Touch.init = function (options) {
    var container = document.createElement("div");
    Touch.container = container;
    container.id = "DPad";
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.right = "0";
    container.style.bottom = "0";

    for (var key in options) {
        var buttonOpt = options[key];

        if (Touch.dpad[key]) console.error("dpad with id:",key,"alredy exists!"); else Touch.dpad[key] = Touch.createDPadButton(key, buttonOpt.press || function () {}, buttonOpt.unpress || function () {});
        for (var type in buttonOpt.style) Touch.dpad[key].style[type] = buttonOpt.style[type];
        if (buttonOpt.innerHTML) Touch.dpad[key].innerHTML = buttonOpt.innerHTML;
    }


    document.body.appendChild(container);

    // press handler for basic touchstart case
    document.addEventListener('touchstart', Touch.CaptureTouche);
    // move handler for basic touchmove case
    document.addEventListener('touchmove', Touch.CaptureTouche);
    // touch ended. The touch may have moved to another button, so handle that
    document.addEventListener('touchend', Touch.CaptureTouche);
    // press handler for basic mouse case
    document.addEventListener('mousedown', Touch.CaptureMouseDownOrMove);
    // move handler for basic mousestart case
    document.addEventListener('mousemove', Touch.CaptureMouseDownOrMove);
    // mouse up.
    document.addEventListener('mouseup', Touch.CaptureMouseUp);
};
Touch.CaptureTouche = function (evt) {
    evt.preventDefault();
    Touch.updateButtonState(evt.touches);
}
Touch.CaptureMouseDownOrMove = function (evt) {
    if (evt.buttons != 0) Touch.updateButtonState([evt]);
    else Touch.updateButtonState([{
        'clientX': -1,
        'clientY': -1
    }]);
}
Touch.CaptureMouseUp = function (evt) {
    Touch.updateButtonState([{
        'clientX': -1,
        'clientY': -1
    }]);
}
Touch.updateButtonState = function (input) {
    for (var key in Touch.dpad) {
        var button = Touch.dpad[key];
        var isPresed = false;
        for (var i = 0; i < input.length; i++) {
            var touche = input[i];
            var element = document.elementFromPoint(touche.clientX, touche.clientY);
            // this can return null
            if (element !== null && 'id' in element)
                if (element == button) isPresed = true;
        }
        if (isPresed && !button.isPresed) button.press();
        if (!isPresed & button.isPresed) button.unpress();
        button.isPresed = isPresed;
    }
}
Touch.createDPadButton = function (id, pressFunction, unpressFunction, cssOverride) {
    var button = document.createElement('div');
    button.id = id;
    if (typeof cssOverride !== 'undefined') {
        button.style.cssText = cssOverride;
    } else {
        button.style.cssText = Touch.CONTROLS_CSS;
    }
    button.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
    button.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
    button.style.position = 'absolute';
    button.press = pressFunction;
    button.unpress = unpressFunction;
    button.isPresed = false;
    Touch.container.appendChild(button);
    return button;
};
