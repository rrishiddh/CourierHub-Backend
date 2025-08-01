import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { User } from './user.model';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, isActive } = req.query;
    const filter: any = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter).select('-password');
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'blocked'} successfully`,
      user: { id: user._id, name: user.name, isActive: user.isActive }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};