import { Building } from "../models/building";
import { Hero } from "../models/hero";
import { defaultGameState, GameState } from "../models/gameState";
import { GameDataLoader } from "../gameDataLoader";

import { _decorator, Component } from 'cc';
import { Hud } from "./hud";
import { BehaviorSubject } from "rxjs";
import { TownBuilding } from "./townBuilding";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Hud)
    private hud: Hud = null!;
    @property(TownBuilding)
    private townBuildings: TownBuilding[] = [];

    private dataLoader?: GameDataLoader;

    // TODO: Try to work always with streams not data itself.
    /*
    private buildings: Building[] = [];
    private heroes: Hero[] = [];
    private gameState: GameState = { currency: 0, buildings: [], heroes: [], summoningQueue: [] };    
    */

    private buildingsSubject = new BehaviorSubject<Building[]>([]);
    private heroSubject = new BehaviorSubject<Hero[]>([]);
    private gameStateSubject = new BehaviorSubject<GameState>(defaultGameState);

    public buildings$ = this.buildingsSubject.asObservable();
    public heroes$ = this.heroSubject.asObservable();
    public gameState$ = this.gameStateSubject.asObservable();

    onLoad() {
        this.dataLoader = new GameDataLoader(this.buildings$, this.heroes$, this.gameState$);
        this.hud.init(this.townBuildings, this.buildings$, this.heroes$, this.gameState$);
    }

    start() {
    }

    update(deltaTime: number) {
        
    }
}

