import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular';

  group: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.group = this._fb.group({
      title: this._fb.control('title'),
      items: this._fb.array([
        this._fb.control('item 0')
      ])
    });
    console.log(this.group.getPatch());
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
