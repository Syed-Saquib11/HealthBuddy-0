import mongoose from "mongoose";

const reportedOutbreakSchema = new mongoose.Schema({
  report_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  disease_name: {
    type: String,
    required: true,
  },
  city: String,
  state: String,
//   location: { // GeoJSON Point format for lat/lon
//     type: {
//       type: String,
//       enum: ['Point'],
//       default: 'null',
//     },
//     coordinates: {
//       type: [Number], // [longitude, latitude]
//       required: true,
//       validate: {
//         validator: function (value) {
//           return value.length === 2 && 
//                  value[0] >= -180 && value[0] <= 180 &&
//                  value[1] >= -90 && value[1] <= 90;
//         },
//         message: 'Invalid coordinates'
//       }
//     }
//   },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  reported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming User model exists
    required: false,
  },
   cases_reported: {
    type: Number,
    required: true,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

// Create a 2dsphere index on location for geospatial queries
reportedOutbreakSchema.index({ location: '2dsphere' });

const ReportedOutbreak = mongoose.model('ReportedOutbreak', reportedOutbreakSchema);

export default ReportedOutbreak;
