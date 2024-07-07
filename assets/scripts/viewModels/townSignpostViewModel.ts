import { Observable } from "rxjs";
import { Building } from "../models/building";
import { Hero } from "../models/hero";

export class TownSignpostViewModel {

    private _buildingFinishedSummoning: Observable<Building> = null!;

    get buildingFinishedSummoning$() {
        return this._buildingFinishedSummoning;
    }

    constructor(buildingFinishedSummoning$: Observable<Building>) {
        this._buildingFinishedSummoning = buildingFinishedSummoning$;
    }
}
