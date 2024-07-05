import { _decorator, Component, Node } from 'cc';
import { TownBuilding } from '../components/townBuilding';
const { ccclass, property } = _decorator;

@ccclass('BuildingViewModel')
export class BuildingViewModel {
    constructor(townBuildings: TownBuilding[]) {
        townBuildings.forEach(building => {
            building.buttonClick$.subscribe(buildingId => this.onTownBuildingClick(buildingId));
        }) 
    }

    private onTownBuildingClick(buildingId: string) {
        console.log('Town building clicked: ', buildingId);
    }
}
