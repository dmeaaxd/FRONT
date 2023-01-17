import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/header/header.component';
import {FormComponent} from './login-page/form/form.component';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {MainPageComponent} from './main-page/main-page.component';
import {AppRoutingModule} from "./app-routing.module";
import {LoginPageComponent} from './login-page/login-page.component';
import {HttpClientModule} from "@angular/common/http";
import {GraphComponent} from './main-page/graph/graph.component';
import { HitFormComponent } from './main-page/hit-form/hit-form.component';
import { TableComponent } from './main-page/table/table.component';
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    MainPageComponent,
    LoginPageComponent,
    GraphComponent,
    HitFormComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    RippleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
