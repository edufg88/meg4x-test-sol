import { _decorator, Component, Node, Button } from 'cc';
import { Subject } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('TownBuilding')
export class TownBuilding extends Component {
    @property
    private id: string = '';
    @property(Button)
    private button: Button = null!;

    private buttonClickSubject = new Subject<string>();

    get buttonClick$() {
        return this.buttonClickSubject.asObservable();
    }

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, () => {
            this.buttonClickSubject.next(this.id);
        });
    }
}

