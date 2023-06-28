import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Influencer } from 'src/app/influencer/models/influencer';
import { InfluencerService } from 'src/app/influencer/services/influencer.service';
declare var google: any

@Component({
  selector: 'app-graphic-from-influencers',
  templateUrl: './graphic-from-influencers.component.html',
  styleUrls: ['./graphic-from-influencers.component.scss']
})
export class GraphicFromInfluencersComponent implements OnInit {

  constructor(private influencerService: InfluencerService, private route: Router) { }

  influencers: Influencer[] = [];

  ngOnInit(): void {
    this.chartLoad();
    this.carregarInfluencers();
    this.setDataChart();
  }

  chartLoad() {
    return from(google.charts.load('50', { packages: ['corechart', 'geochart'] }));
  }

  setDataChart() {
    this.drawCategorias(this.filtrarCategorias());
    this.drawFaixaEtaria(this.filtrarFaixaEtaria());
    this.drawGenero(this.filtrarGenero());
    this.drawEtnia(this.filtrarEtnia());
    this.drawIndigena(this.filtrarIndigena());
    this.drawRegionsMap(this.filtrarRegiao());
  }

  drawRegionsMap(contRegiao: any[]) {
    var data = google.visualization.arrayToDataTable(contRegiao);

    var view = new google.visualization.DataView(data)
    view.setColumns([0, 1])

    var options = {
      region: 'BR',
      resolution: 'provinces',
      backgroundColor: 'none',
      datalessRegionColor: '#ebcfc4',
      colorAxis: { colors: ['#bbffb9', '#74d175', '#65c368', '#006400'] },
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById('draw_regioes'));
    chart.draw(view, options);
  };

  filtrarRegiao() {
    let contRegiao: any[][] = [['Estado', 'Quantidade']];
    let arrRegioes = []
    let cont: any = {}

    for (const i of this.influencers) {
      if (i.estado) {
        arrRegioes.push("BR-" + i.estado)
      }
    }

    for (let regiao of arrRegioes) {
      if (cont[regiao]) {
        cont[regiao] += 1;
      } else {
        cont[regiao] = 1;
      }
    }

    for (let regiao in cont) {
      '15'
      contRegiao.push([regiao, cont[regiao]]);
    }

    return contRegiao;
  }

