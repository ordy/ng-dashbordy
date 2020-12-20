import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private activeRoute: ActivatedRoute,
    public title: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // Setting the active route as page title
    const pageTitle = this.title;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activeRoute.snapshot),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.data.title ? route.data.title : pageTitle;
        })
      )
      .subscribe((route: string) => {
        this.title.setTitle(route);
      });
  }
}
