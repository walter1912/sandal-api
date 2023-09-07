import { IsString } from "class-validator";

export class Sole {
    @IsString()
    color: string;
  
    @IsString()
    material: string;
  }