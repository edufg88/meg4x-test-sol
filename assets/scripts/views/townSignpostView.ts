import { _decorator, Component, Node } from 'cc';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
const { ccclass, property } = _decorator;

@ccclass('TownSignpostView')
export class TownSignpostView extends Component {
    public init(townSignpostViewModel: TownSignpostViewModel) {

    }
}

