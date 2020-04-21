import { Component, Input, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ControlContainer, NgForm, FormGroupDirective } from '@angular/forms';
import { PatchableFormBuilder } from './patchable-form-builder.service';

@Component({
  selector: 'hello',
  template: `
    <div>Hello {{name}}!</div>
    <div [formGroup]="group">
      <input formControlName="helloTitle">
    </div>
  `,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent implements OnInit {
  @Input() name: string;

  group: FormGroup;


  constructor(@Inject(ControlContainer)
    private readonly _formContainer: NgForm | FormGroupDirective, private _fb: PatchableFormBuilder) {
    }

  ngOnInit() {
    this.group = this._fb.group({
      helloTitle: this._fb.control(this.name)
    });
    this._formContainer.form.addControl('hello', this.group);
    console.log('child');
  }
}
