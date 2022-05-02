import { Country } from '../../countries/entities/country.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('regions')
export class Region {
  @ApiProperty({
    example: 1,
    description: 'The id of the Region',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The related country',
  })
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ApiProperty({
    example: 'COQ',
    description: 'The code of the Region',
  })
  @Column({ length: 5 })
  code: string;

  @ApiProperty({
    example: 'Region de Coquimbo',
    description: 'The name of the Region',
  })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({
    example: 123.4,
    description: 'The latitude of the Region',
  })
  @Column({ type: 'double' })
  lat: number;

  @ApiProperty({
    example: 567.8,
    description: 'The longitude of the Region',
  })
  @Column({ type: 'double' })
  lon: number;

  @ApiProperty({
    example: 1,
    description: '1:Active, 0:Inactive',
  })
  @Column()
  active: number;

  constructor(
    country?: Country,
    code?: string,
    name?: string,
    lat?: number,
    lon?: number,
    active?: number,
  ) {
    this.country = country || null;
    this.code = code || '';
    this.name = name || '';
    this.lat = lat || 0;
    this.lon = lon || 0;
    this.active = active || 0;
  }
}
