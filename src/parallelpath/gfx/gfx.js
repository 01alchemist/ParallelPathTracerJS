System.register(["./Camera", "./Display", "./Light", "./DirectionalLight", "./PointLight", "./Material", "./PhongMaterial", "./CookTorranceMaterial", "./Scene", "./Tracer", "./TracerObject", "./TraceJob"], function(exports_1) {
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (Camera_1_1) {
                exportStar_1(Camera_1_1);
            },
            function (Display_1_1) {
                exportStar_1(Display_1_1);
            },
            function (Light_1_1) {
                exportStar_1(Light_1_1);
            },
            function (DirectionalLight_1_1) {
                exportStar_1(DirectionalLight_1_1);
            },
            function (PointLight_1_1) {
                exportStar_1(PointLight_1_1);
            },
            function (Material_1_1) {
                exportStar_1(Material_1_1);
            },
            function (PhongMaterial_1_1) {
                exportStar_1(PhongMaterial_1_1);
            },
            function (CookTorranceMaterial_1_1) {
                exportStar_1(CookTorranceMaterial_1_1);
            },
            function (Scene_1_1) {
                exportStar_1(Scene_1_1);
            },
            function (Tracer_1_1) {
                exportStar_1(Tracer_1_1);
            },
            function (TracerObject_1_1) {
                exportStar_1(TracerObject_1_1);
            },
            function (TraceJob_1_1) {
                exportStar_1(TraceJob_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=gfx.js.map