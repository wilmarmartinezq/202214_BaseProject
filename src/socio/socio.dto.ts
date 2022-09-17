import {IsNotEmpty, IsString} from 'class-validator';

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    readonly fechanacimiento: string;
    
}
