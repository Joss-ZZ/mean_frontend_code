import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { filterUserDto } from "src/app/modules/principal/cliente/cliente.component";
import { UsuarioModel } from "src/app/modules/principal/cliente/interfaces/cliente.model";
import { ApiResponse } from "src/app/shared/interfaces/api-response.interface";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  URL_SERVICE = `${environment.apiBaseUrl}/usuario`;

  constructor(protected readonly _httpClient: HttpClient) {}

  findAllByCustom(data: filterUserDto) {
    return this._httpClient
      .post<ApiResponse<UsuarioModel[]>>(
        `${this.URL_SERVICE}/findAllByCustom`,
        data
      )
      .pipe(
        map((res) => {
          return res.data.map((usuario) => {
            return {
              ...usuario,
              nombre_perfil: usuario.perfil.nombre_perfil,
            };
          });
        })
      );
  }

  registrarUsuario(data: Partial<UsuarioModel>) {
    return this._httpClient
      .post<ApiResponse<UsuarioModel>>(`${this.URL_SERVICE}/`, data)
      .pipe(
        map((res) => {
          return {
            ...res.data,
            nombre_perfil: res.data.perfil.nombre_perfil,
          };
        })
      );
  }

  actualizarUsuario(data: Partial<UsuarioModel>) {
    return this._httpClient
      .put<ApiResponse<UsuarioModel>>(`${this.URL_SERVICE}/${data.cod_usuario}`, data)
      .pipe(
        map((res) => {
          return {
            ...res.data,
            nombre_perfil: res.data.perfil.nombre_perfil,
          };
        })
      );
  }

  eliminarUsuario(id: number) {
    return this._httpClient
      .delete<ApiResponse<boolean>>(`${this.URL_SERVICE}/${id}`).pipe(map(res => res.data));
  }
}
