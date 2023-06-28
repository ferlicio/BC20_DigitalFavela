import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'insta-photo',
  templateUrl: './insta-photo.component.html',
  styleUrls: ['./insta-photo.component.scss']
})
export class InstaPhotoComponent implements OnInit {
  @Input()
  instagram: any
  @Input()
  media: any

  constructor() { }

  ngOnInit(): void {
  }
}
