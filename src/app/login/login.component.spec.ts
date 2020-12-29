import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../service/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { of } from 'rxjs';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, InputTextModule, CardModule, PasswordModule],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the loading state', () => {
    component.loading.subscribe((x) => {
      expect(x).toBeFalse();
    });
  });
});

class AuthServiceStub {
  get isLoading(): Observable<boolean> {
    return of(false);
  }
}
