"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdirp = exports.unlinkFile = exports.readFile = exports.writeFile = void 0;
const fs_1 = require("fs");
const { writeFile: fsWriteFile, readFile: fsReadFile, mkdir } = fs_1.promises;
function writeFile(filepath, content) {
    return fsWriteFile(filepath, content);
}
exports.writeFile = writeFile;
function readFile(filepath) {
    return fsReadFile(filepath, 'utf-8');
}
exports.readFile = readFile;
function unlinkFile(filePath, cb) {
    (0, fs_1.unlink)(filePath, cb);
}
exports.unlinkFile = unlinkFile;
function mkdirp(filePath) {
    return mkdir(filePath, { recursive: true });
}
exports.mkdirp = mkdirp;
