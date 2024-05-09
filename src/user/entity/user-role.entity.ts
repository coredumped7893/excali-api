import { Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('user_role')
@Unique(['name'])
export class UserRoleEntity {
  @PrimaryColumn()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
