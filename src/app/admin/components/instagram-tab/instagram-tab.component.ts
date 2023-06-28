import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Influencer } from 'src/app/influencer/models/influencer';
import { TabService } from '../../services/tab.service';
declare var google: any;

@Component({
  selector: 'instagram-tab',
  templateUrl: './instagram-tab.component.html',
  styleUrls: ['./instagram-tab.component.scss']
})
export class InstagramTabComponent implements OnInit {
  influencer!: Influencer;
  constructor(private tabService: TabService) { }

  ngOnInit(): void {
    this.influencer = this.tabService.influencer
    this.chartLoad().subscribe(() => {
      this.drawGender(this.filterGender())
      this.drawGenderAge(this.filterGenderAge())
      this.drawRegionsMap(this.filterRegion())
    })
  }
  chartLoad() {
    return from(google.charts.load('current', { 'packages': ['bar', 'corechart', 'geochart'] }))
  }
  filterGenderAge(): any[] {
    const influencerData = this.influencer.instagram.insights.audience_genderAge
    const genderAges = [['Idade', 'Masculino', 'Feminino', 'Indefinido']]
    for (let genderAge of influencerData) {
      const dataGenderAge = [genderAge.age, parseFloat(genderAge.male), parseFloat(genderAge.female), parseFloat(genderAge.undefined)]
      genderAges.push(dataGenderAge)
    }
    return genderAges
  }
  filterGender(): any[] {
    const influencerData = this.influencer.instagram.insights.audience_age
    const genders: any[] = [['Genero', 'Percentual']]
    for (let gender in influencerData) {
      let dataGender = []
      if (gender == 'female') {
        dataGender = ['Feminino', parseFloat(influencerData[gender])]
      } else if (gender == 'male') {
        dataGender = ['Masculino', parseFloat(influencerData[gender])]
      } else {
        dataGender = ['Indefinido', parseFloat(influencerData[gender])]
      }
      genders.push(dataGender)
    }
    return genders
  }
  filterRegion() {
    const influencerData = this.influencer.instagram.insights.audience_country
    const regions: any[] = [['País', 'Seguidores']]
    for (let country in influencerData) {
      const countryData = [country, influencerData[country]]
      regions.push(countryData)
    }
    return regions
  }

  drawGenderAge(genderAges: any[]) {
    var data = google.visualization.arrayToDataTable(genderAges);

    var options = {
      width: 650,
      height: 300,
      hAxis: {
        textStyle: { color: 'white' },
        titleTextStyle: {
          color: 'white',
          fontSize: 16
        }
      },
      vAxis: {
        title: '% do Gênero',
        textStyle: { color: 'white' },
        titleTextStyle: {
          color: 'white',
          fontSize: 16
        }
      },
      backgroundColor: 'none',
      chartArea: { backgroundColor: '#1d1d1d' },
      legend: { textStyle: { color: 'white' } },
    };
    var chart = new google.charts.Bar(document.getElementById('draw_GenderAge'));
    chart.draw(data, google.charts.Bar.convertOptions(options));

  }


  drawGender(gender: any[]) {
    var data = google.visualization.arrayToDataTable(gender);

    var options = {
      backgroundColor: 'none',
      pieHole: 0.7,
      legend: {
        position: 'labeled',
        textStyle: { color: 'white' },
      },
      width: 520,
      height: 300,
      pieSliceText: 'none'
    };

    var chart = new google.visualization.PieChart(document.getElementById('draw_Gender'));
    chart.draw(data, options);

  }

  drawRegionsMap(regions: any[]) {
    var data = google.visualization.arrayToDataTable(regions);
    var options = {
      backgroundColor: 'none',
      colorAxis: { minValue: 0, colors: ['#90ee90', '#00862D'] },
      legend: {
        textStyle: {
          color: 'black',
          fontSize: 16,
        }
      }
    };
    var chart = new google.visualization.GeoChart(document.getElementById('geoInternational'));
    chart.draw(data, options);
  }


}
