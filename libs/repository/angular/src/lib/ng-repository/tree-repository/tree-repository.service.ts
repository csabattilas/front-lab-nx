import { Injectable, inject, resource, ResourceRef } from '@angular/core';
import { map, firstValueFrom, catchError } from 'rxjs';
import { NgApiService } from '@front-lab-nx/ng-api';
import { TreeNode } from '@front-lab-nx/ng-form';
import { TreeApiResponse } from './tree-repository-dto.model';
import { deserializeTreeData } from './tree-response-deserializer';

@Injectable({
  providedIn: 'root',
})
export class TreeRepositoryService {
  private readonly apiService: NgApiService = inject(NgApiService);

  public getTreeDataResource(
    apiEndpoint?: string
  ): ResourceRef<TreeNode[] | undefined> {
    const endpoint = apiEndpoint ?? 'tree';
    return resource<TreeNode[] | undefined, void>({
      loader: async () =>
        await firstValueFrom(
          this.apiService.get<TreeApiResponse>(endpoint).pipe(
            map(data => deserializeTreeData(data)),
            catchError((error: unknown) => {
              throw new Error(`Cannot fetch data due to error ${error}`);
            })
          )
        ),
    });
  }
}
