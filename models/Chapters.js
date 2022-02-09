import mongoose from 'mongoose'
import chaptersSchema from '@schemas/chaptersSchema'

const ChaptersSchema = new mongoose.Schema(chaptersSchema, { timestamps: true })

export default mongoose.models.Chapters ||
  mongoose.model('Chapters', ChaptersSchema)
