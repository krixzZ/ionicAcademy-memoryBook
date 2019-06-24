import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CapturedModalPage } from '../captured-modal/captured-modal.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(private camera: Camera, private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController) { }

  ngOnInit() {
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
      this.modalCtrl.create({
        component: CapturedModalPage,
        componentProps: {
          image: imagePath
        }
      }).then(modal => {
        modal.present();

        modal.onWillDismiss().then(data => {
          if (data.data && data.data['reload']) {
            //RELOAD
          }
        });
      });
    });
  }



}  
