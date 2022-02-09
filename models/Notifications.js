import mongoose from 'mongoose'

const NotificationsSchema = new mongoose.Schema(
  {
    responsibleUserId: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    dbName: { type: String, default: '' },
    itemId: { type: String, default: '' },
    oldItem: { type: mongoose.Schema.Types.Mixed, default: null },
    newItem: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, default: null },
  },
  { timestamps: true }
)

export default mongoose.models.Notifications ||
  mongoose.model('Notifications', NotificationsSchema)
