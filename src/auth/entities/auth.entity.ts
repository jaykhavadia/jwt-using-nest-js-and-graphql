import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 500 })
    name: string
  
    @Column({ length: 500, unique: true })
    email: string;

    @Column()
    password: string;
}
