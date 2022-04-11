import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TablesComponent } from './components/tables/tables.component';
import { GridModule } from '@progress/kendo-angular-grid';




@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    TablesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropDownsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    GridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
