'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('files', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			url: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			originalname: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			mimetype: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			size: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.createTable('files', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'new user'
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			banned: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			banReason: {
				type: Sequelize.STRING,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			}
		});

	}
};
