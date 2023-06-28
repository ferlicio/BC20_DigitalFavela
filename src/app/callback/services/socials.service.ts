import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialsService {
  facebookUrl: string = 'https://us-central1-api-test-9fbf3.cloudfunctions.net/facebook'
  twitterUrl: string = 'https://us-central1-api-test-9fbf3.cloudfunctions.net/twitter'
  youtubeUrl: string = 'https://us-central1-api-test-9fbf3.cloudfunctions.net/youtube'

  constructor(private http: HttpClient) { }

  facebookCreateCollection(code: string, uid: string) {
    return this.http.post(this.facebookUrl, { code, uid })
  }

  twitterCreateCollection(code: string, uid: string) {
    return this.http.post(this.twitterUrl, { code, uid })
  }
  youtubeCreateCollection(code: string, uid: string) {
    return this.http.post(this.youtubeUrl, { code, uid })
  }
}
