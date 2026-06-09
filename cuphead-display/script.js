
//
// ==========================
// CONFIG
// ==========================
//

let currentCharacter = "Chalice";

const $ = id => document.getElementById(id);

const buttons = {
    jump: $("jump"),
    shoot: $("shoot"),
    dash: $("dash"),
    ex: $("ex")
};

const arrows = {
    up: $("up"),
    down: $("down"),
    left: $("left"),
    right: $("right")
};

const misc = {
    lock: $("lock"),
    swap: $("swap")
};

//
// ==========================
// PERSONAGENS
// ==========================
//

const chars = {

    Chalice: {
        jump: "jump",
        shoot: "shoot",
        dash: "dash",
        ex: "ex"
    },

    Cuphead: {
        jump: "cupjump",
        shoot: "cupshoot",
        dash: "cupdash",
        ex: "cupex"
    },

    Mugman: {
        jump: "mugjump",
        shoot: "mugshoot",
        dash: "mugdash",
        ex: "mugex"
    }
};

const getFile = action => chars[currentCharacter][action];

//
// ==========================
// ESTADOS
// ==========================
//

const keyboard = {
    left: false,
    right: false,
    up: false,
    down: false
};

const keyboardButtons = {
    jump: false,
    shoot: false,
    dash: false,
    ex: false
};

const keyboardMisc = {
    lock: false,
    swap: false
};

const gamepadInput = {
    left: false,
    right: false,
    up: false,
    down: false
};

const gamepadButtons = {
    jump: false,
    shoot: false,
    dash: false,
    ex: false
};

const gamepadMisc = {
    lock: false,
    swap: false
};

//
// ==========================
// GAMEPAD BUTTON NAMES
// ==========================
//

const gamepadButtonNames = {

    0: "A",
    1: "B",
    2: "X",
    3: "Y",

    4: "LB",
    5: "RB",

    6: "LT",
    7: "RT",

    8: "SELECT",
    9: "START",

    10: "L3",
    11: "R3",

    12: "DPAD ↑",
    13: "DPAD ↓",
    14: "DPAD ←",
    15: "DPAD →",

    16: "HOME"
};

function getGamepadButtonName(index) {

    return gamepadButtonNames[index] || `BUTTON ${index}`;
}

//
// ==========================
// KEYBINDS
// ==========================
//

function rebuildKeyMap() {

    return {

        [keybinds.jump]: ["jump", keyboardButtons],
        [keybinds.shoot]: ["shoot", keyboardButtons],
        [keybinds.dash]: ["dash", keyboardButtons],
        [keybinds.ex]: ["ex", keyboardButtons],

        [keybinds.up]: ["up", keyboard],
        [keybinds.down]: ["down", keyboard],
        [keybinds.left]: ["left", keyboard],
        [keybinds.right]: ["right", keyboard]
    };
}

let keyMap = rebuildKeyMap();

//
// ==========================
// IMAGENS
// ==========================
//

function setButton(action, pressed) {

    const file = getFile(action);

    buttons[action].src = pressed
        ? `assets/Pressed/${currentCharacter}/${file}_pressed.png`
        : `assets/Unpressed/${currentCharacter}/${file}.png`;
}

function updateCharacterImages() {

    Object.keys(buttons).forEach(action => {
        setButton(action, false);
    });
}

//
// ==========================
// TROCAR PERSONAGEM
// ==========================
//

function changeCharacter(character) {

    currentCharacter = character;

    updateCharacterImages();

    Object.keys(buttons).forEach(action => {

        if (
            keyboardButtons[action] ||
            gamepadButtons[action]
        ) {
            setButton(action, true);
        }
    });

    document.body.focus();
}

//
// ==========================
// KEYBOARD
// ==========================
//

function handleKey(e, state) {

    const key = keyMap[e.code];

    if (key) {

        const [name, target] = key;

        target[name] = state;
    }

    if (e.code === keybinds.lock) {
        keyboardMisc.lock = state;
    }

    if (e.code === keybinds.swap) {
        keyboardMisc.swap = state;
    }
}

document.addEventListener("keydown", e => {
    handleKey(e, true);
});

document.addEventListener("keyup", e => {
    handleKey(e, false);
});

//
// ==========================
// GAMEPAD
// ==========================
//

