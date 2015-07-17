/**
 * Just call 'DPade.init(options)' with an options list
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
 * @method DPad
 * @param {String} 'CONTROLS_CSS_NOFILL'             default css nofill styles.
 * @param {String} 'CONTROLS_CSS'                    default css styles.
 * @param {String} 'DPAD_BUTTON_WIDTH_PERCENT'       default button size.
 * @param {String}  'DPAD_BUTTON_HEIGHT_PERCENT'     default button size.
 * @param {Function} 'init'                          The init script for the script.
 * @param {Function} 'CaptureDPade'                 Captures the toutche events.
 * @param {Function} 'CaptureMouseDownOrMove'        Captures the mouse move and mouse down event.
 * @param {Function} 'CaptureMouseUp'                Captures the mouse up event.
 * @param {Function} 'updateButtonState'             The function that checks if a button is presed.
 * @param {Function} 'createDPadButton'              The script thad adds a button.
 */

DPad = {};
DPad.CONTROLS_CSS_NOFILL = 'opacity:0.1; z-index: 11000; border-style: dashed; border-width: 1px';
DPad.CONTROLS_CSS = 'background-color: red; ' + DPad.CONTROLS_CSS_NOFILL;
DPad.DPAD_BUTTON_WIDTH_PERCENT = "18%";
DPad.DPAD_BUTTON_HEIGHT_PERCENT = "20%";
DPad.dpad = {}; // map of dpad control objects
DPad.init = function (options) {
    var container = document.createElement("div");
    DPad.container = container;
    container.id = "DPad";
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.right = "0";
    container.style.bottom = "0";

    for (var key in options) {
        var buttonOpt = options[key];

        if (DPad.dpad[key]) console.error("dpad with id:",key,"alredy exists!"); else DPad.dpad[key] = DPad.createDPadButton(key, buttonOpt.press || function () {}, buttonOpt.unpress || function () {});
        for (var type in buttonOpt.style) DPad.dpad[key].style[type] = buttonOpt.style[type];
        if (buttonOpt.innerHTML) DPad.dpad[key].innerHTML = buttonOpt.innerHTML;
    }


    document.body.appendChild(container);

    // press handler for basic DPadstart case
    document.addEventListener('DPadstart', DPad.CaptureDPade);
    // move handler for basic DPadmove case
    document.addEventListener('DPadmove', DPad.CaptureDPade);
    // DPad ended. The DPad may have moved to another button, so handle that
    document.addEventListener('DPadend', DPad.CaptureDPade);
    // press handler for basic mouse case
    document.addEventListener('mousedown', DPad.CaptureMouseDownOrMove);
    // move handler for basic mousestart case
    document.addEventListener('mousemove', DPad.CaptureMouseDownOrMove);
    // mouse up.
    document.addEventListener('mouseup', DPad.CaptureMouseUp);
};
DPad.CaptureDPade = function (evt) {
    evt.preventDefault();
    DPad.updateButtonState(evt.DPades);
}
DPad.CaptureMouseDownOrMove = function (evt) {
    if (evt.buttons != 0) DPad.updateButtonState([evt]);
    else DPad.updateButtonState([{
        'clientX': -1,
        'clientY': -1
    }]);
}
DPad.CaptureMouseUp = function (evt) {
    DPad.updateButtonState([{
        'clientX': -1,
        'clientY': -1
    }]);
}
DPad.updateButtonState = function (input) {
    for (var key in DPad.dpad) {
        var button = DPad.dpad[key];
        var isPresed = false;
        for (var i = 0; i < input.length; i++) {
            var DPade = input[i];
            var element = document.elementFromPoint(DPade.clientX, DPade.clientY);
            // this can return null
            if (element !== null && 'id' in element)
                if (element == button) isPresed = true;
        }
        if (isPresed && !button.isPresed) button.press();
        if (!isPresed & button.isPresed) button.unpress();
        button.isPresed = isPresed;
    }
}
DPad.createDPadButton = function (id, pressFunction, unpressFunction, cssOverride) {
    var button = document.createElement('div');
    button.id = id;
    if (typeof cssOverride !== 'undefined') {
        button.style.cssText = cssOverride;
    } else {
        button.style.cssText = DPad.CONTROLS_CSS;
    }
    button.style.width = DPad.DPAD_BUTTON_WIDTH_PERCENT + '%';
    button.style.height = DPad.DPAD_BUTTON_HEIGHT_PERCENT + '%';
    button.style.position = 'absolute';
    button.press = pressFunction;
    button.unpress = unpressFunction;
    button.isPresed = false;
    DPad.container.appendChild(button);
    return button;
};
