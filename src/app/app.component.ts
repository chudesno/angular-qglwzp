import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PatchableFormBuilder, PatchableFormGroup } from './patchable-form-builder.service';
import { Observable } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import * as jiff from 'jiff';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular';

  group: PatchableFormGroup<any>;

  patch$: Observable<any>;

  constructor(private _fb: PatchableFormBuilder) {}

  ngOnInit() {
    this.group = this._fb.group({
      title: this._fb.control('title'),
      items: this._fb.array([
        this._fb.control('item 0')
      ])
    });

    this.group.get('items')

    this.patch$ = this.group.valueChanges.pipe(startWith(this.group.value), pairwise(), map((d1, d2) => jiff.diff(d1, d2, true)));
    
  }

  addItem() {
    let items = this.group.get('items') as FormArray;
    items.push(this._fb.control('item N'));
  }

  deleteItem(i: number) {
    let items = this.group.get('items') as FormArray;
    items.removeAt(i);
  }

}
