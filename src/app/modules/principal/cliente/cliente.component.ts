import { UntypedFormBuilder } from '@angular/forms';
import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { UsuarioModel } from './interfaces/cliente.model';
import { Observable, ReplaySubject, filter, Subscription, of, finalize, map } from 'rxjs';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteStoreService } from './cliente-store.service';
import { PerfilService } from 'src/app/core/services/perfil.service';
import { RegistrarClienteComponent } from './registrar-cliente/registrar-cliente.component';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

export interface SelectModel {
  id: number,
  nombre: string
}

export interface filterUserDto {
  termino: string,
  estado: number,
  cod_perfil: number
}

@Component({
  selector: 'vex-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ]
})
export class ClienteComponent {

  private loadingSubscription: Subscription;
  isLoadingButton = false;

  estados$: Observable<SelectModel[]> = of([
    {
      id: 0,
      nombre: 'Inactivo'
    },
    {
      id: 1,
      nombre: 'Activo'
    },
    {
      id: 2,
      nombre: '--Todos--'
    },
  ]);  

  perfiles$: Observable<SelectModel[]> = of([]);

  @Input()
  columns: TableColumn<any>[] = [
    { label: 'Perfil', property: 'nombre_perfil', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Nombres', property: 'primer_nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Apellido Paterno', property: 'apellido_paterno', type: 'text', visible: true },
    { label: 'Apellido Materno', property: 'apellido_materno', type: 'text', visible: true },
    { label: 'Correo', property: 'correo', type: 'text', visible: true },
    { label: 'Fecha de Registro', property: 'fecha_registro', type: 'date', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<any> | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subject$: ReplaySubject<UsuarioModel[]> = new ReplaySubject<UsuarioModel[]>(1);
  data$: Observable<UsuarioModel[]> = this.subject$.asObservable();
  usuarios: UsuarioModel[];

  form = this._fb.group({
    termino: [''],
    estado: [1],
    perfil: [0]
  });

  private _loading = this._alertService.loading;
  private _snackBar = this._alertService.snackBar;

  constructor(private dialog: MatDialog, private _usuarioService: UsuarioService, private readonly _fb: UntypedFormBuilder, private _clienteStoreService: ClienteStoreService, private _perfilService: PerfilService, private readonly _alertService: AlertService) {
    this.loadingSubscription = this._clienteStoreService.estado$.subscribe(estado =>this.isLoadingButton = estado);
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.perfiles$ =  this._perfilService.findAllByEstado(1).pipe(map(res => {
      return res.map(perfil => {
        return {
          id: perfil.cod_perfil,
          nombre: perfil.nombre_perfil
        }
      }).concat({
        id: 0,
        nombre: "--Todos--"
      });
    }));
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<UsuarioModel[]>(Boolean)
    ).subscribe(usuarios => {
      this.usuarios = usuarios;
      this.dataSource.data = usuarios;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buscar();
  }

  registrarUsuario() {
    this.dialog.open(RegistrarClienteComponent, {
      data: null,
      width: '400px',
      disableClose: true
    }).afterClosed().subscribe((usuario: UsuarioModel) => {
      if (!usuario) return;
      this._loading.show();
      if(usuario) {
        this._usuarioService.registrarUsuario(usuario)
        .pipe(finalize(()=> this._loading.hide()))
        .subscribe(res=> {
          this._snackBar.info('Registrado correctamente.', 4000);
          this.usuarios.unshift(res);
          this.subject$.next(this.usuarios);
        });
      }
    });
  }

  actualizarUsuario(user: UsuarioModel) {
    this.dialog.open(RegistrarClienteComponent, {
      data: user,
      width: '400px',
      disableClose: true
    }).afterClosed().subscribe((usuario: UsuarioModel) => {
      if (!usuario) return;
      this._loading.show();
      if(usuario) {
        this._usuarioService.actualizarUsuario(usuario)
        .pipe(finalize(()=> this._loading.hide()))
        .subscribe(res=> {
          this._snackBar.info('Actualizado correctamente.', 4000);
          const index = this.usuarios.findIndex((usuarioExistente) => usuarioExistente.cod_usuario === res.cod_usuario);
          this.usuarios[index] = res;
          this.subject$.next(this.usuarios);
        });
      }
    });
  }

  eliminarUsuario(user: UsuarioModel) {
    this._alertService
    .confirm({
      title: 'Advertencia',
      message: 'Está seguro de eliminar este registro?',
      // dismissible: true,
      actions: {
        cancel: { label: 'NO' },
        confirm: { label: 'SI' },
      },
    })
    .afterClosed()
    .subscribe((result) => {
      if (result === 'acepted') {
        this._loading.show();
        this._usuarioService.eliminarUsuario(user.cod_usuario)
          .pipe(finalize(() => this._loading.hide()))
          .subscribe(res => {
            this._snackBar.info('Se eliminó correctamente.', 4000);
            this.usuarios.splice(this.usuarios.findIndex((usuarioExistente) => usuarioExistente.cod_usuario === user.cod_usuario), 1);
            this.subject$.next(this.usuarios);
          });
      }
    })
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  listarUsuarios(data: filterUserDto) {
    this._usuarioService.findAllByCustom(data)
      .pipe(finalize(() => this._clienteStoreService.cambiarEstado(false)))
      .subscribe(res=> {
        console.log(res);
        this.usuarios = res;
        this.dataSource.data = res;
    });
  }

  buscar(isNotDefault?: boolean) {
    if(isNotDefault) {
      this._clienteStoreService.cambiarEstado(true);
    }
    this.listarUsuarios(this.fillSearchDto());
  }

  fillSearchDto(): filterUserDto {
    return {
      estado: this.form.get('estado')?.value,
      termino: this.form.get('termino')?.value ?? '',
      cod_perfil: this.form.get('perfil')?.value,
    }
  }
}
