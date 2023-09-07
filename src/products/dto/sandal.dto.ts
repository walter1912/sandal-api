import { IsString } from "class-validator";

export class Sandal {
    @IsString()
    color: string;
  
    @IsString()
    material: string;
  }