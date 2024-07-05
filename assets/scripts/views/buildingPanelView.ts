import { _decorator, Component, Node } from 'cc';
import { BuildingViewModel } from '../viewModels/buildingViewModel';
const { ccclass, property } = _decorator;

@ccclass('BuildingPanelView')
export class BuildingPanelView extends Component {

    private buildingViewModel: BuildingViewModel = null!;

    public init(buildingViewModel: BuildingViewModel) {

    }
}
