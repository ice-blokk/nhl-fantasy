const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/roster/:team', async (req, res) => {
  try {
    const { team } = req.params
    const response = await axios.get(`https://api-web.nhle.com/v1/roster/${team}/20252026`)
    res.json(response.data)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to fetch roster from NHL API' })
  }
})

const { PrismaClient } = require('../generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')
require('dotenv').config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

router.post('/roster/add', async (req, res) => {
  const {
    nhlId, firstName, lastName, positionCode,
    sweaterNumber, shootsCatches, heightInInches,
    weightInPounds, birthCity, birthCountry
  } = req.body

  try {
    const player = await prisma.player.upsert({
      where: { nhlId },
      update: {},
      create: {
        nhlId, firstName, lastName, positionCode,
        sweaterNumber, shootsCatches, heightInInches,
        weightInPounds, birthCity, birthCountry
      }
    })
    res.json({ success: true, player })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to add player' })
  }
})

router.get('/players', async (req, res) => {
  try {
    const players = await prisma.player.findMany()
    res.json(players)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to fetch players' })
  }
})

// sort players by any field
router.get('/players/sorted/:sortField/:order', async (req, res) => {
  try {
    const { sortField, order } = req.params
    const players = await prisma.player.findMany({
      orderBy: {
        [sortField]: order
      }
    })
    res.json(players)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to fetch sorted players' })
  }
})

// filter players by any field
router.get('/players/filtered/:filterField/:filterValue', async (req, res) => {
  try {
    const { filterField, filterValue } = req.params
    const players = await prisma.player.findMany({
      where: {
        [filterField]: filterValue
      }
    })
    res.json(players)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to fetch filtered players' })
  }
})

// DELETE a player
router.post('/roster/remove', async (req, res) => {
  const { nhlId } = req.body
  try {
    await prisma.player.delete({ where: { nhlId } })
    res.json({ success: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to remove player' })
  }
})

// EDIT a player
router.patch('/players/edit/:nhlId', async (req, res) => {
  const nhlId = parseInt(req.params.nhlId)
  const { sweaterNumber, positionCode, shootsCatches, heightInInches, weightInPounds } = req.body
  try {
    const updated = await prisma.player.update({
      where: { nhlId },
      data: { sweaterNumber, positionCode, shootsCatches, heightInInches, weightInPounds }
    })
    res.json(updated)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to update player' })
  }
})

router.get('/player/:id/stats', async (req, res) => {
  try {
    const { id } = req.params
    const response = await axios.get(`https://api-web.nhle.com/v1/player/${id}/landing`)
    const season = response.data.featuredStats?.regularSeason?.subSeason
    res.json({
      goals: season?.goals ?? 0,
      assists: season?.assists ?? 0,
      points: season?.points ?? 0
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Failed to fetch player stats' })
  }
})

module.exports = router