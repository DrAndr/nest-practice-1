'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. remove old column image
    await queryInterface.removeColumn('posts', 'image');

    // 2. add new column previewImage with ForeignKey for files.id
    await queryInterface.addColumn('posts', 'previewImage', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // если файл удалён → previewImage = NULL
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'previewImage');

    await queryInterface.addColumn('posts', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
