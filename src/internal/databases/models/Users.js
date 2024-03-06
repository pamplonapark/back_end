const { executeQuery } = require("../mysql_connector")

/**
 * Class representing users in the system.
 * Provides methods for user validation, registration, and retrieval.
 */
class Users {
	/**
	  * Validates user credentials.
	  * @param {string} username - The username of the user.
	  * @param {string} password - The password of the user.
	  * @param {string} email - The email of the user.
	  * @returns {Promise<Array>} A Promise that resolves to the user data if validation succeeds.
	  */
	static validateUser = async (username, password, email) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ? AND password_ = ? AND email = ?", [username, password, email]);
		return result;
	}

	/**
	  * Searches for a user by username.
	  * @param {string} username - The username of the user to search for.
	  * @returns {Promise<Array>} A Promise that resolves to the user data if found.
	  */
	static searchUser = async (username) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ?", [username]);
		return result;
	}

	/**
	  * Registers a new user.
	  * @param {string} username - The username of the new user.
	  * @param {string} email - The email of the new user.
	  * @param {string} password - The password of the new user.
	  * @returns {Promise<Array>} A Promise that resolves to the result of the registration operation.
	  */
	static registerUser = async (username, email, password) => {
		let result = await executeQuery("INSERT INTO Users_(username, email, password_) VALUES(?, ?, ?)", [username, email, password]);
		return result;
	}

	/**
	  * Searches for a user by authentication details.
	  * @param {string} username - The username of the user.
	  * @param {string} uuid - The UUID of the user.
	  * @returns {Promise<Array>} A Promise that resolves to the user data if found.
	  */
	static searchByAuth = async (username, uuid) => {
		let result = await executeQuery("SELECT * FROM Users_ WHERE username = ? AND uuid = ?", [username, uuid]);
		return result;
	}

	/**
	  * Retrieves the favorite parkings of a user.
	  * @param {string} uuid - The UUID of the user.
	  * @returns {Promise<Array>} A Promise that resolves to the favorite parkings of the user.
	  */
	static getFavorites = async (uuid) => {
		let result = await executeQuery("SELECT P.* FROM Parkings P INNER JOIN User_favorite FV ON FV.id_favorite = P.id INNER JOIN Users_ U ON (U.id = FV.id_user) AND U.uuid = ?", [uuid])
		return result;
	}
}

module.exports = { Users }