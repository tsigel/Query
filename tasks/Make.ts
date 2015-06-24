/// <reference path="../type/fs-extra.d.ts" />
/// <reference path="../type/es6-promise.d.ts" />

import fs = require('fs-extra');
import path = require('path');
import PromiseModule = require('es6-promise');
var Promise = PromiseModule.Promise;

class Make {

    private path:string = path.join('..');

    private tasks = ['dom', 'events', 'css', 'animation'];

    private paths = {
        dom: {
            path: path.join('src/Query-dom.js'),
            name: 'Query-dom.js'
        },
        events: {
            path: path.join('src/Query-events.js'),
            name: 'Query-events.js'
        },
        css: {
            path: path.join('src/Query-css.js'),
            name: 'Query-css.js'
        },
        animation: {
            path: path.join('src/Query-animation.js'),
            name: 'Query-animation.js'
        },
        build: path.join('build')
    };

    public dom():Promise<{}> {
        return Make.copy(this.paths.dom.path, path.join(this.paths.build, this.paths.dom.name));
    }

    public build(tasks, callback):void {

        if (!fs.existsSync('build')) {
            fs.mkdirpSync(('build'));
        }

        tasks = this.checkTasks(tasks);

        this.dom().then(() => {

            console.log('dom');

            Make.read(path.join(this.paths.build, this.paths.dom.name)).then((domSource:string) => {
                return Promise.all(tasks.map((task:string) => {
                    return this.make(this.paths[task].path);
                })).then((filesSources:Array<string>) => {
                    filesSources.unshift(domSource);
                    return Make.concat(filesSources);
                }).then((fileText:string) => {
                    Make.write(path.join(this.paths.build, 'query.js'), fileText).then(callback);
                });
            });
        });

    }

    private checkTasks(tasks:Array<string>) {
        return tasks.filter((task) => {
            if (this.tasks.indexOf(task) == -1) {
                console.warn('Неожиданный таск!');
                return false;
            } else {
                return true;
            }
        }).filter((task:string) => (task !== 'dom'));
    }

    private make(filePath:string):Promise<string> {

        return Make.read(filePath).then((fileText:string) => {

            var files = (filePath.match(/\/\/\/IMPORT:(.+)/g) || []).map((localPath) => {
                return Make.read(path.join(this.path, localPath))
            });

            return Promise.all(files).then((filestexts:Array<string>) => {
                fileText.replace(/\/\/\/IMPORT:(.+)/, filestexts.shift());
                return fileText;
            });

        });

    }

    private static concat(sources:Array<string>):string {
        return sources.join('\n');
    }

    private static copy(from:string, to:string):Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.copy(from, to, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    private static read(path:string):Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', function (err, text:string) {
                if (err) {
                    reject(err);
                } else {
                    resolve(text);
                }
            });
        });
    }

    private static write(path:string, data:string):Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, 'utf-8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}

interface IVoidCallback {
    ():void;
}

var maker = new Make();
export = maker;