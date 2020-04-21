import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, AbstractControl } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';



@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }