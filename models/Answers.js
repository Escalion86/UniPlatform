import mongoose from 'mongoose'
import answersSchema from '@schemas/answersSchema'

const AnswersSchema = new mongoose.Schema(answersSchema, { timestamps: true })

export default mongoose.models.Answers ||
  mongoose.model('Answers', AnswersSchema)
