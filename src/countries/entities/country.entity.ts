import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @ApiProperty({
    example: 1,
    description: 'The id of the Country',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Chile',
    description: 'The name of the Country',
  })
  @Column({ length: 20 })
  name: string;

  @ApiProperty({
    example: 'CL',
    description: 'The division of the Country',
  })
  @Column({ length: 5 })
  division: string;

  @ApiProperty({
    example: 'América/Santiago',
    description: 'The timezone of the Country',
  })
  @Column({ length: 20 })
  timezone: string;

  @ApiProperty({
    example: 1,
    description: '1:Active, 0:Inactive',
  })
  @Column()
  active: number;

  constructor(
    name?: string,
    division?: string,
    timezone?: string,
    active?: number,
  ) {
    this.name = name || '';
    this.division = division || '';
    this.timezone = timezone || '';
    this.active = active || 0;
  }
}
