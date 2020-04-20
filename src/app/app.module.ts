import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, AbstractControl } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

class PatchableFormControl extends FormControl {
  private readonly _initialValue: any;

  constructor(formState: any = null,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(formState, validatorOrOpts, asyncValidator);
    this._initialValue = this.value;
  }

  setValue(value: any, options: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  } = {}): void {
    console.log(this._initialValue, value);
    super.setValue(value, options);
  }
  patchValue(value: any, options: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  } = {}): void {
    this.setValue(value, options);
  }

  getPatch() {
    return { set: this.value };
  }
}

class PatchableFormGroup<T extends object> extends FormGroup {

  private _patch = {};

  private readonly _initialValue: any;

  constructor(
      public controls: {[key: string]: AbstractControl},
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
        super(controls, validatorOrOpts, asyncValidator);
        this._initialValue= this.value;
      }

  registerControl(name: string, control: AbstractControl) {
    // this._patch.add[name] = control.value;
    return super.registerControl(name, control);
  }

  /**
   * const a = {
   *   a: {
   *     aa: 0,
   *     ab: 1,
   *     ac: 2,
   *     ad: null
   *   },
   *   d: 3
   * };
   * 
   * const patch = {
   *   a: {
   *     ab: 11,
   *     ad: 5,
   *     ac: null
   *   },
   *   d: 31
   * };
   */
  getPatch() {
    Object.keys(this.value).forEach(name => {
      const control = this.controls[name];

    });
    return this._patch;
  }
}

class PatchableFormBuilder extends FormBuilder {
  control(formState: any, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null, asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
        return new PatchableFormControl(formState, validatorOrOpts, asyncValidator);
      }
  group(controlsConfig: {[key: string]: any},
      options: AbstractControlOptions|{[key: string]: any}|null = null) {
        return new PatchableFormGroup(controlsConfig, options);
      }
}

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],

  providers: [{provide: FormBuilder, useClass: PatchableFormBuilder}]
})
export class AppModule { }

type Changes<T extends object> = {
  [K in keyof T]: T[K] extends Array<any> ? any[] :
                  T[K] extends object ? {} :
                  (T[K] | null | undefined)
};

const a = {
  b: 3,
  c: [{d:1}, {d:2}, {d:5}],
  e: {
    e1: 4,
    e2: []
  }
};


/*

Form.trackValueChanges(value: T): Changes<T>

type Changes<T> = {
  [keyof T]: T extends Array ? ArrayChanges<T> : ScalarChanges<T>
}

const a = {
  b: 3,
  c: [{d:1}, {d:2}, {d:5}]
};

const aChanges = {
  b: {
    set: 6 // !!!
  },
  c: {
    delete: [0],
    insert: [v: {d: 7}, at: 0}],
    update: [{ v: { d: { set: 5 }}, at: 2 }]
  }
}

GQL Input = Changes<T>

*/
