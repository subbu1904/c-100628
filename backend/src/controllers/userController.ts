
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/userRepository';
import { User } from '../types/user';

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Register new user
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      // Check if user already exists
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await this.userRepository.createUser({
        id: uuidv4(),
        email,
        name,
        password_hash: hashedPassword,
        role: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Login with email and password
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Get user by email
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Login with OTP
  loginWithOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(400).json({ error: 'Email and OTP are required' });
        return;
      }

      // Verify OTP (mock implementation - would verify against stored OTP in real app)
      if (otp !== '123456') {
        res.status(401).json({ error: 'Invalid OTP' });
        return;
      }

      // Get user by email
      let user = await this.userRepository.getUserByEmail(email);
      
      // If user doesn't exist, create a new one
      if (!user) {
        user = await this.userRepository.createUser({
          id: uuidv4(),
          email,
          name: email.split('@')[0],
          password_hash: '',
          role: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Error in loginWithOtp:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Send OTP (mock implementation)
  sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      // In a real app, we would generate an OTP, store it, and send it to the user
      // For now, we'll just return success
      console.log(`Mock OTP sent to ${email}: 123456`);

      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error in sendOtp:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get user profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Get membership info
      const membership = await this.userRepository.getUserMembership(userId);

      // Get additional profile data like points, badges, etc.
      const points = await this.userRepository.getUserPoints(userId);
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        membership: membership || { type: 'free' },
        points: points
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update user profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { name, avatarUrl } = req.body;
      
      const updatedUser = await this.userRepository.updateUser(userId, {
        name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatar_url,
        createdAt: updatedUser.created_at
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Upgrade to premium
  upgradeToPermium = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Update user role
      const updatedUser = await this.userRepository.updateUser(userId, {
        role: 'premium',
        updated_at: new Date().toISOString()
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Create or update membership
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month membership

      await this.userRepository.createOrUpdateMembership(userId, {
        type: 'premium',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true
      });

      res.json({
        success: true,
        message: 'Upgraded to premium successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error('Error in upgradeToPermium:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Downgrade to free
  downgradeToFree = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Update user role
      const updatedUser = await this.userRepository.updateUser(userId, {
        role: 'free',
        updated_at: new Date().toISOString()
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Update membership
      await this.userRepository.createOrUpdateMembership(userId, {
        type: 'free',
        auto_renew: false
      });

      res.json({
        success: true,
        message: 'Downgraded to free successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error('Error in downgradeToFree:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get all users (admin only)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      const users = await this.userRepository.getAllUsers();
      
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at
      })));
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
