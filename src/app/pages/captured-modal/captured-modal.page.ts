import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

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

  constructor(private navParams: NavParams, private webView: WebView,
    private modalCtrl: ModalController, private camera: Camera, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    let capturedImage = this.navParams.get('image');
    this.pushNewImage(capturedImage);
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
}
