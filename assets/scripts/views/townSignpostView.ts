import { _decorator, Component, Node, Label, Button } from 'cc';
import { Subject } from 'rxjs';
import { TownSignpostViewModel } from '../viewModels/townSignpostViewModel';
const { ccclass, property } = _decorator;

@ccclass('TownSignpostView')
export class TownSignpostView extends Component {
    @property(Node)
    private heroCountParent: Node = null!;
    @property(Label)
    private heroCountLabel: Label = null!;
    @property(Button)
    private button: Button = null!;

    private buttonClickSubject = new Subject<void>();
    private heroCount: number = 0;

    get buttonClick$() {
        return this.buttonClickSubject.asObservable();
    }

    public init(townSignpostViewModel: TownSignpostViewModel) {
        this.heroCountParent.active = false;
        this.button.node.on(Button.EventType.CLICK, () => {
            this.buttonClickSubject.next();
        });
        townSignpostViewModel.buildingFinishedSummoning$.subscribe(building => {            
            this.heroCount++;
            this.heroCountParent.active = this.heroCount > 0;
            this.heroCountLabel.string = this.heroCount.toString();
        })
    }
}

