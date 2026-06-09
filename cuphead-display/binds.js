const defaultKeybinds = {

    jump: "KeyZ",
    shoot: "KeyX",
    dash: "KeyC",
    ex: "KeyV",

    lock: "KeyA",
    swap: "KeyS",

    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight"
};

const defaultGamepadBinds = {

    jump: 0,
    shoot: 2,
    dash: 1,
    ex: 3,

    lock: 4,
    swap: 5
};

//
// ==========================
// LOAD SAVED BINDS
// ==========================
//

const keybinds = JSON.parse(
    localStorage.getItem("keybinds")
) || defaultKeybinds;

const gamepadBinds = JSON.parse(
    localStorage.getItem("gamepadBinds")
) || defaultGamepadBinds;