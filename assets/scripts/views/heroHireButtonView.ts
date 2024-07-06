import { _decorator, Component, Node, Button, Label, Color } from 'cc';
import { Observable, Subject } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('HeroHireButtonView')
export class HeroHireButtonView extends Component {
    @property(Button)
    private button: Button = null!;
    @property(Label)
    private priceLabel: Label = null!;
    
    private okColor: Color = Color.GREEN;
    private koColor: Color = Color.RED;
    private disabledColor: Color = Color.WHITE;

    private buttonClickSubject = new Subject<void>();

    get buttonClick$() {
        return this.buttonClickSubject.asObservable();
    }

    public init(heroSelection$: Observable<[boolean, boolean, number]>) {
        this.button.interactable = false;
        this.button.node.on(Button.EventType.CLICK, () => {
            this.buttonClickSubject.next();
        });
        heroSelection$.subscribe(([active, canHire, price]) => this.onHeroSelectionChanged(active, canHire, price));
    }

    private onHeroSelectionChanged(active: boolean, canHire: boolean, price: number) {
        this.button.interactable = active;
        this.priceLabel.string = price.toString();
        this.priceLabel.color = !active ? this.disabledColor : canHire ? this.okColor : this.koColor;
    }
}
