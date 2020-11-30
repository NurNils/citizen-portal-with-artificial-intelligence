import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.scss'],
})
export class CoronaComponent implements AfterViewInit {
  /** Current population in Baden-Württemberg */
  currentPopulationInBw: number = 11070000;

  /** Current county */
  currentCounty: string = 'Rems-Murr-Kreis';

  /** Current insidenz */
  currentInsidenz: string = '88,8';

  /** PageX */
  pageX: number = 0;

  /** PageY */
  pageY: number = 0;

  /** BW chart */
  bwChart: any;

  /** Overview */
  overview = {
    total: 0,
    recovered: 0,
  };

  /** Counties */
  counties: {name: string, inzidenz: string}[] = [
    {
      name: 'Rems-Murr-Kreis',
      inzidenz: '111,2'
    },
    {
      name: 'Stuttgart',
      inzidenz: '112,5'
    }
  ];

  /** Constructor */
  constructor(private apiService: ApiService) {}

  /**
   * Initializes data
   * @returns {undefined}
   * */
  ngAfterViewInit() {
    this.initChart();
  }

  /**
   * Initializes bw chart
   * @returns {undefined}
   * */
  async initChart() {
    let data = {
      labels: ['10.04.2021', '10.05.2021', '10.06.2021'],
      confirmed: [4, 5, 6],
      deaths: [4, 5, 6],
      recovered: [4, 5, 6],
      active: [4, 5, 6],
      incidentRate: [4, 5, 6],
    };

    const res = await this.apiService.get('corona');
    if (res.status === IResponseStatus.success) {
      data = res.data;
      this.overview = {
        total: data.confirmed[data.confirmed.length - 1],
        recovered: data.recovered[data.recovered.length - 1],
      };
    }

    Chart.register(...registerables);
    this.bwChart = new Chart('bwChart', {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Aktive Fälle',
            data: data.active,
            fill: true,
            borderColor: '#f44336',
            borderWidth: 2,
          },
          {
            label: 'Verstorbene',
            data: data.deaths,
            fill: true,
            borderColor: '#263238',
            borderWidth: 2,
          },
          /*
          {
            label: 'Genesene',
            data: data.recovered,
            fill: true,
            borderColor: '#4caf50',
            borderWidth: 2,
          },
          */
          {
            label: 'Bestätigte Fälle',
            data: data.confirmed,
            fill: true,
            borderColor: '#9c27b0',
            borderWidth: 2,
          },
          {
            label: 'Inzidenz Rate',
            data: data.incidentRate,
            fill: true,
            borderColor: '#2196F3',
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Current corona virus data from the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University',
          },
        },
      },
    });
  }

  /**
   * Loads data from county
   * @param {string} county Name of county which is selected
   * @param {any} event Triggered event
   * @returns {undefined}
   * */
  show(county: string, event: any) {
    this.pageX = event.pageX;
    this.pageY = event.pageY;
    this.currentCounty = county;
    // Enhancement: Update map to selected county
    // document.getElementById('baden-wuerttemberg-map')?.setAttribute('src', `assets/images/maps/${county.toLocaleLowerCase()}.png`);
    
    const loadedCounty = this.counties.filter(e => e.name === county);
    if(loadedCounty && loadedCounty.length == 1) {
      this.currentInsidenz = loadedCounty[0].inzidenz;
    } else {
      const i = `${Math.floor(Math.random() * 4) + 88},8`;
      this.counties.push({
        name: county,
        inzidenz: i
      })
      this.currentInsidenz = i;
    }
  }
}
