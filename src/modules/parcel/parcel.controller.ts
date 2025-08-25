import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { Parcel } from './parcel.model';
import { User } from '../user/user.model';
import { calculateFee } from '../../utils/feeCalculator';

export const createParcel = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverEmail, receiverAddress, parcelType, weight, description } = req.body;
    
    const receiver = await User.findOne({ email: receiverEmail, role: 'receiver' });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const fee = calculateFee(weight, parcelType);
    
    const parcel = await Parcel.create({
      sender: req.user.id,
      receiver: receiver._id,
      senderAddress: req.user.address,
      receiverAddress,
      parcelType,
      weight,
      description,
      fee
    });

    await parcel.populate('sender receiver', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Parcel created successfully',
      parcel
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSenderParcels = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = { sender: req.user.id };
    
    if (status) filter.currentStatus = status;

    const parcels = await Parcel.find(filter)
      .populate('sender receiver', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, parcels });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getReceiverParcels = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = { receiver: req.user.id };
    
    if (status) filter.currentStatus = status;

    const parcels = await Parcel.find(filter)
      .populate('sender', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, parcels });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getParcelById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findById(id)
      .populate('sender receiver', 'name email phone')
      .populate('statusLogs.updatedBy', 'name');

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    const canAccess = req.user.role === 'admin' || 
                     parcel.sender.toString() === req.user.id ||
                     parcel.receiver.toString() === req.user.id;

    if (!canAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, parcel });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const trackParcel = async (req: AuthRequest, res: Response) => {
  try {
    const { trackingId } = req.params;
    const parcel = await Parcel.findOne({ trackingId })
      .populate('sender receiver', 'name email phone')
      .populate('statusLogs.updatedBy', 'name');

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    res.json({ success: true, parcel });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelParcel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    if (parcel.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only sender can cancel parcel' });
    }

    if (['dispatched', 'in-transit', 'delivered'].includes(parcel.currentStatus)) {
      return res.status(400).json({ message: 'Cannot cancel dispatched parcel' });
    }

    parcel.currentStatus = 'cancelled';
    parcel.statusLogs.push({
      status: 'cancelled',
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await parcel.save();

    res.json({
      success: true,
      message: 'Parcel cancelled successfully',
      parcel
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const confirmDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    if (parcel.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only receiver can confirm delivery' });
    }

    if (parcel.currentStatus !== 'in-transit') {
      return res.status(400).json({ message: 'Parcel must be in transit to confirm delivery' });
    }

    parcel.currentStatus = 'delivered';
    parcel.statusLogs.push({
      status: 'delivered',
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await parcel.save();

    res.json({
      success: true,
      message: 'Delivery confirmed successfully',
      parcel
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllParcels = async (req: AuthRequest, res: Response) => {
  try {
    const { status, sender, receiver } = req.query;
    const filter: any = {};
    
    if (status) filter.currentStatus = status;
    if (sender) filter.sender = sender;
    if (receiver) filter.receiver = receiver;

    const parcels = await Parcel.find(filter)
      .populate('sender receiver', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, parcels });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateParcelStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    parcel.currentStatus = status;
    parcel.statusLogs.push({
      status,
      updatedBy: req.user.id,
      timestamp: new Date(),
      location,
      note
    });

    await parcel.save();

    res.json({
      success: true,
      message: 'Parcel status updated successfully',
      parcel
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};