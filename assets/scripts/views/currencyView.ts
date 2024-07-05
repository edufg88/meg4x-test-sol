import { _decorator, Component, Node, Label } from 'cc';
import { GameState } from '../models/gameState';
import { CurrencyViewModel } from '../viewModels/currencyViewModel';
const { ccclass, property } = _decorator;

@ccclass('CurrencyView')
export class CurrencyView extends Component {
    @property(Label)
    private amountLabel: Label = null!;

    public init(currencyViewModel: CurrencyViewModel) {
        currencyViewModel.gameState$.subscribe(gameState => this.updateGameState(gameState));
    }

    private updateGameState(gameState: GameState) {
        this.amountLabel.string = gameState.currency.toString();
    }
}