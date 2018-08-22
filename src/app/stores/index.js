import User from './models/User';
import Manager from './models/Manager';
import Alert from './sessions/Alert';

class RootStore {
	constructor() {
		this.UserStore = new User(this);
		this.ManagerStore = new Manager(this);
		this.AlertStore = new Alert(this);
	}
}

export default new RootStore();