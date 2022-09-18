import {IsEmail, IsDate, Min, IsNotEmpty, IsUrl, IsString} from 'class-validator';


export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsNotEmpty()
    readonly fecha: string;
    
    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
    
}
