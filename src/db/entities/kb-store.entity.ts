import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { KBFile } from './kb-file.entity';
import { KBAssistant } from './kb-assistant.entity';

// Use lowercase table names to avoid case sensitivity issues on MySQL (lower_case_table_names)
@Entity({ name: 'kbstore' })
export class KBStore {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 191 })
  KBUID!: string;

  @Column({ type: 'varchar', length: 191 })
  XPlatformID!: string;

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

  @OneToMany(() => KBFile, (file) => file.Store)
  Files!: KBFile[];

  @OneToMany(() => KBAssistant, (assistant) => assistant.Store)
  Assistants!: KBAssistant[];
}

export default KBStore;