import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        AuthInterceptor
      ]
    });

    interceptor = new AuthInterceptor(authServiceSpy);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', (done) => {
    authServiceSpy.getToken.and.returnValue('abc123');

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (request) => {
        expect(request.headers.get('Authorization')).toBe('Bearer abc123');
        return of(new HttpResponse({ status: 200 })); // ✅ HttpEvent simulado
      }
    };

    interceptor.intercept(req, next).subscribe(() => done());
  });

  it('should not add Authorization header if token does not exist', (done) => {
    authServiceSpy.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (request) => {
        expect(request.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 })); // ✅ HttpEvent simulado
      }
    };

    interceptor.intercept(req, next).subscribe(() => done());
  });
});
