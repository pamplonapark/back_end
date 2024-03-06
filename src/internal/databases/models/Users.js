const { executeQuery } = require("../mysql_connector")

class Users {
	static validateUser = async (username, password, email) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ? AND password_ = ? AND email = ?", [username, password, email]);
		return result;
	}

	static searchUser = async (username) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ?", [username]);
		return result;
	}

	static registerUser = async (username, email, password) => {
		let result = await executeQuery("INSERT INTO Users_(username, email, password_) VALUES(?, ?, ?)", [username, email, password]);
		return result;
	}

	static searchByAuth = async (username, uuid) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ? AND uuid = ?", [username, uuid]);
		return result;
	}

	static getFavorites = async (username, uuid) => {
		let result = await executeQuery("SELECT P.id, P.name, P.address, P.available_spots, P.telephone FROM Parkings P INNER JOIN User_favorite FV ON FV.id_favorite = P.id INNER JOIN Users_ U ON (U.id = FV.id_user) AND (U.id = ? AND U.uuid = ?)", [username, uuid])
		return result;
	}
}

module.exports = { Users }