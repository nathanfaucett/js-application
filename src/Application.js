var isString = require("@nathanfaucett/is_string"),
    isNumber = require("@nathanfaucett/is_number"),
    indexOf = require("@nathanfaucett/index_of"),
    Class = require("@nathanfaucett/class"),
    createLoop = require("@nathanfaucett/create_loop"),
    assets = require("@nathanfaucett/assets"),
    sceneGraph = require("@nathanfaucett/scene_graph");


var Scene = sceneGraph.Scene,
    ClassPrototype = Class.prototype,
    ApplicationPrototype;


module.exports = Application;


function Application() {
    var _this = this;

    Class.call(this);

    this.assets = assets.Assets.create();

    this._scenes = [];
    this._sceneHash = {};

    this._loop = createLoop(function loop() {
        _this.loop();
    }, null);

}
Class.extend(Application, "application.Application");
ApplicationPrototype = Application.prototype;

ApplicationPrototype.construct = function() {

    ClassPrototype.construct.call(this);

    return this;
};

ApplicationPrototype.destructor = function() {
    var scenes = this._scenes,
        sceneHash = this._sceneHash,
        i = -1,
        il = scenes.length - 1,
        scene;

    ClassPrototype.destructor.call(this);

    while (i++ < il) {
        scene = scenes[i];
        delete sceneHash[scene.name];
    }
    scenes.length = 0;

    this.assets.destructor();
    this._loop.pause();

    return this;
};

ApplicationPrototype.setElement = function(element) {

    this._loop.setElement(element);

    return this;
};

ApplicationPrototype.init = function() {

    this.emit("init");

    return this;
};

ApplicationPrototype.run = function() {

    this._loop.run();
    this.emit("run");

    return this;
};

ApplicationPrototype.pause = function() {

    this._loop.pause();
    this.emit("pause");

    return this;
};

ApplicationPrototype.resume = function() {

    this._loop.run();
    this.emit("resume");

    return this;
};

ApplicationPrototype.isRunning = function() {
    return this._loop.isRunning();
};

ApplicationPrototype.isPaused = function() {
    return this._loop.isPaused();
};

ApplicationPrototype.loop = function() {
    return this;
};

ApplicationPrototype.createScene = function(scene) {
    var scenes = this._scenes,
        sceneHash = this._sceneHash,
        newScene;

    if (isString(scene)) {
        scene = sceneHash[scene];
    } else if (isNumber(scene)) {
        scene = scenes[scene];
    }

    if (sceneHash[scene.name]) {
        newScene = Scene.create();
        newScene.application = this;
        newScene.fromJSON(scene);

        this.emit("createScene", newScene);

        return newScene;
    } else {
        throw new Error(
            "Application.createScene(scene) Scene could not be found in Application"
        );
    }

    return null;
};

ApplicationPrototype.addScene = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        Application_addScene(this, arguments[i]);
    }

    return this;
};

function Application_addScene(_this, scene) {
    var scenes = _this._scenes,
        sceneHash = _this._sceneHash,
        name = scene.name,
        json;

    if (!sceneHash[name]) {
        json = (scene instanceof Scene) ? scene.toJSON() : scene;

        sceneHash[name] = json;
        scenes[scenes.length] = json;

        _this.emit("addScene", name);
    } else {
        throw new Error("Application addScene(...scenes) Scene is already a member of Application");
    }
}

ApplicationPrototype.removeScene = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        Application_removeScene(this, arguments[i]);
    }

    return this;
};

function Application_removeScene(_this, scene) {
    var scenes = _this._scenes,
        sceneHash = _this._sceneHash,
        json, name;

    if (isString(scene)) {
        json = sceneHash[scene];
    } else if (isNumber(scene)) {
        json = scenes[scene];
    }

    name = json.name;

    if (sceneHash[name]) {

        sceneHash[name] = null;
        scenes.splice(indexOf(scenes, json), 1);

        _this.emit("removeScene", name);
    } else {
        throw new Error("Application removeScene(...scenes) Scene not a member of Application");
    }
}