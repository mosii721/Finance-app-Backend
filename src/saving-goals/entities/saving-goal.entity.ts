import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum SavingGoalStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    PAUSED = 'paused',
}

@Entity()
export class SavingGoal {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    userId:string;
    
    @Column({type:'decimal', precision:15, scale:2})
    targetAmount: number;

    @Column({type:'decimal', precision:15, scale:2, default:0})
    currentAmount: number;

    @Column({type:'date'})
    targetDate: string;

    @Column({type:'enum', enum:SavingGoalStatus, default:SavingGoalStatus.ACTIVE})
    status: SavingGoalStatus;

    @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt:string;

    @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    UpdatedAt:string;

    @ManyToOne(() => User, user => user.savingsGoal, {onDelete:'CASCADE'})
    @JoinColumn({name:'userId'})
    user: Relation<User>;
}
