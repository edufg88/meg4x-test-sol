import { GameDataHandler } from "../gameDataHandler";

import { _decorator, Component } from 'cc';
import { Hud } from "./hud";
import { TownBuilding } from "./townBuilding";
import { map, timer } from "rxjs";
import { Hero } from "../models/hero";
import { Building } from "../models/building";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Hud)
    private hud: Hud = null!;
    @property(TownBuilding)
    private townBuildings: TownBuilding[] = [];

    private dataHandler: GameDataHandler = null!;

    get buildings$() {
        return this.dataHandler.buildings$;
    }

    get heroes$() {
        return this.dataHandler.heroes$;
    }

    get gameState$() {
        return this.dataHandler.gameState$;
    }

    start() {
        this.dataHandler = new GameDataHandler();
        this.hud.init(this.townBuildings, this.buildings$, this.heroes$, this.gameState$);
        this.hud.heroHire$.subscribe(([hero, building]) => {
            this.addHeroToBuilding(hero, building);
            this.decreaseCurrency(hero.cost);
        });
    }

    private addHeroToBuilding(hero: Hero, building: Building) {
        console.log(hero.id, building.id);
        this.dataHandler.addHeroToBuilding(hero, building);
    }

    private decreaseCurrency(value: number) {
        this.dataHandler.decreaseCurrency(value);
    }
}

