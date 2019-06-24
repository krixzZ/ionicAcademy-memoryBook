import { MemoryService } from './../../services/memory.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-captured-modal',
  templateUrl: './captured-modal.page.html',
  styleUrls: ['./captured-modal.page.scss'],
})
export class CapturedModalPage implements OnInit {

  images = [];

  slideOpts = {
    slidesPerView: 1.3,
    spaceBetween: 5,
    autoHeight: true
  };

  colors = [
    '#91d7ff',
    '#91ffa3',
    '#ff9191',
    '#a991ff'
  ]
  memoryForm: FormGroup;

  constructor(private navParams: NavParams, private webView: WebView,
    private modalCtrl: ModalController, private camera: Camera, private actionSheetCtrl: ActionSheetController,
    private fb: FormBuilder, private memoryService: MemoryService) { }

  ngOnInit() {
    let capturedImage = this.navParams.get('image');
    this.pushNewImage(capturedImage);

    this.memoryForm = this.fb.group({
      title: ['', Validators.required],
      date: new Date().toISOString(),
      text: '',
      color: this.colors[0]
    });
  }

  pushNewImage(path) {
    this.images.push({
      path: this.webView.convertFileSrc(path),
      file: path
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  removeImage(index) {
    this.images.splice(index, 1);
  }

  async selectSource() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });

    actionSheet.present();
  }

  captureImage(sourceType: number) {
    let options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      this.pushNewImage(imagePath);
    });
  }

  openPreview(index) {
    this.modalCtrl.create({
      component: ImagePreviewPage,
      componentProps: {
        image: this.images[index].path
      }
    }).then(modal => modal.present());
  }

  setColor(color) {
    this.memoryForm.patchValue({ color: color });
  }

  saveMemory() {
    let promises = [];

    for (let img of this.images) {
      let oneCopyTask = this.memoryService.saveImage(img.file);
      promises.push(oneCopyTask);
    }

    Promise.all(promises).then(result => {
      console.log('result: ', result);
      let toSave = this.memoryForm.value;
      toSave.images = result;
      toSave.id = Date.now();

      this.memoryService.addMemory(toSave).then(res => {
        this.modalCtrl.dismiss({ reload: true });
      });
    });
  }




}
