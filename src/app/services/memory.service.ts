import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const MEMORY_KEY = 'my_memories';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor(private file: File, private storage: Storage, private wenView: WebView) { }

  saveImage(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let folderPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

    if (currentName.indexOf('?') > -1) {
      currentName = currentName.substr(0, currentName.lastInexOf('?'));
    }

    return this.copyFileToLocalDir(folderPath, currentName, `${new Date().getTime()}.jpg`)
  }

  copyFileToLocalDir(folderPath, currentName, newFileName) {
    return this.file.copyFile(folderPath, currentName, this.file.dataDirectory, newFileName).then(success => {
      return newFileName
    }, error => {
      console.log('error', error);
    });
  }

  addMemory(memory) {
    return this.storage.get(MEMORY_KEY).then(memories => {
      if (!memories) {
        return this.storage.set(MEMORY_KEY, [memory]);
      } else {
        memories.push(memory);
        return this.storage.set(MEMORY_KEY, memories);
      }
    });
  }
}
