export default (sequelize, DataTypes) => {
  const Portfolio = sequelize.define("Portfolio", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT,
    avgPrice: DataTypes.FLOAT,
  });
  return Portfolio;
};
