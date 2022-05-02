import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    example: 'Chile',
    description: 'The name of the Country',
  })
  name: string;

  @ApiProperty({
    example: 'CL',
    description: 'The division of the Country',
  })
  division: string;

  @ApiProperty({
    example: 'América/Santiago',
    description: 'The timezone of the Country',
  })
  timezone: string;

  @ApiProperty({
    example: 1,
    description: '1:Active, 0:Inactive',
  })
  active: number;
}
