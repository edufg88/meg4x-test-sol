import { Hero } from "./hero";

export interface Building {
    id: string;
    name: string;
    description: string;
    cost: number;
    hireSlots: number;
    summoningQueue: Hero[];
}

