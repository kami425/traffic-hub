import { IsNotEmpty, Length } from "class-validator";

export class RoadInputDto {
    @IsNotEmpty()
    @Length(3, 50)
    name!: string;

    @IsNotEmpty()
    isOpen!: boolean;
}