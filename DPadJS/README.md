#DPad controler

### Demo

view:[RawGit](https://rawgit.com/triktron/Mini-Libraries/master/DPadJS/demo/index.html).

### Installation
Just grab `DPad.js` from this repo.

### Usage
Init the script with your buttons.
```js
DPad.init({"btn1": {
    "press": function () {
        //presed
    },
    "unpress": function () {
        //unpresed
    },
    "style":{
        "left":"50%",
        "top":"50%",
        "opacity":"1"
    },
    "innerHTML":"<h1>Press Me</h1>"
}});
```

## Change Log

### 0.2.X

* changed object name to `DPad`.
* added innerHTML options.
* prevented duplication op pads.

### 0.1.X

* Initial version.

### Todo's
* ~~Write Demo~~
* Add Animations
* Add Texures
* Add Joystick

License
----

Apache