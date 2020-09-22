import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VBR_STORAGE_PREFIX, VBR_WINDOW } from './constants';

export interface VbrStorageModuleConfig {
  window?: Window;
  prefix?: string;
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {provide: VBR_WINDOW, useValue:  window || null},
    {provide: VBR_STORAGE_PREFIX, useValue: ''}
  ]
})
export class VbrStorageModule {
  static forRoot(config: VbrStorageModuleConfig = {}): ModuleWithProviders<VbrStorageModule> {
    return {
      ngModule: VbrStorageModule,
      providers: [
        {provide: VBR_WINDOW, useValue: config.window || window || null},
        {provide: VBR_STORAGE_PREFIX, useValue: config.prefix || ''}
      ]
    };
  }
}
