import { Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ZhiHuAuthor } from "../../models/ZhiHuAuthor";
import { readFile } from "../../services/utilService";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { ZhiHuArticle } from "../../models/ZhiHuArticle";
import { forkJoin, lastValueFrom } from "rxjs";
import { AlertController, ToastController } from "@ionic/angular/lazy";

enum Section {
  AUTHORS = "authors",
  ARTICLES = "articles",
}

@Component({
  selector: "app-zhihu",
  templateUrl: "./zhihu.page.html",
  styleUrls: ["./zhihu.page.scss"],
  standalone: false,
})
export class ZhihuPage {
  readonly Section = Section;
  selectedSection: Section = Section.AUTHORS;
  elmIndex: number | null = null;
  isModalOpen = false;
  authorM: ZhiHuAuthor | null = null;
  authors: ZhiHuAuthor[] = [];
  articles: ZhiHuArticle[] = [];
  articleForm: FormGroup | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private dbService: NgxIndexedDBService,
    private toastController: ToastController,
    private alertController: AlertController,
    private fb: FormBuilder,
  ) {}

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    forkJoin({
      authors: this.dbService.getAll<ZhiHuAuthor>(ZhiHuAuthor.tableName),
      articles: this.dbService.getAll<ZhiHuArticle>(ZhiHuArticle.tableName),
    }).subscribe({
      next: (result) => {
        this.authors = result.authors;
        this.articles = result.articles.reverse();
        this.cdr.detectChanges();
      },
    });
  }

  onSegmentChange(event: CustomEvent) {
    this.selectedSection = event.detail.value as Section;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  toggleForm(index: number | null = null) {
    this.elmIndex = index;
    switch (this.selectedSection) {
      case Section.AUTHORS:
        this.authorM = new ZhiHuAuthor();
        if (index !== null) {
          this.authorM.assignData(this.authors[index]);
        }
        break;
      case Section.ARTICLES:
        this.articleForm = this.fb.group({
          author: [index === null ? null : this.articles[index].author, Validators.required],
          title: [index === null ? null : this.articles[index].title, [Validators.required, Validators.maxLength(100)]],
          link: [
            index === null ? null : this.articles[index].link,
            [Validators.required, Validators.pattern("^https?://.*")],
          ],
          description: [index === null ? null : this.articles[index].description, Validators.required],
        });
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

    switch (this.selectedSection) {
      case Section.AUTHORS:
        if (this.authorM) {
          this.authorM.photo = url;
        }
        break;
    }
    this.cdr.detectChanges();
  }

  async saveForm() {
    switch (this.selectedSection) {
      case Section.AUTHORS:
        await this.editAuthor();
        break;
      case Section.ARTICLES:
        await this.editArticle();
        break;
    }
  }

  async editAuthor() {
    if (!this.authorM) return;
    try {
      if (this.elmIndex === null) {
        const result = await lastValueFrom(this.dbService.add<ZhiHuAuthor>(ZhiHuAuthor.tableName, this.authorM));
        this.authors.push(result);
        this.setOpen(false);
        this.cdr.detectChanges();
      } else {
        this.authors[this.elmIndex] = await lastValueFrom(
          this.dbService.update<ZhiHuAuthor>(ZhiHuAuthor.tableName, this.authorM),
        );
      }

      const toast = await this.toastController.create({
        message: "Enregistré!",
        duration: 1000,
        position: "bottom",
      });

      await toast.present();
    } catch {}
  }

  goToWebSite(index: number) {
    let url = null;
    switch (this.selectedSection) {
      case Section.AUTHORS:
        url = this.authors[index].link;
        break;
      case Section.ARTICLES:
        url = this.articles[index].link;
        break;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async openDeleteModal(index: number) {
    const alert = await this.alertController.create({
      header: "Veux tu supprimer cette ligne ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: () => {
            this.deleteElm(index);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteElm(index: number) {
    switch (this.selectedSection) {
      case Section.AUTHORS:
        await lastValueFrom(this.dbService.delete<ZhiHuAuthor>(ZhiHuAuthor.tableName, this.authors[index].id ?? 0));
        this.authors = this.authors.filter((_, elmIndex: number) => elmIndex !== index);
        break;
      case Section.ARTICLES:
        await lastValueFrom(this.dbService.delete<ZhiHuArticle>(ZhiHuArticle.tableName, this.articles[index].id ?? 0));
        this.articles = this.articles.filter((_, elmIndex: number) => elmIndex !== index);
        break;
    }
    this.cdr.detectChanges();

    const toast = await this.toastController.create({
      message: "Supprimé!",
      duration: 1000,
      position: "bottom",
    });

    await toast.present();
  }

  async editArticle() {
    if (this.articleForm === null) return;
    try {
      if (this.elmIndex === null) {
        const result = await lastValueFrom(
          this.dbService.add<ZhiHuArticle>(ZhiHuArticle.tableName, this.articleForm.value),
        );
        this.articles.unshift(result);
        this.setOpen(false);
        this.cdr.detectChanges();
      } else {
        this.articles[this.elmIndex] = await lastValueFrom(
          this.dbService.update<ZhiHuArticle>(ZhiHuArticle.tableName, {
            id: this.articles[this.elmIndex].id,
            ...this.articleForm.value,
          }),
        );
      }

      const toast = await this.toastController.create({
        message: "Enregistré!",
        duration: 1000,
        position: "bottom",
      });

      await toast.present();
    } catch {}
  }
}
