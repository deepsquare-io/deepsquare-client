export declare function writeFile(filepath: string, content: string): Promise<void>;
export declare function readFile(filepath: string): Promise<string>;
export declare function unlinkFile(filePath: string, cb?: (err?: Error) => any): void;
export declare function mkdirp(filePath: string): Promise<string>;
