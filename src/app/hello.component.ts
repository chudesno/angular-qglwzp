import { Component, Input, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ControlContainer, NgForm, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'hello',
  template: `
    <h1>Hello {{name}}!</h1>
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
    private readonly _formContainer: NgForm | FormGroupDirective, private _fb: FormBuilder) {
    }

  ngOnInit() {
    this.group = this._fb.group({
      helloTitle: this._fb.control(this.name)
    });
    this._formContainer.form.addControl('hello', this.group);
    console.log('child');
  }
}
