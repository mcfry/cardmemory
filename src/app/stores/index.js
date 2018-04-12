import User from './models/User';
import Deck from './models/Deck';

class RootStore {
	constructor() {
		this.UserStore = new User(this);
		this.DeckStore = new Deck(this);
	}
}

export default new RootStore();