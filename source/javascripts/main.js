/*
 * index.js
 * */


(function(global) {

    var $ = require("jquery");
    var THREE = require("threejs");
    require("./lib/TrackballControls.js");
    var dat = require("exports?dat!dat-gui");

    var app, App = function(id) {
        app = this;
        app.init(id);
    };

    App.prototype = {

        init : function(id) {

            app.scene = new THREE.Scene();
            
            app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
            app.camera.position.z = 10;

            app.renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });
            app.renderer.setClearColor(0xffffff);
            app.renderer.setSize(window.innerWidth, window.innerHeight);
            $(id).append(app.renderer.domElement);

            app.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.ShaderMaterial({
                    vertexShader : require("../shaders/template.vert"),
                    fragmentShader : require("../shaders/template.frag"),
                    uniforms : {
                        time    : { type : "f", value : 0.0 },
                        noiseSpeed   : { type : "f", value : 1.0 },
                        noiseScale : { type : "f", value : 1.0 },
                    }
                })
            );
            app.mesh.scale.set(5, 5, 5);

            app.scene.add(app.mesh);

            app.clock = new THREE.Clock();
            app.trackballControls = new THREE.TrackballControls(app.camera, app.renderer.domElement);
            app.trackballControls.minDistance = 6;
            app.trackballControls.maxDistance = 20;

            var effectController = {
                noiseSpeed : 1.0,
                noiseScale : 1.0
            };

            var matChanger = function() {
                app.mesh.material.uniforms.noiseSpeed.value = effectController.noiseSpeed;
                app.mesh.material.uniforms.noiseScale.value = effectController.noiseScale;
            };

            var gui = new dat.GUI();
			gui.add(effectController, "noiseSpeed", 0.01, 5.0, 0.01 ).onChange(matChanger);
			gui.add(effectController, "noiseScale", 0.01, 5.0, 0.01 ).onChange(matChanger);
			gui.close();

            $(window).on('resize', function() { app.resize(); });

            app.loop();
        },

        loop : function() {
            requestAnimationFrame(function() { app.loop(); });

            var delta = app.clock.getDelta();
            app.trackballControls.update(delta);
            app.mesh.material.uniforms.time.value = app.clock.elapsedTime;

            app.renderer.render(app.scene, app.camera);
        },

        resize : function() {
            var w = window.innerWidth;
            var h = window.innerHeight;
            app.camera.aspect = w / h;
            app.camera.updateProjectionMatrix();
            app.renderer.setSize(w, h);
        }

    };
    
    $(function() {
        var app = new App("#viewer");
    });

})(this);


