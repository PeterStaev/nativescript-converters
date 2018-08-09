module.exports = function (grunt) {
    var localConfig = {
        typeScriptDeclarations:[
            "**/*.d.ts",
            "!references.d.ts",
            "!node_modules/**/*.*",
            "!bin/**/*.*"
        ],
        outDir: "bin/dist/"
    }

    grunt.initConfig({
        clean:{
            build:{
                src:[localConfig.outDir]
            }
        },
        copy: {
            declarations: {
                src: localConfig.typeScriptDeclarations,
                dest: localConfig.outDir
            },
            platforms: {
                files: [{ expand: true, src: ["platforms/**"], dest: localConfig.outDir }]
            },
            packageConfig: {
                src: "package.json",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        var contentAsObject = JSON.parse(content);
                        contentAsObject.devDependencies = undefined;
                        contentAsObject.scripts = undefined;
                        return JSON.stringify(contentAsObject, null, "\t");
                    }
                }
            },
            readme: {
                src: "README.md",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        return content.substring(content.indexOf("\n") + 1)
                    }
                }
            }
        },
        exec: {
            tsCompile: "npm run tsc -- --outDir " + localConfig.outDir,
            tslint: "npm run tslint",
            checkRequiredPackageJsonSection: {
                cwd: "bin/dist",
                cmd: function (section) {
                    return "cat package.json | grep -q \"\\\"" + section + "\\\"\"";
                }
            },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask("compile", [
        "clean:build",
        "exec:tsCompile",
        "copy"
    ]);
    
    grunt.registerTask("build", [
        "exec:tslint",
        "compile",
        "copy"
    ]);

    grunt.registerTask("lint", [
        "exec:checkRequiredPackageJsonSection:license",
        "exec:checkRequiredPackageJsonSection:nativescript",
        "exec:tslint",
    ]);

    grunt.registerTask("publish", [
        "build",
        "lint",
        "exec:npm_publish"
    ]);
};
