import { _decorator, Component, Node, Button, Sprite } from 'cc';
import { Observable, Subject } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('TownBuilding')
export class TownBuilding extends Component {
    @property
    private id: string = '';
    @property(Button)
    private button: Button = null!;
    @property(Node)
    private summoningIcon: Node = null!;

    private buttonClickSubject = new Subject<string>();

    get buttonClick$() {
        return this.buttonClickSubject.asObservable();
    }

    onLoad() {
        // TODO: For some reason the icon is OK here
        // but I getn null on init
        this.summoningIcon.active = false;
    }

    public init(panelStateChange$: Observable<[boolean, boolean]>) {
        this.button.node.on(Button.EventType.CLICK, () => {
            this.buttonClickSubject.next(this.id);
        });
        panelStateChange$.subscribe(([visible, processing]) => {
            // Why is this null here?
            if (this.summoningIcon) {
                this.summoningIcon.active = !visible && processing;
            }
            else {
                console.error('Error summoningIcon in null and no idea why');
            }
        })
    }
}

