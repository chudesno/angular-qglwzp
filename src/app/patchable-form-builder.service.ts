import { AbstractControl, ValidatorFn, AbstractControlOptions, FormGroup, AsyncValidatorFn, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { Injectable } from "@angular/core";

interface Patchable {
  getPatch(): Object | null;
}

class PatchableFormControl extends FormControl implements Patchable {
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
    return this.value === this._initialValue ? null : { set: this.value };
  }
}

export class PatchableFormGroup<T extends object> extends FormGroup implements Patchable {

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
    return Object.keys(this.value).reduce((prev, name) => {
      console.log(prev);
      const control = this.controls[name];
      if (control['getPatch'] && typeof control['getPatch'] === 'function') {
        const patch = control['getPatch'](); 
        if (patch !== null) {
          prev[name] = control['getPatch']();
        }
      } else {
        prev[name] = 'WAT';
      }
      return prev;

    }, {} as any);
    return this.value;
  }
}

class PatchableFormArray extends FormArray implements Patchable {

  private _initValue: AbstractControl[];

  private _additions: {i: number, control: AbstractControl}[] = [];

  private _removals: string[] = [];

  constructor(
      public controls: AbstractControl[],
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
        super(controls, validatorOrOpts, asyncValidator);
        this._initValue = controls;
      }

  push(control: AbstractControl): void {
    this._additions.push({ i: this.controls.length, control });
    super.push(control);
  }
  insert(index: number, control: AbstractControl): void {
    this._additions.push({ i: index, control });
    super.insert(index, control);
  }
  removeAt(index: number): void {
    this._removals.push(this.getValueId(index));
    super.removeAt(index);
  }

  getPatch() {
    // this._patch.add.length || this._patch.remove.length;
    return {
        add: this._additions.map(a => ({i: a.i, value: a.control.value})), 
        update: this.controls.map((c, i) => ({ i, patch: getPatch(c) })).filter(p => p.patch !== null),
        remove: [...this._removals]
      };
  }

  private getValueId(index: number) {
    let id = '#' + index;
    // try {
    //   id = this.controls[index].value.id;
    // } catch(_) {}
    return id;
  }
}



function getPatch(control: AbstractControl) {
  if (control['getPatch'] && typeof control['getPatch'] === 'function') {
    return control['getPatch']();
  }
  return null;
}

@Injectable({ providedIn: 'root'})
export class PatchableFormBuilder extends FormBuilder {
  control(formState: any, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null, asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
        return new PatchableFormControl(formState, validatorOrOpts, asyncValidator);
      }
  group(controlsConfig: {[key: string]: any},
      options: AbstractControlOptions|{[key: string]: any}|null = null) {
        return new PatchableFormGroup(controlsConfig, options);
      }
  
  array(
      controlsConfig: any[],
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormArray {
    return new PatchableFormArray(controlsConfig, validatorOrOpts, asyncValidator);
  }
}