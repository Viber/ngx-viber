import { Component } from '@angular/core';
import { VbrLanguageInfoService } from '@viberlab/translate';

@Component({
  selector: 'vbr-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss']
})

export class VbrFooterComponent {
  public FOOTER_ELEMENTS = [
    {
      title: 'viber',
      elements: ['get_viber', 'viber_out', 'blog', 'media_kit']
    },
    {
      title: 'business',
      elements: ['public_accounts', 'promotional_stickers', 'advertising', 'resellers', 'service_messages']
    },
    {
      title: 'developers',
      elements: ['documentation', 'releases', 'blog-dev', 'partners']
    },
    {
      title: 'general',
      elements: ['faq', 'about', 'support', 'terms', 'facebook', 'twitter']
    },
  ];

  public year = {'year': new Date().getFullYear()};

  constructor(public languages: VbrLanguageInfoService) {
  }
}
