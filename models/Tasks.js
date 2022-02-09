import mongoose from 'mongoose'
import tasksSchema from '@schemas/tasksSchema'

const TasksSchema = new mongoose.Schema(tasksSchema, { timestamps: true })

export default mongoose.models.Tasks || mongoose.model('Tasks', TasksSchema)
