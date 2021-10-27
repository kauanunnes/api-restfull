const knex = require('knex')
const knexConfig = require('../../knexfile')
const knexConnection = knex(knexConfig.development)
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = async (req, res) => {
  const { login, password } = req.body
  if (!login || !password) {
    res.status(401).send('Empty field(s).')
    return
  }
  
  try {
    const data = await knexConnection.select().where({login}).table('users')
    
    if (data.length === 0) {
      res.status(400).JSON("ERROR: This user doesn't exist")
      return
    }

    let permission = bcrypt.compareSync(password, data[0].password);;

    if (!permission) {
      res.status(401).send('Invalid password.')
      return
    }

    const token = jwt.sign({login: data[0].login, admin: data[0].admin, id: data[0].id}, process.env.SECRET, {
      expiresIn: 86400,
    })
    return res.send({
      token: token
    })      
  } catch (error) {
    console.log(error);
    res.status(400).send('Something got in the way.')
  }
}
