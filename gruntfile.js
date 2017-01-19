module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-dotnet-assembly-info');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-umbraco-package');

    // Load the package JSON file
    var pkg = grunt.file.readJSON('package.json');

    // get the root path of the project
    var projectRoot = 'src/' + pkg.name + '/';
    var webProjectRoot = 'src/' + pkg.name + '.Web/';

    // Load information about the assembly
    var assemblyinfo = {
        options: {
            // Can be solutions, projects or individual assembly info files 
            files: ['src/' + pkg.name + '/Properties/AssemblyInfo.cs'],
            // Standard assembly info 
            info: {
                title: pkg.name,
                description: pkg.description,
                configuration: 'Release',
                company: "",
                product: pkg.name,
                copyright: pkg.license,
                trademark: '',
                culture: 'en-US',
                version: function (value) {
                    // If no value is returned the assembly version will not be modified 
                },
                fileVersion: pkg.version
            }
        }
    }

    // Get the version of the package
    var version = pkg.version;

    grunt.initConfig({
        pkg: pkg,
        clean: {
            temp: ['temp/*']
        },
        copy: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + 'bin/Release/',
                        src: [
                            pkg.name + '.dll',
                            pkg.name + '.xml'                        
                        ],
                        dest: 'temp/bin/'
                    },
                    {
                        expand: true,
                        cwd: projectRoot + 'bin/Release/',
                        src: [
                            'App_Plugins/**',
                        ],
                        dest: 'temp/'
                    }
                ]
            },
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + 'bin/Debug/',
                        src: [
                            pkg.name + '.dll',
                            pkg.name + '.xml'
                        ],
                        dest: webProjectRoot + 'bin/'
                    },
                    {
                        expand: true,
                        cwd: projectRoot + 'bin/Debug/',
                        src: [
                            'App_Plugins/**',
                        ],
                        dest: webProjectRoot
                    }
                ]
            }
        },
        assemblyinfo: assemblyinfo,
        nugetpack: {
            release: {
                src: 'src/' + pkg.name + '/' + pkg.name + '.csproj',
                dest: 'dist/nuget/'
            }
        },
        zip: {
            github: {
                cwd: 'temp/',
                src: [
                    'temp/**/*.*'
                ],
                dest: 'dist/github/' + pkg.name + '.' + version + '.zip'
            }
        },
        umbracoPackage: {
            release: {
                src: 'temp/',
                dest: 'dist/umbraco',
                options: {
                    name: pkg.name,
                    version: version,
                    url: pkg.homepage,
                    license: pkg.license,
                    licenseUrl: pkg.licenseUrl,
                    author: pkg.author.name,
                    authorUrl: pkg.author.url,
                    readme: pkg.readme,
                    outputName: pkg.name + '.' + version + '.zip'
                }
            }
        }
    });

    grunt.registerTask("nuget", ['assemblyinfo', 'copy:release', 'nugetpack']);
    grunt.registerTask("github", ['clean', 'copy:release', 'zip:github']);
    grunt.registerTask("umbraco", ['clean', 'copy:release', 'umbracoPackage']);

    grunt.registerTask('default', ['nuget', 'github', 'umbraco']);

    grunt.registerTask("debug", ['copy:debug']);
}