import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.scss']
})
export class YoutubeVideoComponent implements OnInit {
@ViewChild('videoYT')
videoYT!:ElementRef;

  @Input()
  video: any
  @Input()
  youtube: any
  stopVideo(){
  const src = this.videoYT.nativeElement.src
  this.videoYT.nativeElement.src =''
  this.videoYT.nativeElement.src =src
  }
  constructor() { }

  ngOnInit(): void {
  }

}
