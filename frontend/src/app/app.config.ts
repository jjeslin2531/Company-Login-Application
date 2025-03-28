// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'

import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [ provideRouter(routes), provideHttpClient()]
};