import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Influencer } from 'src/app/influencer/models/influencer';
import { InfluencerService } from 'src/app/influencer/services/influencer.service';
import { FirestoreQuery } from 'src/app/models/firestore-query';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  influencers: Influencer[] = []
  allInfluencers: Influencer[] = []
  option: string[] = []
  generos: string[] = ['Homem Cisgênero', 'Mulher Cisgênero', 'Homem Trans', 'Mulher Trans', 'Não-binário', 'Outros']
  etnias: string[] = ['Branco', 'Negro', 'Pardo', 'Indígina', 'Amarelo', 'Outro']
  categoriasInstagram: string[] = ['Turismo', 'Moda', 'Beleza', 'Maquiagem', 'Skin care', 'Games', 'Literatura', 'Educação', 'Empreendedorismo', 'Cultura', 'Música', 'Culinária', 'Política', 'Questões Raciais', 'Comportamento', 'Sexualidade', 'Body Positive', 'Autoestima', 'Decoração', 'Diy - Faça você mesmo', 'Ciência', 'Saúde', 'Tecnologia', 'Humor', 'Entreterimento', 'Artesanato', 'Viagem', 'Negócios', 'Maternidade', 'Paternidade', 'Artes', 'Bem-estar', 'Drinks', 'Bebidas', 'Feminismo', 'Esportes', 'Carros', 'Donas de casa', 'Alimentação saudável', 'Veganismo', 'Pets']
  redesSociais: string[] = ['YouTube', 'Instagram', 'Twitter']
  p: number = 1;

  constructor(private influencerService: InfluencerService, private fb: FormBuilder, private title: Title, private route: Router, private tabService: TabService) { }

  formFiltros: FormGroup = this.fb.group({
    cadastroFinalizado: ['default'],
    genero: ['default'],
    etnia: ['default'],
    indigina: ['default'],
    categoriasInstagram1: ['default'],
    categoriasInstagram2: ['default'],
    categoriasInstagram3: ['default'],
    redesSociais: ['default'],
  })

  ngOnInit(): void {
    this.carregarInfluencers(),
      this.title.setTitle("DigitalFavela - Dashboard");
  }

  carregarInfluencers() {
    this.influencerService.getInfluencersStatusCompleted().subscribe(
      (influencers) => {
        this.influencers = [];
        this.allInfluencers = []
        for (let influencer of influencers) {
          this.influencers.push(influencer);
          this.allInfluencers.push(influencer);
        }
      }
    )
  }

  filter() {
    const querySelectors: FirestoreQuery[] = []
    this.option = []
    for (let propriedade in this.formFiltros.value) {
      if (this.formFiltros.value[propriedade] && this.formFiltros.value[propriedade] !== 'default') {
        if (propriedade.includes("categoriasInstagram")) {
          this.option.push(this.formFiltros.value[propriedade])
        }else if(propriedade == 'redesSociais'){
            const query3: FirestoreQuery = {
              property: this.formFiltros.value[propriedade].toLowerCase(),
              operator: '!=',
              value: null
            }
            querySelectors.push(query3)
        }
        else {
          const query: FirestoreQuery = {
            property: propriedade,
            operator: '==',
            value: this.formFiltros.value[propriedade]
          }
          querySelectors.push(query)
        }
      }
    }
    
    if (this.option.length > 0) {
      const query2: FirestoreQuery = {
        property: "categoriasInstagram",
        operator: 'array-contains-any',
        value: this.option
      }
      querySelectors.push(query2)
    }

    this.influencerService.dinamicQuery(querySelectors).subscribe((x) => {
      this.influencers = [];
      for (let influencer of x) {
        if (this.formFiltros.value.cadastroFinalizado == "default") {
          if (influencer.cadastroFinalizado == "true") {
            if (this.option.length >= 2) {
              if (this.checker(influencer.categoriasInstagram, this.option)) {
                this.influencers.push(influencer)
              }
            } else {
              this.influencers.push(influencer);
            }
          }
        }
        else {
          this.influencers.push(influencer);
        }
      }
    })
  }

  clearFilter() {
    this.carregarInfluencers();
    this.formFiltros.setValue({
      cadastroFinalizado: 'default',
      genero: 'default',
      etnia: 'default',
      indigina: 'default',
      categoriasInstagram1: 'default',
      categoriasInstagram2: 'default',
      categoriasInstagram3: 'default',   
      redesSociais: 'default',
    });
    this.option = []
  }

  showInfluencer(influencer: Influencer) {
    this.tabService.setInfluencer(influencer)
    if (influencer.instagram) {
      this.route.navigateByUrl(`admin/dashboard/${influencer.id}/insta`)
    }
    else if (influencer.youtube) {
      this.route.navigateByUrl(`admin/dashboard/${influencer.id}/yt`)
    }
    else if (influencer.twitter) {
      this.route.navigateByUrl(`admin/dashboard/${influencer.id}/tw`)
    } else {
      this.route.navigateByUrl(`admin/dashboard/${influencer.id}`)
    }
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const formataStr = (a: string) => a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    this.influencers = this.allInfluencers.filter( influ => {
      return formataStr(influ.nome).includes(formataStr(value));
    })
  }

  checker(arr: string[], target: string[]): boolean {
    return target.every(v => arr.includes(v))
  };
}