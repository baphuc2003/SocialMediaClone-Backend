// src/utils/data-structures/file-map.ts

// Khởi tạo hash map với key là userId và value là danh sách file
export const fileMap = new Map<string, Express.Multer.File[]>();

// Thêm file vào map theo userId
export const addFileToMap = (userId: string, fileData: Express.Multer.File) => {
  if (!fileMap.has(userId)) {
    fileMap.set(userId, []);
  }
  fileMap.get(userId)?.push(fileData);
};

// Lấy danh sách file theo userId
export const getFilesFromMap = (userId: string) => {
  return fileMap.get(userId) || [];
};

// Xóa file theo userId và index của file trong danh sách
export const deleteFileFromMap = (userId: string, index: number) => {
  const userFiles = fileMap.get(userId);
  if (userFiles && userFiles.length > index) {
    userFiles.splice(index, 1);
    if (userFiles.length === 0) {
      fileMap.delete(userId); // Xóa luôn key nếu không còn file nào
    }
  }
};
