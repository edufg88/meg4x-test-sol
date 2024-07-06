import { Observable, Subject } from "rxjs";
import { TownBuilding } from "../components/townBuilding";
import { Building } from "../models/building";
import { GameState } from "../models/gameState";
import { Hero } from "../models/hero";

export class BuildingViewModel {
    private buildingClickSubject = new Subject<string>();
    private _buildings$: Observable<Building[]> = null!;
    private _heroes$: Observable<Hero[]> = null!;
    private _gameState$: Observable<GameState> = null!;

    get buildingClick$() {
        return this.buildingClickSubject.asObservable();
    }

    get buildings$() {
        return this._buildings$;
    }

    get heroes$() {
        return this._heroes$;
    }

    get gameState$() {
        return this._gameState$;
    }

    constructor(townBuildings: TownBuilding[], buildings$: Observable<Building[]>, heroes$: Observable<Hero[]>, gameState$: Observable<GameState>) {
        this._buildings$ = buildings$;
        this._heroes$ = heroes$;
        this._gameState$ = gameState$;
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        })
    }

    private onTownBuildingClick(buildingId: string) {
        this.buildingClickSubject.next(buildingId);
    }

    public onHeroHire(hero: Hero) {

    }
}
