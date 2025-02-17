import { Component, Input } from '@angular/core';

@Component({
  selector: 'aw-article',
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
