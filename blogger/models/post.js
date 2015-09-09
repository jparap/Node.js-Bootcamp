let mongoose = require('mongoose')

require('songbird')

let PostSchema = mongoose.Schema({
  email: {
  type: String,
  required: true
  },
	title: {
	type: String,
	required: true	
	},
	content: {
	type: String,
	required: true	
	},
	image: {
	data: Buffer,
	contentType: String	
	},
	date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', PostSchema)