const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    NotificationSchema = new Schema([
        {
            userId: String,
            notifications: [
                {
                    fromUser: { type: Schema.Types.ObjectId, ref: 'User' }
                }
            ]
        }
    ])

const Notification = mongoose.model('Notification', NotificationSchema, 'notifications')

module.exports = Notification