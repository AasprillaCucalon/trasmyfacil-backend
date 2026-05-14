import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    subService: {
      type: String,
    },
    schedule: {
      type: String,
    },
    message: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Request", requestSchema);
