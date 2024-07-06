import { Observable, Subject } from "rxjs";
import { TownBuilding } from "../components/townBuilding";
import { Building } from "../models/building";
import { Hero } from "../models/hero";

export class BuildingViewModel {
    private buildingClickSubject = new Subject<string>();
    private _buildings$: Observable<Building[]> = null!;
    private _heroes$: Observable<Hero[]> = null!;

    get buildingClick$() {
        return this.buildingClickSubject.asObservable();
    }

    get buildings$() {
        return this._buildings$;
    }

    get heroes$() {
        return this._heroes$;
    }

    constructor(townBuildings: TownBuilding[], buildings$: Observable<Building[]>, heroes$: Observable<Hero[]>) {
        this._buildings$ = buildings$;
        this._heroes$ = heroes$;
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        })
    }

    private onTownBuildingClick(buildingId: string) {
        this.buildingClickSubject.next(buildingId);
    }
}
