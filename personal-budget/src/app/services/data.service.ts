import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface BudgetItem {
  title: string;
  budget: number;
}

interface BudgetData {
  myBudget: BudgetItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource = {
    datasets: [
      {
        data: [] as number[],
        currentData: 0,
      },
    ],
    labels: [] as string[],
  };

  private dataLoaded = false;
  private dataSubject = new BehaviorSubject<any>(this.dataSource);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchData(): void {
    if (this.dataLoaded && this.dataSource.datasets[0].data.length > 0) {
      this.dataSubject.next({ ...this.dataSource });
      return;
    }

    this.http.get<BudgetData>('http://localhost:3000/budget').subscribe({
      next: (res) => {
        if (res?.myBudget?.length > 0) {
          this.dataSource.datasets[0].currentData = 0;
          this.dataSource.datasets[0].data = [];
          this.dataSource.labels = [];

          for (let i = 0; i < res.myBudget.length; i++) {
            this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
            this.dataSource.labels[i] = res.myBudget[i].title;
            this.dataSource.datasets[0].currentData += res.myBudget[i].budget;
          }

          this.dataLoaded = true;

          this.dataSubject.next({ ...this.dataSource });
          console.log('Updated data source:', this.dataSource);
        }
      },
      error: (error) => {
        console.error('Error fetching budget data:', error);
      },
    });
  }

  getCurrentData(): any {
    return { ...this.dataSource };
  }

  getCurrentTotal(): number {
    return this.dataSource.datasets[0].currentData;
  }
}
