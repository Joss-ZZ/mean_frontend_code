import { switchMap, filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/utils/local-storage.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

  private _snackBar = this._alertService.snackBar;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _authService: AuthService,
              private readonly _alertService: AlertService,
              private readonly _localStorageService: LocalStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        return this.throwError(error);
      }
    })) as Observable<HttpEvent<any>>;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshTokenDto: any = {
        refreshToken: this._localStorageService.getItem<string>('refreshToken')
      }
  
    //   return this._authService.refreshToken(refreshTokenDto).pipe(
    //     switchMap(usuario => {
    //       this.isRefreshing = false;
    //       this.refreshTokenSubject.next(usuario.token);
    //       this._authService.addToken(usuario.token, usuario.refreshToken);
    //       return next.handle(this.addToken(request, usuario.token));
    //     }));
  
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private throwError(error: HttpErrorResponse) {
    if (error.status === 403 || error.status === 412) {
      this._snackBar.warning(error.error.errors, 10000);
    } else if (error.url) {
      this._snackBar.error("Ocurrió un error al procesar tu solicitud. Por favor, inténtalo nuevamente más tarde", 10000);
    }
    return throwError(error);
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
