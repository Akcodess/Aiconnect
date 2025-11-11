import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';

import { KBStore } from './kb-store.entity';

@Entity({ name: 'KBFile' })
export class KBFile {
  @PrimaryGeneratedColumn()
  Id!: number;

  // Explicit FK column to match Sequelize schema and ensure varchar length
  @Column({ type: 'varchar', length: 191, name: 'KBUID' })
  KBUID!: string;

  @ManyToOne(() => KBStore, (store) => store.Files, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'KBUID', referencedColumnName: 'KBUID' })
  Store!: KBStore;

  @Column({ type: 'varchar', length: 191 })
  FileName!: string;

  @Column({ type: 'varchar', length: 191 })
  FileURL!: string;

  @Column({ type: 'json', default: () => "'{}'" })
  XPRef!: Record<string, any>;

  @Column({ type: 'int' })
  CreatedBy!: number;

  @Column({ type: 'int', nullable: true })
  EditedBy?: number | null;

  @CreateDateColumn({ type: 'datetime', name: 'CreatedOn' })
  CreatedOn!: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'EditedOn' })
  EditedOn!: Date;
}

export default KBFile;