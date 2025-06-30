import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApiService } from './ng-api.service';
import { ApiFactoryService, API_CONFIG } from './api-factory.service';
import { ApiConfig } from './models/api-config.model';

@NgModule({
  imports: [CommonModule],
  providers: [NgApiService, ApiFactoryService],
})
export class NgApiModule {
  static forRoot(config: ApiConfig): ModuleWithProviders<NgApiModule> {
    return {
      ngModule: NgApiModule,
      providers: [
        {
          provide: API_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
