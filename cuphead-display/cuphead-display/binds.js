const STORAGE_KEYS = {
    keybinds: "keybinds",
    gamepadBinds: "gamepadBinds",
    planeMode: "planeMode",
    uiHidden: "uiHidden"
};

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

function loadFromStorage(key, defaults) {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return { ...defaults };
        }

        return { ...defaults, ...JSON.parse(saved) };
    } catch {
        return { ...defaults };
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

const keybinds = loadFromStorage(STORAGE_KEYS.keybinds, defaultKeybinds);
const gamepadBinds = loadFromStorage(STORAGE_KEYS.gamepadBinds, defaultGamepadBinds);

function saveKeybinds() {
    saveToStorage(STORAGE_KEYS.keybinds, keybinds);
}

function saveGamepadBinds() {
    saveToStorage(STORAGE_KEYS.gamepadBinds, gamepadBinds);
}

function loadPlaneMode() {
    return localStorage.getItem(STORAGE_KEYS.planeMode) === "true";
}

function savePlaneMode(enabled) {
    localStorage.setItem(STORAGE_KEYS.planeMode, String(enabled));
}

function loadUiHidden() {
    return localStorage.getItem(STORAGE_KEYS.uiHidden) === "true";
}

function saveUiHidden(hidden) {
    localStorage.setItem(STORAGE_KEYS.uiHidden, String(hidden));
}
