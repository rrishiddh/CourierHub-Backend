import mongoose, { Document, Schema } from 'mongoose';

export interface IStatusLog {
  status: string;
  timestamp: Date;
  updatedBy: mongoose.Types.ObjectId;
  location?: string;
  note?: string;
}

export interface IParcel extends Document {
  trackingId: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  senderAddress: string;
  receiverAddress: string;
  parcelType: string;
  weight: number;
  description: string;
  fee: number;
  currentStatus: string;
  statusLogs: IStatusLog[];
  isActive: boolean;
  createdAt: Date;
  expectedDeliveryDate?: Date;
}

const statusLogSchema = new Schema<IStatusLog>({
  status: { 
    type: String, 
    enum: ['requested', 'approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned'],
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
  note: { type: String }
});

const parcelSchema = new Schema<IParcel>({
  trackingId: { type: String, unique: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  parcelType: { type: String, required: true },
  weight: { type: Number, required: true, min: 0.1 },
  description: { type: String, required: true },
  fee: { type: Number, required: true, min: 0 },
  currentStatus: { 
    type: String, 
    enum: ['requested', 'approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned'],
    default: 'requested'
  },
  statusLogs: [statusLogSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date }
});

parcelSchema.pre('save', function(next) {
  if (!this.trackingId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.trackingId = `TRK-${date}-${random}`;
  }
  
  if (this.isNew && this.statusLogs.length === 0) {
    this.statusLogs.push({
      status: 'requested',
      timestamp: new Date(),
      updatedBy: this.sender
    });
  }
  
  next();
});

export const Parcel = mongoose.model<IParcel>('Parcel', parcelSchema);