import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';

import { KBStore } from './kb-store.entity';

// Use lowercase table names to avoid case sensitivity issues on MySQL (lower_case_table_names)
@Entity({ name: 'kbassistant' })
export class KBAssistant {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 191 })
  Code!: string;

  // Explicit FK column to match Sequelize schema and ensure varchar length
  @Column({ type: 'varchar', length: 191, name: 'KBUID' })
  KBUID!: string;

  @ManyToOne(() => KBStore, (store) => store.Assistants, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'KBUID', referencedColumnName: 'KBUID' })
  Store!: KBStore;

  @Column({ type: 'varchar', length: 191 })
  Name!: string;

  @Column({ type: 'varchar', length: 191 })
  Instructions!: string;

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

export default KBAssistant;