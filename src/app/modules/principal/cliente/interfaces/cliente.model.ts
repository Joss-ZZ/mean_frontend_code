import { PerfilModel } from "./perfil.model"

export interface UsuarioModel {
    cod_usuario:        number;
    cod_perfil:         number;
    primer_nombre:      string;
    segundo_nombre:     string;
    apellido_paterno:   string;
    apellido_materno:   string;
    correo:             string;
    contrasena:         string;
    estado:             number;
    fecha_registro:     Date;
    fecha_modificacion: Date;
    perfil:             Partial<PerfilModel>;

    nombre_perfil?: string;
}