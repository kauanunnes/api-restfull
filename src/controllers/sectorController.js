const knex = require('knex')
const knexConfig = require('../../knexfile')
const knexConnection = knex(knexConfig.development)

module.exports = {
  async getSectors(req, res) {
    try {
      const data = await knexConnection.select().table('sectors')
      res.status(200).send(data)
    } catch (err) {
      console.log(err);
    }
  },

  async getSector(req, res) {
    const id = req.params.id
    try {
      const sector = await knexConnection.select().where({
        id
      }).table('sectors')

      if (sector.length === 0) {
        res.status(400).send("This sector doesn't exist.")
        return
      }

      res.status(200).send(sector)

    } catch (error) {
      console.log(error);
    }
  },

  async createSector(req, res) {
    console.log(req.body);

    try {
      const name = req.body.name
      if (!name) {
        res.status(400).send('Campos vazios')
        return
      }
      let data = await knexConnection.insert({
        name
      }).into('sectors')
      console.log(data);
      res.status(200).send(`${name} created successfully`)
    } catch (error) {
      console.log(error);
    }
  },
  async editSector(req, res) {
    const {
      id,
      name
    } = req.body
    try {
      if (!id || !name) {
        res.status(400).send("Empty field(s)")
        return
      }

      const data = await knexConnection.select().where({
        id
      }).update({
        name
      }).table('sectors')

      if (data.length === 0) {
        res.status(400).send("This sector doesn't exist")
        return
      }

      res.status(200).send(`The sector ${name} was modified`)
    } catch (error) {
      console.log(error);
    }

  },
  async deleteSector(req, res) {
    const id = req.body.id

    if (!id) {
      res.status(400).send('Empty field')
    }

    try {
      const data = await knexConnection.where({id}).delete().table('sectors')
      
      if (data === 0) {
        res.status(400).send("This sector doesn't exist")
        return
      }

      res.status(200).send("This sector was deleted")

    } catch (error) {
      console.log(error);
    }

  }
}