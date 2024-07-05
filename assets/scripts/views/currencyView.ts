import { _decorator, Component, Node } from 'cc';
import { CurrencyViewModel } from '../viewModels/currencyViewModel';
const { ccclass, property } = _decorator;

@ccclass('CurrencyView')
export class CurrencyView extends Component {
    public init(currencyViewModel: CurrencyViewModel) {

    }
}

