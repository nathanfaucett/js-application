var tape = require("tape"),
    sceneGraph = require("@nathanfaucett/scene_graph"),
    Application = require("..");


var Scene = sceneGraph.Scene,
    Entity = sceneGraph.Entity;


function TestApplication() {

    Application.call(this);

    this.scene = null;
}
Application.extend(TestApplication, "test.TestApplication");

TestApplication.prototype.loop = function() {

    this.scene.update();

    this.emit("loop");

    return this;
};

tape("Application", function(assert) {
    var loopCalled = false,
        application = TestApplication.create()
        .addScene(Scene.create("scene").addEntity(Entity.create()));

    application.scene = application.createScene("scene");

    application.init();

    application.on("pause", function() {
        assert.equals(loopCalled, true);
        assert.end();
    });

    application.on("loop", function() {
        loopCalled = true;
        application.pause();
    });
});