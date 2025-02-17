import { Component, AfterViewInit } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'aw-homepage',

  imports: [ArticleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements AfterViewInit {
  public dataSource: {
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
    labels: string[];
  } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#4bc0c0',
          '#9966ff',
          '#ffcc99',
          '#99e6e6',
          '#6666ff',
          '#ff6666',
          '#ffcc66',
          '#ccff66',
        ],
      },
    ],
    labels: [],
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
  }
  public chart: any;

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'pie',
      data: this.dataSource,
    });
  }
}
