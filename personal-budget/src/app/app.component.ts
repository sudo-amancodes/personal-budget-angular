import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MenuComponent } from './menu/menu.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';

@Component({
  selector: 'aw-root',
  imports: [
    RouterOutlet,
    ArticleComponent,
    FooterComponent,
    HeroComponent,
    HomepageComponent,
    MenuComponent,
    AboutComponent,
    LoginComponent,
    P404Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personal-budget';
}
