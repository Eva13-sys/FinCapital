export default (sequelize, DataTypes) => {
    const User =  sequelize.define("User", {
        id: { type: DataTypes.I}
    })
}