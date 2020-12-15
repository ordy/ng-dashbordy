import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loading: Observable<boolean>;

  constructor(private authS: AuthService) {
    this.loading = this.authS.isLoading;
  }

  ngOnInit(): void {}

  signIn(form: NgForm): void {
    const email: string = form.value.email;
    const password: string = form.value.pwd;
    this.authS.signIn(email, password);
    form.reset();
  }
}
