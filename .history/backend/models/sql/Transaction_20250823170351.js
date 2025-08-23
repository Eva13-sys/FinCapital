export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER,
    type: { type: DataTypes.ENUM("buy", "sell") },
    quantity: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return Transaction;
};
