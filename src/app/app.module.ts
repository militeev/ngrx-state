import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ListPageComponent} from './list-page/list-page.component';
import {StoreModule} from '@ngrx/store';
import {HomePageComponent} from './home-page/home-page.component';
import {ProjectSelectorComponent} from './project-selector/project-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    ListPageComponent,
    HomePageComponent,
    ProjectSelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({router: routerReducer}),
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
