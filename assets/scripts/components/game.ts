import { Building } from "../models/building";
import { Hero } from "../models/hero";
import { GameState } from "../models/gameState";
import { GameDataLoader } from "../gameDataLoader";

import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('game')
export class Game extends Component {

    private dataLoader?: GameDataLoader;
    private buildings: Building[] = [];
    private heroes: Hero[] = [];
    private gameState: GameState = { currency: 0, buildings: [], heroes: [], summoningQueue: [] };    

    private handleLoadedData(buildings: Building[], heroes: Hero[], gameState: GameState): void {
        this.buildings = buildings;
        this.heroes = heroes;
        this.gameState = gameState;
    }

    onLoad() {
        this.dataLoader = new GameDataLoader();
        this.dataLoader.allData$.subscribe({
            next: ({ buildings, heroes, gameState }) => {
                this.handleLoadedData(buildings, heroes, gameState);
            },
            error: (err) => {
                console.error('Error loading game data: ', err);
            }
        })
    }

    start() {        
    }

    update(deltaTime: number) {
        
    }
}

