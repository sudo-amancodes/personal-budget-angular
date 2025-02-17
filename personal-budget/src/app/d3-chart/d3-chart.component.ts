import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'aw-d3-chart',
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.scss'],
})
export class D3ChartComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  data: any = {
    datasets: [
      {
        data: [],
        currentData: 0,
      },
    ],
    labels: [],
  };

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription = this.dataService.data$.subscribe({
        next: (newData) => {
          if (newData?.datasets[0]?.data?.length > 0) {
            this.data = { ...newData };
            this.createChart();
          }
        },
        error: (error) => console.error('Subscription error:', error),
      });

      this.dataService.fetchData();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private createChart(): void {
    if (this.data.datasets[0].data.length > 0) {
      console.log('Creating chart with data:', this.data);
      const dataset = this.data.datasets[0].data;
      const labels = this.data.labels;
      this.buildSimpleBarChart(dataset, labels);
    } else {
      console.warn('No data available for chart creation');
    }
  }

  private buildSimpleBarChart(values: number[], labels: string[]): void {
    d3.select('#d3chart').selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };

    const svg = d3
      .select('#d3chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3
      .scaleBand()
      .domain(labels)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const tooltip = d3
      .select('#d3chart')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '10px')
      .style('border-radius', '3px');

    svg
      .selectAll('.bar')
      .data(values)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(labels[i]) || 0)
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d))
      .attr('fill', 'steelblue')
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('fill', '#ff7f0e');

        tooltip
          .style('visibility', 'visible')
          .html(`Amount: $${d}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('fill', 'steelblue');

        tooltip.style('visibility', 'hidden');
      });

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom / 3)
      .text('Budget Categories');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 2)
      .attr('x', -(height / 2))
      .text('Amount ($)');
  }
}
