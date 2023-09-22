import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PerfilModel } from 'src/app/modules/principal/cliente/interfaces/perfil.model';
import { ApiResponse } from 'src/app/shared/interfaces/api-response.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export class PerfilService {

	URL_SERVICE = `${environment.apiBaseUrl}/perfil`;

	constructor(protected readonly _httpClient: HttpClient) { }

	findAllByEstado(estado: number) {
		return this._httpClient.get<ApiResponse<Partial<PerfilModel>[]>>(`${this.URL_SERVICE}/findAllByEstado/${estado}`).pipe(map((res) => res.data));
	}
}
