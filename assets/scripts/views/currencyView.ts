import { _decorator, Component, Node, Label, tween, Color, UIOpacity } from 'cc';
import { GameState } from '../models/gameState';
import { CurrencyViewModel } from '../viewModels/currencyViewModel';
const { ccclass, property } = _decorator;

@ccclass('CurrencyView')
export class CurrencyView extends Component {
    @property(Label)
    private amountLabel: Label = null!;
    @property(Label)
    private amountSpentLabel: Label = null!;
    @property(UIOpacity)
    private amountSpentOpacity: UIOpacity = null!;

    public init(currencyViewModel: CurrencyViewModel) {
        currencyViewModel.gameState$.subscribe(gameState => this.updateGameState(gameState));
        currencyViewModel.currencySpent$.subscribe(currency => this.playCurrencySpentAnimation(currency));
    }

    private updateGameState(gameState: GameState) {
        this.amountLabel.string = gameState.currency.toString();
    }

    private playCurrencySpentAnimation(currency: number) {
        console.log('Currency spent: ', currency);
        this.amountSpentLabel.string = (-currency).toString();

        tween(this.amountSpentOpacity)
            .to(1, { opacity: 255 })
            .to(1, { opacity: 0 })
            .call(this.onCurrencySpentAnimationComplete)
            .start();
    }

    private onCurrencySpentAnimationComplete() {

    }
}