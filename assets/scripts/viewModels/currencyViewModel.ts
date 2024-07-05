import { Observable } from "rxjs";
import { GameState } from "../models/gameState";

export class CurrencyViewModel {
    private _gameState$: Observable<GameState> = null!;

    get gameState$() {
        return this._gameState$;
    }

    constructor(gameState$: Observable<GameState>) {
        this._gameState$ = gameState$;
    }
}
