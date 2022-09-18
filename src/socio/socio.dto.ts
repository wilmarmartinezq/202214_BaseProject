import {IsEmail, IsDate, Max, IsNotEmpty, IsString} from 'class-validator';

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsEmail()
    @IsNotEmpty()
    readonly correo: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechanacimiento: Date;
    
}
