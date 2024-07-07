import { Observable } from "rxjs";
import { Building } from "../models/building";
import { Hero } from "../models/hero";

export class TownSignpostViewModel {

    private _townSignpostClick$: Observable<void> = null!;
    private _buildingFinishedSummoning$: Observable<Building> = null!;

    get townSignpostClick$() {
        return this._townSignpostClick$;
    }

    get buildingFinishedSummoning$() {
        return this._buildingFinishedSummoning$;
    }

    constructor(townSignpostClick$: Observable<void>, buildingFinishedSummoning$: Observable<Building>) {
        this._townSignpostClick$ = townSignpostClick$;
        this._buildingFinishedSummoning$ = buildingFinishedSummoning$;
    }
}
