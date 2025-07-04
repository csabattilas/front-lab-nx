import { Injectable, effect, signal } from '@angular/core';

@Injectable()
export class PerformanceService {
  public checkedCount = signal({
    nodeVariantName: '',
    count: 0,
  });

  private startTimestamp = 0;

  // @ts-expect-error: TS6133
  private readonly onCheckedChangeEffect = effect(() => {
    console.log('checked count', this.checkedCount());
  });

  public updateCheckedCount(nodeVariantName: string): void {
    this.checkedCount.update(data => ({
      nodeVariantName,
      count: data.count + 1,
      timestamp: new Date().getTime() - this.startTimestamp,
    }));
  }

  public resetCheckedCount(): void {
    this.checkedCount.set({
      nodeVariantName: '',
      count: 0,
    });

    this.startTimestamp = new Date().getTime();
  }
}
