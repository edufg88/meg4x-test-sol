import { Hero } from "../models/hero";

export interface GameState {
    currency: number;
    buildings: string[];
    heroes: Hero[];
    summoningQueue: Hero[];
}

export const defaultGameState: GameState = {
    currency: 0,
    buildings: [],
    heroes: [],
    summoningQueue: []
};