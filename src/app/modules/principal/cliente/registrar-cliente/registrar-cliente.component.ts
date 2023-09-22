import { Observable, of, map } from 'rxjs';
import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioModel } from "../interfaces/cliente.model";
import { SelectModel } from "../cliente.component";
import { PerfilService } from 'src/app/core/services/perfil.service';

@Component({
  selector: "vex-registrar-cliente",
  templateUrl: "./registrar-cliente.component.html",
  styleUrls: ["./registrar-cliente.component.scss"],
})
export class RegistrarClienteComponent {

  inputType = 'password';
  visible = false;

  form = this.fb.group({
    cod_perfil: [null],
    primer_nombre: [null, Validators.required],
    segundo_nombre: [null, Validators.required],
    apellido_paterno: [null, Validators.required],
    apellido_materno: [null, Validators.required],
    correo: [null, Validators.required],
    contrasena: [null, Validators.required],
  });

  usuario: Partial<UsuarioModel>;

  get isEdit(): boolean {
    return !!this.user;
  }

  perfiles$: Observable<SelectModel[]> = of([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) private user: UsuarioModel,
    private dialogRef: MatDialogRef<RegistrarClienteComponent>,
    private _perfilService: PerfilService,
    private fb: UntypedFormBuilder,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.perfiles$ =  this._perfilService.findAllByEstado(1).pipe(map(res => {
      return res.map(perfil => {
        return {
          id: perfil.cod_perfil,
          nombre: perfil.nombre_perfil
        }
      })
    }));
    if (this.user) {
      this.form.patchValue({
        cod_perfil: this.user.cod_perfil,
        primer_nombre: this.user.primer_nombre,
        segundo_nombre: this.user.segundo_nombre,
        apellido_paterno: this.user.apellido_paterno,
        apellido_materno: this.user.apellido_materno,
        correo: this.user.correo
      });
    }
  }

  registrar() {
    if (!this.form.valid) return;
    const form = this.form.getRawValue();
    this.usuario = {
      cod_perfil: form.cod_perfil,
      primer_nombre: form.primer_nombre,
      segundo_nombre: form.segundo_nombre,
      apellido_paterno: form.apellido_paterno,
      apellido_materno: form.apellido_materno,
      correo: form.correo
    };
    this.dialogRef.close(this.usuario);
  }

  actualizar() {
    if (!this.form.valid) return;
    const form = this.form.value;

    this.usuario = {
      cod_usuario: this.user.cod_usuario,
      cod_perfil: form.cod_perfil,
      primer_nombre: form.primer_nombre,
      segundo_nombre: form.segundo_nombre,
      apellido_paterno: form.apellido_paterno,
      apellido_materno: form.apellido_materno,
      correo: form.correo
    };
    this.dialogRef.close(this.usuario);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  togglePassword() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this._cdr.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this._cdr.markForCheck();
    }
  }
}
