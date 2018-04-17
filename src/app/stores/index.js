import User from './models/User';
import Manager from './models/Manager';

class RootStore {
	constructor() {
		this.UserStore = new User(this);
		this.ManagerStore = new Manager(this);
	}
}

export default new RootStore();