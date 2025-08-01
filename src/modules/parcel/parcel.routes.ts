import { Router } from 'express';
import {
  createParcel,
  getSenderParcels,
  getReceiverParcels,
  getParcelById,
  trackParcel,
  cancelParcel,
  confirmDelivery,
  getAllParcels,
  updateParcelStatus
} from './parcel.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', authorize('sender'), createParcel);
router.get('/my-sent', authorize('sender'), getSenderParcels);
router.get('/my-received', authorize('receiver'), getReceiverParcels);
router.get('/track/:trackingId', trackParcel);
router.get('/admin/all', authorize('admin'), getAllParcels);
router.get('/:id', getParcelById);
router.patch('/cancel/:id', authorize('sender'), cancelParcel);
router.patch('/confirm-delivery/:id', authorize('receiver'), confirmDelivery);
router.patch('/admin/update-status/:id', authorize('admin'), updateParcelStatus);

export default router;