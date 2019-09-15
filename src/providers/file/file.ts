import { Injectable } from '@angular/core';
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";


@Injectable()
export class FileProvider {

  fileSize: number;

  _directoryPath: string;

  _filePath: string;

  _fileName: string;

  _fileExtension: string;



  constructor(
    private file: File,
    private filePath: FilePath,
  ) {}



  async getFileMetaData(selectedFile: string) {
    this._filePath = await this.filePath.resolveNativePath(selectedFile);                       // Get selected full file path
    this._directoryPath = this._filePath.substr(0, this._filePath.lastIndexOf('/'));      // Get directory Path
    this._fileName = this._filePath.substr((this._filePath.lastIndexOf('/') + 1));              // Get File name
    this._fileExtension = this._fileName.substr(this._fileName.indexOf('.'));                   // Get File Extension
    //let fileSize = 0;
    const  localFile = await  this.file.resolveLocalFilesystemUrl(selectedFile);                // Get File Size
    localFile.getMetadata(metadata => {
      this.fileSize = metadata.size;
    });

    return {
      fileName: this._fileName,
      fileSize: this.fileSize,
      fileExtension: this._fileExtension,
    }

  }


  async getBinaryString () {
    return await this.file.readAsBinaryString(this._directoryPath, this._fileName);
  }




}
