import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { errorMessages } from "../errors";

export function deleteAllFilesFolders(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteAllFilesFolders(currentPath);
      } else {
        fs.unlinkSync(currentPath);
        console.log("File Deleted: " + currentPath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log("Folder Deleted: " + folderPath);
  }
}

export function createFolder(folderPath: string): void {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
}

export function deleteFile(filePath: string) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    } else {
      reject(errorMessages.FILE_NOT_FOUND);
    }
  });
}

export function deleteFolder(folderPath: string) {
  return new Promise((resolve, reject) => {
    if (fsExtra.existsSync(folderPath)) {
      fsExtra.remove(folderPath, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    } else {
      reject(errorMessages.FOLDER_NOT_FOUND);
    }
  });
}

export function checkFileExistsInFolder(folderPath: string) {
  return new Promise((resolve, reject) => {
    return fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(errorMessages.FOLDER_NOT_FOUND);
      } else {
        if (files.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
}

export function checkFolderExists(folderPath: string): boolean {
  return fs.existsSync(folderPath);
}