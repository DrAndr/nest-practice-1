'use strict';

const bcrypt = require("bcryptjs");
const {PWD_SALT} = require("../../constants.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */


			//
			// const [adminRole] = await queryInterface.sequelize.query(
			//   `SELECT * FROM roles WHERE value = 'ADMIN' LIMIT 1;`
			// );
			//
			// const [adminPerm] = await queryInterface.sequelize.query(
			//   `SELECT * FROM user_roles WHERE userId = '${admin.id}' AND roleId = '${adminRole.id}'LIMIT 1;`
			// );

		const [result] = await queryInterface.sequelize.query(`
                SELECT u.id AS "userId", r.id AS "roleId"
                FROM users u
                         JOIN user_roles ur ON ur."userId" = u.id
                         JOIN roles r ON r.id = ur."roleId"
                WHERE u.name = 'admin'
                  AND r.value = 'ADMIN' LIMIT 1;
			`);

    // TODO add updating for reset default admin permission
    if (result.length > 0) return true;

		const [adminEmailUsed] = await queryInterface.sequelize.query(
			`SELECT * FROM users WHERE email = 'admin@example.com' LIMIT 1;`
		);

		if(adminEmailUsed.length > 0) { // Delete and recreate the default admin
			await queryInterface.sequelize.query(
				`DELETE FROM users WHERE email = 'admin@example.com';`
			);
		}
		const hashedPassword = await bcrypt.hash('admin', PWD_SALT);

		const [user] = await queryInterface.bulkInsert('users', [{
			name: 'admin',
			email: 'admin@example.com',
			password: hashedPassword,
			banned: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}], {returning: true});

		// 2. create roles
		const roles = await queryInterface.bulkInsert('roles', [
			{value: 'ADMIN', description: 'Administrator', createdAt: new Date(), updatedAt: new Date()},
			{value: 'USER', description: 'Regular user', createdAt: new Date(), updatedAt: new Date()}
		], {returning: true});

		// 3. get the ADMIN role id
		let adminRoleId;
		if (Array.isArray(roles)) {
			// Postgres
			adminRoleId = roles.find(r => r.value === 'ADMIN').id;
		}

		// 4. create relation on user_roles
		let adminUserId;
		if (typeof user === 'object') {
			adminUserId = user.id;
		}

		// set admin relation
		if (adminUserId && adminRoleId) {
			await queryInterface.bulkInsert('user_roles', [{
				userId: adminUserId,
				roleId: adminRoleId,
			}]);
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('user_roles', null, {});
		await queryInterface.bulkDelete('roles', null, {});
		await queryInterface.bulkDelete('users', null, {});
	}
};
