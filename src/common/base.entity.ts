import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @Column("varchar", { primary: true, name: "id", length: 255, generated: "uuid" })
    id: string;
  
    @CreateDateColumn({
      name: "createdAt"
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      name: "updatedAt"
    })
    updatedAt: Date;
    
    @DeleteDateColumn({
      name: "deletedAt"
    })
    deletedAt: Date;
}