const knex = require('knex')
const knexConfig = require('../../knexfile')
const knexConnection = knex(knexConfig.development)

module.exports = {
  async getJobs (req, res) {
    try { 
      let data = await knexConnection.select().table('jobs')
      res.send(data)
    } catch (error) {
      console.log(error);
    }
  },
  
  async getJob(req, res) {
    const id = req.params.id
    
    try {
      const job = await knexConnection.select().where({
        id
      }).table('jobs')
  
      if (job.length === 0) {
        res.status(400).send("This job doesn't exist.")
        return
      }
  
      res.status(200).send(job)
  
    } catch (error) {
      console.log(error);
    }
  

  },

  async createJob(req, res) {
    try {
      const {name, sector} = req.body
      if (!name || !sector) {
        res.status(400).send('Empty field(s)')
        return
      }

      const sectorData = await knexConnection.select().where({id: sector}).table('sectors')

      if (sectorData.length === 0) {
        res.status(400).send(`This sector doesn't exist`)
        return
      }

      let data = await knexConnection.insert({
        name, 
        sector
      }).into('jobs')
      console.log(data);
      res.status(200).send(`${name} created successfully`)
    } catch (error) {
      console.log(error);
      return
    }

  },

  async editJob(req, res) {
    const {
      id,
      name,
      sector
    } = req.body
    try {
      if (!id || !name || !sector) {
        res.status(400).send("Empty field(s)")
        return
      }

      const sectorData = await knexConnection.select().where({id: sector}).table('sectors')

      if (sectorData.length === 0) {
        res.status(400).send(`This sector doesn't exist`)
        return
      }
      
      const data = await knexConnection.select().where({
        id
      }).update({
        name,
        sector
      }).table('jobs')

      if (data.length === 0) {
        res.status(400).send("This job doesn't exist")
        return
      }

      res.status(200).send(`The sector ${name} was modified`)
    } catch (error) {
      console.log(error);
    }


  },

  async deleteJob(req, res) {
    const id = req.body.id

    if (!id) {
      res.status(400).send('Empty field')
    }

    try {
      const data = await knexConnection.where({id}).delete().table('jobs')
      
      if (data === 0) {
        res.status(400).send("This job doesn't exist")
        return
      }

      res.status(200).send("This job was deleted")

    } catch (error) {
      console.log(error);
      return
    }

  }
}
