import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ZhiHuAuthor } from '../../models/ZhiHuAuthor';
import { readFile } from '../../services/utilService';

enum Section {
  AUTHORS = "authors",
  ARTICLES = "articles"
};

@Component({
  selector: 'app-zhihu',
  templateUrl: './zhihu.page.html',
  styleUrls: ['./zhihu.page.scss'],
  standalone: false,
})
export class ZhihuPage implements OnInit {
  readonly Section = Section;
  selectedSection:Section = Section.AUTHORS;
  elmIndex:number|null = null;
  isModalOpen = false;
  authorM: ZhiHuAuthor|null = null;

  constructor() { }

  ngOnInit() {
  }

  onSegmentChange(event: CustomEvent) {
    this.selectedSection = event.detail.value as Section;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  toggleForm(index:number|null = null) {
    this.elmIndex = index;
    switch(this.selectedSection) {
      case Section.AUTHORS:
        this.authorM = new ZhiHuAuthor();
        break;
      case Section.ARTICLES:
        break;  
    }
    this.setOpen(true);
  }

  async handlePhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const url = await readFile(file);
    if (url === null) return;

    switch(this.selectedSection) {
      case Section.AUTHORS:
        if (this.authorM) this.authorM.photo = url;
        break;
    }console.log(this.authorM)
  }
  
  saveForm() {
    console.log(this.authorM)
  }
}
