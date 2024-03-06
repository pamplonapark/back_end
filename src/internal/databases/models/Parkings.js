const { executeQuery } = require("../mysql_connector")

class Parkings {
	static getAll = async () => {
		let result = await executeQuery("SELECT * FROM Parkings", []);
		return result;
	}

	static getByUUID = async (uuid) => {
		let result = await executeQuery("SELECT * FROM Parkings WHERE uuid = ?", [uuid]);
		return result;
	}
}

module.exports = { Parkings }