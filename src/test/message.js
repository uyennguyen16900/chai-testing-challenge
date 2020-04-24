require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID_1 = "aaaaaaaaaaaa"
const SAMPLE_OBJECT_ID_2 = "012345678910"
const SAMPLE_OBJECT_ID_3 = "bbbbbbbbbbbb"

describe('Message API endpoints', () => {
  beforeEach((done) => {
    // TODO: add any beforeEach code here
    const sampleUser = new User({
      username: 'myuser',
      password: 'mypassword',
      _id: SAMPLE_OBJECT_ID_1
    })

    const sampleMessage = new Message({
      title: 'mytitle',
      body: 'mybody',
      author: SAMPLE_OBJECT_ID_1,
      _id: SAMPLE_OBJECT_ID_2
    })

    Promise.all([sampleUser.save(), sampleMessage.save()])
    .then(() => {
      done()
    })
  })

  afterEach((done) => {
    // TODO: add any afterEach code here
    deletion1 = User.deleteMany({ username: ['myuser'] })
    deletion2 = Message.deleteMany({_id: SAMPLE_OBJECT_ID_2})

    Promise.all([deletion1, deletion2])
    .then(() => {
      done()
    })
  })

  it('should load all messages', (done) => {
    // TODO: Complete this
    chai.request(app)
    .get('/messages')
    .end((err, res) => {
      if (err) { done(err) }
      expect(res).to.have.status(200)
      expect(res.body.messages).to.be.an("array")
      done()
    })
  })

  it('should get one specific message', (done) => {
    // TODO: Complete this
    chai.request(app)
    .get(`/message/${SAMPLE_OBJECT_ID_2}`)
    .end((err, res) => {
      if (err) { done(err) }
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.title).to.equal('mytitle')
      expect(res.body.body).to.equal('mybody')
      expect(res.body.author).to.equal(ObjectID(SAMPLE_USER_ID_2).toString())

      done()
    })
  })

  it('should post a new message', (done) => {
    // TODO: Complete this
    chai.request(app)
    .post('/messages')
    .send({title: 'message',
           body: 'body',
           author: SAMPLE_OBJECT_ID_1,
           _id: SAMPLE_OBJECT_ID_3})
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.be.an('object')
      expect(res.body.message).to.have.property('title', 'message')
      expect(res.body.message).to.have.property('body', 'body')

      // check that message is actually inserted into database
      Message.findOne({title: 'message'}).then(message => {
        expect(message).to.be.an('object')
        done()
      })
    })
  })

  it('should update a message', (done) => {
    chai.request(app)
    .put(`/messages/${SAMPLE_OBJECT_ID_2}`)
    .send({title: 'anothermessage',
           body: 'anotherbody'})
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.be.an('object')
      expect(res.body.message).to.have.property('title', 'anothermessage')
      expect(res.body.message).to.have.property('body', 'anotherbody')

      // check that message is actually inserted into database
      Message.findOne({title: 'anothermessage'}).then(message => {
        expect(message).to.be.an('object')
        expect(message).to.have.property('body', 'anotherbody')
        done()
      })
    })
  })

  it('should delete a message', (done) => {
    // TODO: Complete this
    chai.request(app)
    .delete(`/messages/${SAMPLE_OBJECT_ID_2}`)
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.equal('Successfully deleted.')
      expect(res.body._id).to.equal(SAMPLE_OBJECT_ID_2)

      // check that message is actually deleted from database
      Message.findOne({title: 'mytitle'}).then(message => {
        expect(message).to.equal(null)
        done()
      })
    })
  })
})
