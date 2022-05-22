import {IsEmpty, IsOptional, IsString, Length, Min} from "class-validator";

export class AuthUserDto {
    @IsString()
    @IsOptional()
    public Username?: string;

    @IsString()
    @IsOptional()
    public Password?: string;

    @IsString()
    @IsOptional()
    public Code?: string;
}

export class CreateAdminDto {
    @IsString()
    @Length(4, 25)
    public Username: string;

    @IsString()
    @Length(8)
    public Password: string;
}
