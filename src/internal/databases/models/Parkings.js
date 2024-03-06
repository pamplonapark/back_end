const { executeQuery } = require("../mysql_connector")

/**
 * Class representing parking information in the system.
 * Provides methods for retrieving parking data.
 */
class Parkings {
	/**
	  * Retrieves all parkings.
	  * @returns {Promise<Array>} A Promise that resolves to an array of all parkings.
	 */
	static getAll = async () => {
		let result = await executeQuery("SELECT * FROM Parkings", []);
		return result;
	}

	/**
	 * Retrieves a parking by its UUID.
	 * @param {string} uuid - The UUID of the parking.
	 * @returns {Promise<Array>} A Promise that resolves to the parking data if found.
	 */
	static getByUUID = async (uuid) => {
		let result = await executeQuery("SELECT * FROM Parkings WHERE uuid = ?", [uuid]);
		return result;
	}

	/**
	  * Retrieves the prices of a parking by its UUID.
	  * @param {string} uuid - The UUID of the parking.
	  * @returns {Promise<Array>} A Promise that resolves to the prices of the parking if found.
	  */
	static getPriceByUUID = async (uuid) => {
		let result = await executeQuery("SELECT PC.* FROM Parkings_Prices PC INNER JOIN Parkings P ON PC.id_parking = P.id AND P.uuid = ?", [uuid]);
		return result;
	}
}

module.exports = { Parkings }