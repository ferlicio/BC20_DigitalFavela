import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { mergeMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Influencer } from '../../models/influencer';
import { InfluencerService } from '../../services/influencer.service';


@Component({
  selector: 'app-redes',
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent implements OnInit {
  influencer!: Influencer
  completedRegister!: boolean
  selectedNetwork!: string
  socialNetworks: any = [
    {
      name: 'instagram',
      icon: 'assets/img/instagram.svg',
      link: '',
      connection: ''
    },
    {
      name: 'twitter',
      icon: 'assets/img/twitter.svg',
      link: '',
      connection: ''
    },
    {
      name: 'youtube',
      icon: 'assets/img/youtube.svg',
      link: '',
      connection: ''
    },
    /*     {
          name: 'Tiktok',
          icon: 'assets/img/tiktok.svg',
          link: '',
          connection: ''
        } */
  ]
  constructor(
    private title: Title,
    private authService: AuthService,
    private influencerService: InfluencerService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle("DigitalFavela - Redes Sociais");
    this.loadInfluencer();

  }


  loadInfluencer() {
    this.authService.logged.pipe(mergeMap((user) => {
      return this.influencerService.getInfluencer(user?.uid!)
    })).subscribe((res) => {
      this.influencer = res
      this.socialNetworks = [
        {
          name: 'Instagram',
          icon: 'assets/img/instagram.svg',
          link: 'https://www.facebook.com/v14.0/dialog/oauth?client_id=791550661977778&redirect_uri=http://localhost:4200/callback/fb&state=1234567&scope=public_profile,email,instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list,ads_management&response_type=code,granted_scopes',
          connection: this.influencer?.instagram ? true : false
        },
        {
          name: 'Twitter',
          icon: 'assets/img/twitter.svg',
          link: 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MFZ2Um1acm83LVEyNFZJME1WZnU6MTpjaQ&redirect_uri=http://localhost:4200/callback/tw&scope=tweet.read%20users.read%20follows.read%20offline.access%20like.read%20bookmark.read&state=state&code_challenge=challenge&code_challenge_method=plain',
          connection: this.influencer?.twitter ? true : false
        },
        {
          name: 'Youtube',
          icon: 'assets/img/youtube.svg',
          link: 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/youtubepartner-channel-audit&access_type=offline&include_granted_scopes=true&state=DigitalFavela&redirect_uri=http://localhost:4200/callback/yt&response_type=code&client_id=320255043611-kbn9m1801nms4ulnahre2heebk3b88st.apps.googleusercontent.com',
          connection: this.influencer?.youtube ? true : false
        },
        /*         {
                  name: 'Tiktok',
                  icon: 'assets/img/tiktok.svg',
                  link: '',
                  connection: this.influencer?.tiktok ? true : false
                } */
      ]
    })
  }


  openSocial(link: string) {
    parent.window.location.href = link
  }


  popupWindow(url: string, windowName: string) {
    let win = window
    const y = win.top!.outerHeight / 2 + win.top!.screenY - (800 / 2);
    const x = win.top!.outerWidth / 2 + win.top!.screenX - (800 / 2);
    return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=800, height=800, top=${y}, left=${x}`);
  }

  disconnectSocial(socialNetwork: string) {
    return this.influencerService.deleteSocialNetwork(this.influencer.id!, socialNetwork).subscribe(influ => {

    })
  }


}

