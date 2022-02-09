import mongoose from 'mongoose'
import lecturesSchema from '@schemas/lecturesSchema'

const LecturesSchema = new mongoose.Schema(lecturesSchema, { timestamps: true })

export default mongoose.models.Lectures ||
  mongoose.model('Lectures', LecturesSchema)
