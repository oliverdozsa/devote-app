import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  editorData: any

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(`data = ${this.editorData}`);
    }, 35000)
  }

  onTinyMceSubmit(event: any) {
    //
  }

}
