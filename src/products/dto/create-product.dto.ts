import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Paracetamol 500mg',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Analgésico y antipirético de uso oral',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 4500.5,
    description: 'Precio del producto en pesos colombianos',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
