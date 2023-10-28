import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useClass: AngularFirestoreStub },
        { provide: AuthService, useClass: AuthServiceStub },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a password between 16 and 25 characters', () => {
    const pass = service.passwordGen();
    expect(pass.length).toBeGreaterThanOrEqual(16);
    expect(pass.length).toBeLessThanOrEqual(25);
  });
});

class AuthServiceStub {}
class AngularFirestoreStub {
  collection(): void {}
}
