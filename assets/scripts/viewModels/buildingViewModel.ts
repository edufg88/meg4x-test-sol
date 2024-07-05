import { _decorator, Component, Node } from 'cc';
import { Subject } from 'rxjs';
import { TownBuilding } from '../components/townBuilding';
const { ccclass, property } = _decorator;

@ccclass('BuildingViewModel')
export class BuildingViewModel {
    private buildingClickSubject = new Subject<string>();

    get buildingClick$() {
        return this.buildingClickSubject.asObservable();
    }

    constructor(townBuildings: TownBuilding[]) {
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        })
    }

    private onTownBuildingClick(buildingId: string) {
        this.buildingClickSubject.next(buildingId);
    }
}
