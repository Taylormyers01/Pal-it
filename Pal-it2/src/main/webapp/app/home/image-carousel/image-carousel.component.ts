import { Component } from '@angular/core';
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'jhi-image-carousel',
  templateUrl: './image-carousel.html',
  // styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class ImageCarouselComponent {
  // showNavigationArrows = false;
  // showNavigationIndicators = false;

  constructor() {

    // config.showNavigationArrows = true;
    // config.showNavigationIndicators = true;

  }






}