  drawCategorias(categorias: any[][]) {
    var data = google.visualization.arrayToDataTable(categorias);

    var view = new google.visualization.DataView(data);

    var options = {
      bar: { groupWidth: '70%' },
      legend: { position: 'none' },
      backgroundColor: 'black',
      animation: {
        duration: 1000,
        easing: 'linear',
        startup: true,
      },
      chartArea: { width: '90%', height: '70%' },
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: '13'
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '13'
        },
      },
      vAxis: {
        gridlines: { multiple: 1 },
        textStyle: {
          color: 'white',
          fontSize: '10',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '10'
        },
      },
    };
    var chart = new google.visualization.ColumnChart(
      document.getElementById('draw_categorias')
    );
    chart.draw(view, options);
  }

  filtrarCategorias() {
    let contCategorias: any[][] = [['Categoria', 'Quantidade', { role: 'style' }]];
    let arrCategorias = [];
    let cont: any = [];

    for (let influencer of this.influencers) {
      let influencerCategorias = influencer.categoriasInstagram;
      for (const i of influencerCategorias) {
        if (i.length > 0) {
          arrCategorias.push(i);
        }
      }
    }

    for (let c of arrCategorias) {
      if (cont[c]) {
        cont[c] += 1;
      } else {
        cont[c] = 1;
      }
    }

    for (let c in cont) {
      contCategorias.push([c, cont[c], "#7ED957"])
    }


    return contCategorias;
  }

  drawIndigena(contIndigena: any[]) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows(contIndigena);


    var options = {
      colors: ['#00862d', '#7ED957'],
      backgroundColor: 'black',
      chartArea: { width: '90%', height: '70%' },
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: '20',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '20',
        },
      },
      legend: {

        textStyle: {
          color: 'white',
          fontSize: '25',
        },
      },
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('draw_indigena')
    );
    chart.draw(data, options);
  }

  filtrarIndigena() {
    let contIndigena: any[] = []
    let qtdIndigena = 0;
    let qtdNaoIndio = 0;

    for (let influencer of this.influencers) {
      if (influencer.indigena == 'true') {
        qtdIndigena++;
      }
    }
    qtdNaoIndio = this.influencers.length - qtdIndigena;

    contIndigena.push(["Indígena", qtdIndigena], ["Não indígena", qtdNaoIndio])

    return contIndigena;
  }

  drawFaixaEtaria(contFaixaEtaria: any[][]) {
    var data = google.visualization.arrayToDataTable(contFaixaEtaria);

    var view = new google.visualization.DataView(data);
    view.setColumns([
      0,
      1,
      {
        calc: 'stringify',
        sourceColumn: 1,
        type: 'string',
        role: 'annotation',
      },
      2,
    ]);

    var options = {
      bar: { groupWidth: '40%' },
      chartArea: { width: '85%', height: '70%' },
      legend: { position: 'none' },
      backgroundColor: 'black',
      animation: {
        duration: 1000,
        easing: 'linear',
        startup: true,
      },
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: '13',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '13',
        },
      },
      vAxis: {
        textStyle: {
          color: 'white',
          fontSize: '13',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '13',
        },
      },
    };

    var chart = new google.visualization.BarChart(
      document.getElementById('draw_faixaEtaria')
    );
    chart.draw(view, options);
  }

  filtrarFaixaEtaria() {
    let contFaixaEtaria: any[][] = [['Faixa Etária', 'Quantidade', { role: 'style' }]];
    let arrIdade = [];
    let cont: any = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0
    };

    for (let influencer of this.influencers) {
      const dataNascStr = influencer.dataNascimento;
      const dataNasc = new Date();
      const dataAtual = new Date();

      dataNasc.setFullYear(parseInt(dataNascStr.substring(6)));
      dataNasc.setMonth(parseInt(dataNascStr.substring(3, 4)));
      dataNasc.setDate(parseInt(dataNascStr.substring(0, 1)));

      arrIdade.push(parseInt(((dataAtual.getTime() - dataNasc.getTime()) / 31536000000).toFixed()))
    }

    for (let i of arrIdade) {
      if (i >= 18 && i <= 25) {
        cont.a++
      } else if (i >= 26 && i <= 30) {
        cont.b++
      } else if (i >= 31 && i <= 35) {
        cont.c++
      } else if (i >= 36 && i <= 40) {
        cont.d++
      } else if (i >= 41 && i <= 50) {
        cont.e++
      } else {
        cont.f++
      }
    }
    for (let c in cont) {

      if (c == "a") {
        contFaixaEtaria.push(["18-25", cont[c], "#FC336C"])
      } else if (c == "b") {
        contFaixaEtaria.push(["26-30", cont[c], "#FC336C"])
      } else if (c == "c") {
        contFaixaEtaria.push(["31-35", cont[c], "#FC336C"])
      } else if (c == "d") {
        contFaixaEtaria.push(["36-40", cont[c], "#FC336C"])
      } else if (c == "e") {
        contFaixaEtaria.push(["41-50", cont[c], "#FC336C"])
      } else if (c == "f") {
        contFaixaEtaria.push(["+50", cont[c], "#FC336C"])
      }

    }


    return contFaixaEtaria;
  }

  drawEtnia(contEtnia: [][]) {
    var data = google.visualization.arrayToDataTable(contEtnia);

    var options = {
      colors: [
        '#d6bcba',
        '#643126',
        '#ebcfc4',
        '#a16057',
        '#240c04',
      ],
      chartArea: { width: '90%', height: '70%' },
      pieHole: 0.4,
      backgroundColor: 'black',
      animation: {
        duration: 1000,
        easing: 'in',
        startup: true,
      },
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: '20',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '20',

        },
      },
      legend: {
        position: 'left',
        textStyle: {
          color: 'white',
          fontSize: '25',

        },
      },
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('draw_etnia')
    );
    chart.draw(data, options);
  }

  filtrarEtnia() {
    let contEtnia: any[] = [['Etnia', 'Quantidade']];
    let arrEtnia = [];
    let cont: any = {}


    for (const influencer of this.influencers) {
      arrEtnia.push(influencer.etnia);
    }

    for (let etnia of arrEtnia) {
      if (cont[etnia]) {
        cont[etnia] += 1;
      } else {
        cont[etnia] = 1;
      }
    }

    for (let etnia in cont) {
      contEtnia.push([etnia, cont[etnia]]);
    }

    return contEtnia;
  }

  drawGenero(contGenero: any[][]) {
    var data = google.visualization.arrayToDataTable(contGenero);

    var options = {
      colors: [
        '#FF004F',
        '#FF5C97',
        '#ff69b4',
        '#FF93CF',
        '#e57d90',
        '#fdb4bf',
      ],
      chartArea: { width: '90%', height: '70%' },
      pieHole: 0.6,
      backgroundColor: 'black',
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: '20',
        },
        titleTextStyle: {
          color: 'white',
          fontSize: '20',
        },
      },
      legend: {
        position: 'left',
        textStyle: {
          color: 'white',
          fontSize: '25',
        },
      },
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('draw_genero')
    );
    chart.draw(data, options);
  }

  filtrarGenero() {
    let contGenero: any[] = [['Genero', 'Quantidade'],];
    let arrGenero = []
    let cont: any = {}
    for (let influencer of this.influencers) {
      arrGenero.push(influencer.genero);
    }

    for (let g of arrGenero) {
      if (cont[g]) {
        cont[g] += 1;
      } else {
        cont[g] = 1;
      }
    }

    for (const g in cont) {
      contGenero.push([g, cont[g]])
    }

    return contGenero;
  }

  carregarInfluencers() {

    this.influencerService.getInfluencers().subscribe((influencers) => {
      for (let influencer of influencers) {
        this.influencers.push(influencer);
      }
      this.chartLoad().subscribe(() => {
        this.setDataChart()
      })
    });
  }

}
