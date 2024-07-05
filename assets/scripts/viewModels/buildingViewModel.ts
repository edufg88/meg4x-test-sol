import { Observable, Subject } from "rxjs";
import { TownBuilding } from "../components/townBuilding";
import { Building } from "../models/building";

export class BuildingViewModel {
    private buildingClickSubject = new Subject<string>();
    private _buildings$: Observable<Building[]> = null!;

    get buildingClick$() {
        return this.buildingClickSubject.asObservable();
    }

    get buildings$() {
        return this._buildings$;
    }

    constructor(townBuildings: TownBuilding[], buildings$: Observable<Building[]>) {
        this._buildings$ = buildings$;
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        })
    }

    private onTownBuildingClick(buildingId: string) {
        this.buildingClickSubject.next(buildingId);
    }
}
