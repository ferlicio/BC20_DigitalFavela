import { Component, Input, OnInit } from '@angular/core';
import { from, mergeMap, of } from 'rxjs';
import { Influencer } from 'src/app/influencer/models/influencer';
import { TabService } from '../../services/tab.service';
declare var google: any;

@Component({
  selector: 'youtube-tab',
  templateUrl: './youtube-tab.component.html',
  styleUrls: ['./youtube-tab.component.scss']
})
export class YoutubeTabComponent implements OnInit {
  influencer!: Influencer;
  p: number = 1;
  constructor(private tabService: TabService) { }
  ngOnInit() {
    this.influencer = this.tabService.influencer
    this.chartLoad().subscribe(() => {
      this.setDataChart()
    })
  }

  chartLoad() {
    return from(google.charts.load('current', { 'packages': ['bar', 'corechart', 'geochart'] }))
  }

  drawGender(gender: any[]) {
    if (gender) {
      var data = google.visualization.arrayToDataTable(gender);

      var options = {
        colors: ['#DC3912', '#3366CC'],
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
  }

  drawGenderAge(genderAge: any) {
    if (genderAge) {
      var data = google.visualization.arrayToDataTable(genderAge);

      var options = {
        colors: ['#3366CC', '#DC3912'],
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
  }

  setDataChart() {
    const gender = [['Gênero', 'Percentual']]
    const genderAge = [['Idade', 'Masculino', 'Feminino']]
    const genders = this.influencer.youtube.gender
    const genderAges = this.influencer.youtube.genderAge

    for (let gen in genders) {
      if (gen == 'female') {
        gender.push(['Feminino', genders[gen]])
      } else {
        gender.push(['Masculino', genders[gen]])
      }
    }
    for (let genAge of genderAges) {
      genderAge.push([genAge.age, genAge.male, genAge.female])
    }

    this.drawGender(gender)
    this.drawGenderAge(genderAge)
  }
}
