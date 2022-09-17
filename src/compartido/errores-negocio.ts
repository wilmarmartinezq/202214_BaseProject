export function ExcepcionLogicaNegocio(mensaje: string, tipo: number) {
  this.mensaje = mensaje;
  this.tipo = tipo;
}

export enum ErrorNegocio {
  NO_ENCONTRADO,
  PRECONDICION_FALLIDA,
  PETICION_INCORRECTA,
}
