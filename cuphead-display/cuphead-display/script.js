// Configuration

let currentCharacter = "Chalice";
let planeMode = loadPlaneMode();
let uiHidden = loadUiHidden();

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

// Character asset mappings

const chars = {
    Chalice: {
        jump: "Jump",
        shoot: "Shoot",
        dash: "Dash",
        ex: "EX"
    },
    Cuphead: {
        jump: "Jump",
        shoot: "Shoot",
        dash: "Dash",
        ex: "EX"
    },
    Mugman: {
        jump: "Jump",
        shoot: "Shoot",
        dash: "Dash",
        ex: "EX"
    }
};

const getFile = action => chars[currentCharacter][action];

function getSpriteMode() {
    return planeMode ? "Plane" : "Normal";
}

function characterAsset(character, file) {
    return `assets/Display/${getSpriteMode()}/${character}/${file}.png`;
}

// Input state

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

// Gamepad button labels

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

// Keyboard key map

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

// Button images

function setPressedVisual(element, pressed) {
    element.classList.toggle("pressed", pressed);
}

function setButton(action, pressed) {
    const file = getFile(action);

    buttons[action].src = characterAsset(currentCharacter, file);

    setPressedVisual(buttons[action], pressed);
}

function setArrow(dir, pressed) {
    arrows[dir].src = `assets/Display/Misc/Arrow_${dir}.png`;
    setPressedVisual(arrows[dir], pressed);
}

function setMiscButton(name, pressed) {
    misc[name].src =
        `assets/Display/Misc/${name.charAt(0).toUpperCase()}${name.slice(1)}.png`;

    setPressedVisual(misc[name], pressed);
}

// Plane mode (switches character sprites between Normal and Plane)

function refreshButtonSprites() {
    Object.keys(buttons).forEach(action => {
        setButton(
            action,
            keyboardButtons[action] || gamepadButtons[action]
        );
    });
}

async function updatePlaneButton() {
    const toggle = $("plane-toggle");
    const image = $("plane-switch-img");

    if (toggle) {
        toggle.title = planeMode ? "Plane mode on" : "Plane mode off";
        toggle.classList.toggle("active", planeMode);
    }

    if (!image) return;

    const frames = planeMode
        ? [
            "assets/switch_off_1.png",
            "assets/switch_off_2.png",
            "assets/switch_off_3.png",
            "assets/switch_on.png"
        ]
        : [
            "assets/switch_off_3.png",
            "assets/switch_off_2.png",
            "assets/switch_off_1.png",
            "assets/switch_off.png"
        ];

    for (const frame of frames) {
        image.src = frame;
        await new Promise(resolve => setTimeout(resolve, 40));
    }
}

function setPlaneMode(enabled) {
    planeMode = enabled;
    savePlaneMode(enabled);
    updatePlaneButton();
    refreshButtonSprites();
}

function togglePlaneMode() {
    setPlaneMode(!planeMode);
}

// Config panel visibility

const UI_SHOW_MS = 320;
let showAnimationTimer = null;

function clearShowAnimation() {
    if (showAnimationTimer) {
        clearTimeout(showAnimationTimer);
        showAnimationTimer = null;
    }

    document.body.classList.remove("ui-showing", "ui-show-active");
}

function updateConfigButtons() {
    const toggle = $("config-toggle");

    if (!toggle) {
        return;
    }

    toggle.title = uiHidden
        ? "Show configuration"
        : "Hide configuration";
    toggle.setAttribute("aria-pressed", String(!uiHidden));
    toggle.classList.toggle("config-open", !uiHidden);
}

function setConfigHidden(hidden, options = {}) {
    const { animate = false } = options;

    uiHidden = hidden;
    saveUiHidden(hidden);

    if (hidden) {
        clearShowAnimation();
        document.body.classList.add("ui-hidden");
        updateConfigButtons();
        return;
    }

    document.body.classList.remove("ui-hidden");
    updateConfigButtons();

    if (!animate) {
        clearShowAnimation();
        return;
    }

    document.body.classList.add("ui-showing");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add("ui-show-active");
        });
    });

    showAnimationTimer = setTimeout(clearShowAnimation, UI_SHOW_MS);
}

function toggleConfig() {
    setConfigHidden(!uiHidden, { animate: uiHidden });
}

// Keyboard input

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

// Gamepad input

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

    Object.keys(arrows).forEach(dir => {
        setArrow(dir, keyboard[dir] || gamepadInput[dir]);
    });

    Object.keys(buttons).forEach(action => {
        setButton(
            action,
            keyboardButtons[action] || gamepadButtons[action]
        );
    });

    setMiscButton("lock", keyboardMisc.lock || gamepadMisc.lock);
    setMiscButton("swap", keyboardMisc.swap || gamepadMisc.swap);

    requestAnimationFrame(updateGamepad);
}

// Gamepad rebinding

let waitingGamepadBind = null;

function listenGamepad(action) {
    waitingGamepadBind = action;
}

setInterval(() => {
    if (!waitingGamepadBind) {
        return;
    }

    const gp = navigator.getGamepads()[0];

    if (!gp) {
        return;
    }

    gp.buttons.forEach((btn, index) => {
        if (btn.pressed) {
            gamepadBinds[waitingGamepadBind] = index;
            saveGamepadBinds();
            updateGamepadBindButtons();
            waitingGamepadBind = null;
        }
    });
}, 100);

function updateGamepadBindButtons() {
    $("gp-jump").textContent = getGamepadButtonName(gamepadBinds.jump);
    $("gp-shoot").textContent = getGamepadButtonName(gamepadBinds.shoot);
    $("gp-dash").textContent = getGamepadButtonName(gamepadBinds.dash);
    $("gp-ex").textContent = getGamepadButtonName(gamepadBinds.ex);
    $("gp-lock").textContent = getGamepadButtonName(gamepadBinds.lock);
    $("gp-swap").textContent = getGamepadButtonName(gamepadBinds.swap);
}

// Keyboard rebinding

function keyToCode(key, code) {
    return code;
}

function codeToDisplay(code) {
    const displayMap = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
        Space: "SPACE"
    };

    if (displayMap[code]) {
        return displayMap[code];
    }

    if (code.startsWith("Key")) {
        return code.slice(3);
    }

    if (code.startsWith("Digit")) {
        return code.slice(5);
    }

    return code;
}

function setupBindInput(id, action) {
    const input = $(id);

    input.value = codeToDisplay(keybinds[action]).toUpperCase();

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
        keybinds[action] = keyToCode(e.key, e.code);
        keyMap = rebuildKeyMap();
        saveKeybinds();
    });
}

let zoom = 1;

window.addEventListener(
    "wheel",
    (e) => {
        if (!e.altKey) return;

        e.preventDefault();

        zoom += e.deltaY < 0 ? 0.1 : -0.1;
        zoom = Math.max(0.5, Math.min(3, zoom));

        document.body.style.zoom = zoom;
    },
    { passive: false }
);

function updateCharacterImages() {
    Object.keys(buttons).forEach(action => {
        setButton(action, false);
    });
}

function updateCharacterButtons() {
    document.querySelectorAll(".char-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.character === currentCharacter
        );
    });
}

function changeCharacter(character) {
    currentCharacter = character;

    updateCharacterButtons();
    updateCharacterImages();

    Object.keys(buttons).forEach(action => {
        if (keyboardButtons[action] || gamepadButtons[action]) {
            setButton(action, true);
        }
    });

    document.body.focus();
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

// Initialization

updateCharacterButtons();
updateCharacterImages();
updateGamepad();
updateGamepadBindButtons();
setPlaneMode(planeMode);
setConfigHidden(uiHidden);