function updateGamepad() {

    const gp = navigator.getGamepads()[0];

    Object.keys(gamepadInput).forEach(
        key => gamepadInput[key] = false
    );

    Object.keys(gamepadButtons).forEach(
        key => gamepadButtons[key] = false
    );

    gamepadMisc.lock = false;
    gamepadMisc.swap = false;

    if (gp) {

        //
        // BOTÕES
        //

        gamepadButtons.jump =
            gp.buttons[gamepadBinds.jump]?.pressed || false;

        gamepadButtons.shoot =
            gp.buttons[gamepadBinds.shoot]?.pressed || false;

        gamepadButtons.dash =
            gp.buttons[gamepadBinds.dash]?.pressed || false;

        gamepadButtons.ex =
            gp.buttons[gamepadBinds.ex]?.pressed || false;

        gamepadMisc.lock =
            gp.buttons[gamepadBinds.lock]?.pressed || false;

        gamepadMisc.swap =
            gp.buttons[gamepadBinds.swap]?.pressed || false;

        //
        // ANALÓGICO + DPAD
        //

        const deadzone = 0.3;

        const x = gp.axes[0] || 0;
        const y = gp.axes[1] || 0;

        gamepadInput.left =
            gp.buttons[14]?.pressed || x < -deadzone;

        gamepadInput.right =
            gp.buttons[15]?.pressed || x > deadzone;

        gamepadInput.up =
            gp.buttons[12]?.pressed || y < -deadzone;

        gamepadInput.down =
            gp.buttons[13]?.pressed || y > deadzone;
    }

    //
    // RENDER SETAS
    //

    Object.keys(arrows).forEach(dir => {

        arrows[dir].src =
            (keyboard[dir] || gamepadInput[dir])
                ? `assets/Pressed/Misc/Arrow_${dir}_pressed.png`
                : `assets/Unpressed/Misc/Arrow_${dir}.png`;
    });

    //
    // RENDER BOTÕES
    //

    Object.keys(buttons).forEach(action => {

        setButton(
            action,
            keyboardButtons[action] ||
            gamepadButtons[action]
        );
    });

    //
    // RENDER LOCK
    //

    misc.lock.src =
        (keyboardMisc.lock || gamepadMisc.lock)
            ? "assets/Pressed/Misc/lock_pressed.png"
            : "assets/Unpressed/Misc/Lock.png";

    //
    // RENDER SWAP
    //

    misc.swap.src =
        (keyboardMisc.swap || gamepadMisc.swap)
            ? "assets/Pressed/Misc/swap_pressed.png"
            : "assets/Unpressed/Misc/Swap.png";

    requestAnimationFrame(updateGamepad);
}

//
// ==========================
// GAMEPAD REBIND
// ==========================
//

let waitingGamepadBind = null;

function listenGamepad(action) {

    waitingGamepadBind = action;
}

setInterval(() => {

    if (!waitingGamepadBind) return;

    const gp = navigator.getGamepads()[0];

    if (!gp) return;

    gp.buttons.forEach((btn, index) => {

        if (btn.pressed) {

            gamepadBinds[waitingGamepadBind] = index;

            updateGamepadBindButtons();

            waitingGamepadBind = null;
        }
    });

}, 100);

//
// ==========================
// UPDATE GAMEPAD UI
// ==========================
//

function updateGamepadBindButtons() {

    $("gp-jump").textContent =
        getGamepadButtonName(gamepadBinds.jump);

    $("gp-shoot").textContent =
        getGamepadButtonName(gamepadBinds.shoot);

    $("gp-dash").textContent =
        getGamepadButtonName(gamepadBinds.dash);

    $("gp-ex").textContent =
        getGamepadButtonName(gamepadBinds.ex);

    $("gp-lock").textContent =
        getGamepadButtonName(gamepadBinds.lock);

    $("gp-swap").textContent =
        getGamepadButtonName(gamepadBinds.swap);
}

//
// ==========================
// KEYBOARD BINDS
// ==========================
//

function keyToCode(key, code) {

    return code;
}

function setupBindInput(id, action) {

    const input = $(id);

    input.addEventListener("keydown", e => {

        e.preventDefault();

        let display = e.key;

        if (e.code === "Space") {
            display = "SPACE";
        }

        if (e.code === "ArrowUp") {
            display = "↑";
        }

        if (e.code === "ArrowDown") {
            display = "↓";
        }

        if (e.code === "ArrowLeft") {
            display = "←";
        }

        if (e.code === "ArrowRight") {
            display = "→";
        }

        input.value = display.toUpperCase();

        keybinds[action] = keyToCode(
            e.key,
            e.code
        );

        keyMap = rebuildKeyMap();
    });
}

setupBindInput("bind-jump", "jump");
setupBindInput("bind-shoot", "shoot");
setupBindInput("bind-dash", "dash");
setupBindInput("bind-ex", "ex");

setupBindInput("bind-lock", "lock");
setupBindInput("bind-swap", "swap");

setupBindInput("bind-up", "up");
setupBindInput("bind-down", "down");
setupBindInput("bind-left", "left");
setupBindInput("bind-right", "right");

//
// ==========================
// START
// ==========================
//

updateCharacterImages();
updateGamepad();
updateGamepadBindButtons();
