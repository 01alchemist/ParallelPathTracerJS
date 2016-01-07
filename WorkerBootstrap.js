importScripts(
    "node_modules/systemjs/dist/system.src.js"
);

System.config({
    packages: {
        "src/parallelpath": {
            format: 'register',
            defaultExtension: 'js'
        }
    }
});
System.import('src/parallelpath/worker/TraceWorker2').then(null, console.error.bind(console));