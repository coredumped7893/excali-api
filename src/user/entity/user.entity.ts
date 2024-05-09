import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity('user')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  displayName: string;

  @Column({
    default: true,
  })
  isEnabled: boolean;

  @ManyToMany(() => UserRoleEntity)
  @JoinTable({
    name: 'user_roles',
  })
  roles: UserRoleEntity[];

  constructor(id: string) {
    this.id = id;
  }

  //@TODO add date created and modified
}
