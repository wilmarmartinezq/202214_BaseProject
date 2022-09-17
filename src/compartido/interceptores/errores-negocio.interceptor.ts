import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ErrorNegocio } from '../errores-negocio';

@Injectable()
export class ErroresNegocioInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.tipo === ErrorNegocio.NO_ENCONTRADO)
          throw new HttpException(
            {
              codigoError: HttpStatus.NOT_FOUND,
              mensaje: error.mensaje,
            },
            HttpStatus.NOT_FOUND,
          );
        else if (error.tipo === ErrorNegocio.PRECONDICION_FALLIDA)
          throw new HttpException(
            {
              codigoError: HttpStatus.PRECONDITION_FAILED,
              mensaje: error.mensaje,
            },
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.tipo === ErrorNegocio.PRECONDICION_FALLIDA)
          throw new HttpException(
            {
              codigoError: HttpStatus.BAD_REQUEST,
              mensaje: error.mensaje,
            },
            HttpStatus.BAD_REQUEST,
          );
        else throw error;
      }),
    );
  }
}

