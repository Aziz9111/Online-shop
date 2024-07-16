const bcrypt = require("bcryptjs");

const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(name, email, password, street, city) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.street = street;
    this.city = city;
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserEmail() {
    return db
      .getDb()
      .collection("users")
      .findOne({ email: this.email.toLowerCase() });
  }

  async userExist() {
    const userExist = await this.getUserEmail();

    if (userExist) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db
      .getDb()
      .collection("users")
      .insertOne({
        name: this.name,
        email: this.email,
        password: hashedPassword,
        address: {
          street: this.street,
          city: this.city,
        },
      });
  }

  async comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
