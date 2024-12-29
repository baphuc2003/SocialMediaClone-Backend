export declare const fileMap: Map<string, Express.Multer.File[]>;
export declare const addFileToMap: (userId: string, fileData: Express.Multer.File) => void;
export declare const getFilesFromMap: (userId: string) => Express.Multer.File[];
export declare const deleteFileFromMap: (userId: string, index: number) => void;
