import { map, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/utils/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL_SERVICE = `${environment.apiBaseUrl}/auth`;
  private _usuario : Partial<any> = null;

  constructor(protected readonly _httpClient: HttpClient,
              private readonly _localStorageService: LocalStorageService) { }

  getUser() {
    return this._usuario;
  }

  isAuthenticated() {
    return (this._localStorageService.getItem('token')) ? of(true) : of(false);
  }

  login(data: Partial<any>) {
    return this._httpClient.post<any>(`${this.URL_SERVICE}/login`, data)
                .pipe(
                  tap(res => {
                    this._usuario = res.user;
                    this._localStorageService.setItem('user', this._usuario);
                    this._localStorageService.setItem('token', res.token);
                  })
                );
  }

  logout() {
    this._localStorageService.clear();
  }
}
