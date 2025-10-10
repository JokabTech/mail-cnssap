import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import * as datalabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, datalabels);

@Component({
  selector: 'app-analytics-component',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics-component.html',
  styleUrl: './analytics-component.scss'
})
export class AnalyticsComponent implements OnInit, OnChanges {

  @Input() late = 0
  @Input() onTime = 0
  @Input() pieChartType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['late'] || changes['onTime']) {
      this.pieChartData.datasets[0].data = [this.late, this.onTime];
      this.pieChartData = { ...this.pieChartData };
    }
  }

  ngOnInit(): void {
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Répartition des budgets par catégorie'
      },
      datalabels: {
        formatter: (value, ctx) => {
          // Calcul du pourcentage
          const data = ctx.chart.data.datasets[0].data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return percentage + '%';
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        }
      }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Hors délai', 'Dans le délai'],
    datasets: [
      {
        data: [this.late, this.onTime],
        label: ' Nombre',
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',

        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',

        ],
        datalabels: {
          anchor: 'center',
          align: 'center',
          offset: 0,
        }
      }
    ]
  };
}
