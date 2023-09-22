import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteStoreService {
  private _estado = new BehaviorSubject<boolean>(false);

  get estado$() {
    return this._estado.asObservable();
  }

  cambiarEstado(nuevoEstado: boolean) {
    this._estado.next(nuevoEstado);
  }
}