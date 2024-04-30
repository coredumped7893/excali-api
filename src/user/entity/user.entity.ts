import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  displayName: string;

  constructor(id: string) {
    this.id = id;
  }

  //@TODO add roles
  //@TODO add date created and modified
  //@TODO add is enabled flag
}
