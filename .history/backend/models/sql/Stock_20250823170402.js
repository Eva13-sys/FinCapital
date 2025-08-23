export default (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stock", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticker: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    sector: DataTypes.STRING,
    price: DataTypes.FLOAT,
    marketCap: DataTypes.FLOAT,
  });
  return Stock;
};
