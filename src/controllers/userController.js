const knex = require('knex')
const knexConfig = require('../../knexfile')
const knexConnection = knex(knexConfig.development)
const bcrypt = require('bcrypt');


module.exports = {
  async getUsers(req, res) {
    try {
      let data = await knexConnection.select().table('users')

      res.send(data)
    } catch (error) {
      console.log(error);
    }
  },

  async getUser(req, res) {
    const id = req.params.id

    try {
      const user = await knexConnection.select().where({
        id
      }).table('users')

      if (user.length === 0) {
        res.status(400).send("This user doesn't exist.")
        return
      }

      res.status(200).send(user)

    } catch (error) {
      console.log(error);
    }

  },

  async createUser(req, res) {
    const isAdmin = req.admin

    if (!isAdmin) {
      res.status(401).send("You aren't an admin.")
      return
    }
    
    let {
      name,
      login,
      password,
      phone,
      job
    } = req.body

    if (!name || !login || !password || !job) {
      res.status(400).send('Empty required field(s).')
      return
    }

    let phoneArray = phone.split(',')

    try {
      const jobData = await knexConnection.select().where({
        id: job
      }).table('jobs')

      if (jobData.length === 0) {
        res.status(400).send(`This job doesn't exist`)
        return
      }
      
      const hash = bcrypt.hashSync(password, 10);
      const data = await knexConnection.insert({
        name,
        login,
        password: hash,
        phone: phoneArray,
        job
      }).into('users')
      
      return res.status(200).send(`${name} was created successfully.`)
    } catch (error) {
      console.log(error);
      return
    }
  },

  async editUser(req, res) {
    let {
      id,
      name,
      login,
      password,
      phone,
      job
    } = req.body

    if (!name || !login || !password || !job || !id) {
      res.status(400).send('Empty required field(s).')
      return
    }


    let phoneArray = !phone ? [] : phone.split(',')

    try {
      const userData = await knexConnection.select().where({
        id
      }).table('users')

      if (userData.length === 0) {
        res.status(400).send(`This user doesn't exist`)
        return
      }

      const jobData = await knexConnection.select().where({
        id: job
      }).table('jobs')

      if (jobData.length === 0) {
        res.status(400).send(`This job doesn't exist`)
        return
      }

      const data = await knexConnection.where({
        id
      }).update({
        name,
        login,
        password,
        phone: phoneArray,
        job
      }).table('users')
      res.status(200).send(`${name} was edited successfully.`)

    } catch (error) {
      console.log(error);
      return
    }

  },

  async deleteUser(req, res) {
    const idLoggedUser = req.id
    const id = req.body.id
    if (idLoggedUser == id) {
      res.status(400).send("Users cannot do an autodelete.")
      return 
    }

    if (!id) {
      res.status(400).send('Empty field')
    }

    try {
      const data = await knexConnection.where({
        id
      }).delete().table('users')

      if (data === 0) {
        res.status(400).send("This user doesn't exist")
        return
      }

      res.status(200).send("This user was deleted")

    } catch (error) {
      console.log(error);
      return
    }
  },

}