import { _decorator, Component, Node, Label } from 'cc';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
const { ccclass, property } = _decorator;

@ccclass('TownSignpostView')
export class TownSignpostView extends Component {
    @property(Node)
    private heroCountParent: Node = null!;
    @property(Label)
    private heroCountLabel: Label = null!;

    private heroCount: number = 0;

    public init(townSignpostViewModel: TownSignpostViewModel) {
        this.heroCountParent.active = false;
        townSignpostViewModel.buildingFinishedSummoning$.subscribe(building => {            
            this.heroCount++;
            this.heroCountParent.active = this.heroCount > 0;
            this.heroCountLabel.string = this.heroCount.toString();
        })
    }
}

