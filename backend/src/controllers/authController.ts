import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { generateToken } from '../config/jwt';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, phoneNumber } = req.body;
      
      // Validate input
      if (!email || !password || !fullName || !phoneNumber) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }
      
      // Create user
      const user = new User({
        email,
        password,
        fullName,
        phoneNumber,
        isAdmin: false
      });
      
      await user.save();
      
      // Generate token
      const userId = (user._id as any).toString();
      const token = generateToken({
        userId,
        email: user.email,
        isAdmin: user.isAdmin
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Generate token
      const userId = (user._id as any).toString();
      const token = generateToken({
        userId,
        email: user.email,
        isAdmin: user.isAdmin
      });
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
  
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure that req.user is properly typed and available
      const user = await User.findById(req.user?.userId).select('-password');
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({ user });
    } catch (error: any) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
}

export default new AuthController();
