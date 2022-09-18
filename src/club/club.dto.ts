import {IsEmail, IsDate, Max, IsNotEmpty, IsUrl, IsString} from 'class-validator';


export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsDate()
    @IsNotEmpty()
    readonly fecha: Date;
    
    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;
    
    @IsString()
    @Max(100)
    @IsNotEmpty()
    readonly descripcion: string;
    
}
