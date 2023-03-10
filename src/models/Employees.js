import mongoose from 'mongoose';

const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, require: true },
  dni: { type: Number, required: true },
  firebaseUid: { type: String, required: true },
});

export default mongoose.model('Employee', employeeSchema);
