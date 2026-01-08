import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseAuthRepository } from './repositories/supabase-auth.repository';
import { IAuthResponseData, IEmailSignUpAdditionalData, IPhoneSignUpAdditionalData, IUpdateUserData, IChannelData } from './interface';
import { User, Session } from '@supabase/supabase-js';

describe('SupabaseAuthService', () => {
  let service: SupabaseAuthService;
  let repository: jest.Mocked<SupabaseAuthRepository>;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    phone: '+1234567890',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
  } as User;

  const mockSession: Session = {
    access_token: 'token',
    refresh_token: 'refresh',
    expires_in: 3600,
    expires_at: 1234567890,
    token_type: 'bearer',
    user: mockUser,
  } as Session;

  const mockAuthResponse: IAuthResponseData = {
    user: mockUser,
    session: mockSession,
  };

  const mockErrorResponse: IAuthResponseData = {
    user: null,
    session: null,
    error: {
      message: 'Test error',
      status: 400,
    },
  };

  beforeEach(async () => {
    const mockRepository = {
      emailSignIn: jest.fn(),
      emailSignUp: jest.fn(),
      phoneSignUp: jest.fn(),
      phoneSignIn: jest.fn(),
      deleteUser: jest.fn(),
      updateUser: jest.fn(),
      verifyEmailOtp: jest.fn(),
      verifyPhoneOtp: jest.fn(),
      requestEmailOtp: jest.fn(),
      requestPhoneOtp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseAuthService,
        {
          provide: SupabaseAuthRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SupabaseAuthService>(SupabaseAuthService);
    repository = module.get(SupabaseAuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emailSignIn', () => {
    it('should successfully sign in a user with email and password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      repository.emailSignIn.mockResolvedValue(mockAuthResponse);

      const result = await service.emailSignIn(email, password);

      expect(repository.emailSignIn).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should return error response when sign in fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      repository.emailSignIn.mockResolvedValue(mockErrorResponse);

      const result = await service.emailSignIn(email, password);

      expect(repository.emailSignIn).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('emailSignUp', () => {
    it('should successfully sign up a user with email and password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      repository.emailSignUp.mockResolvedValue(mockAuthResponse);

      const result = await service.emailSignUp(email, password);

      expect(repository.emailSignUp).toHaveBeenCalledWith(email, password, undefined);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should successfully sign up with additional data', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const additionalData: IEmailSignUpAdditionalData = {
        emailRedirectTo: 'https://example.com/callback',
        data: { name: 'Test User' },
      };
      repository.emailSignUp.mockResolvedValue(mockAuthResponse);

      const result = await service.emailSignUp(email, password, additionalData);

      expect(repository.emailSignUp).toHaveBeenCalledWith(email, password, additionalData);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
    });

    it('should return error response when sign up fails', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      repository.emailSignUp.mockResolvedValue(mockErrorResponse);

      const result = await service.emailSignUp(email, password);

      expect(repository.emailSignUp).toHaveBeenCalledWith(email, password, undefined);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('phoneSignUp', () => {
    it('should successfully sign up a user with phone and password', async () => {
      const phone = '+1234567890';
      const password = 'password123';
      repository.phoneSignUp.mockResolvedValue(mockAuthResponse);

      const result = await service.phoneSignUp(phone, password);

      expect(repository.phoneSignUp).toHaveBeenCalledWith(phone, password, undefined);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should successfully sign up with additional data', async () => {
      const phone = '+1234567890';
      const password = 'password123';
      const additionalData: IPhoneSignUpAdditionalData = {
        channel: 'sms',
        data: { name: 'Test User' },
      };
      repository.phoneSignUp.mockResolvedValue(mockAuthResponse);

      const result = await service.phoneSignUp(phone, password, additionalData);

      expect(repository.phoneSignUp).toHaveBeenCalledWith(phone, password, additionalData);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
    });

    it('should return error response when sign up fails', async () => {
      const phone = '+1234567890';
      const password = 'password123';
      repository.phoneSignUp.mockResolvedValue(mockErrorResponse);

      const result = await service.phoneSignUp(phone, password);

      expect(repository.phoneSignUp).toHaveBeenCalledWith(phone, password, undefined);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('phoneSignIn', () => {
    it('should successfully sign in a user with phone and password', async () => {
      const phone = '+1234567890';
      const password = 'password123';
      repository.phoneSignIn.mockResolvedValue(mockAuthResponse);

      const result = await service.phoneSignIn(phone, password);

      expect(repository.phoneSignIn).toHaveBeenCalledWith(phone, password);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should return error response when sign in fails', async () => {
      const phone = '+1234567890';
      const password = 'wrongpassword';
      repository.phoneSignIn.mockResolvedValue(mockErrorResponse);

      const result = await service.phoneSignIn(phone, password);

      expect(repository.phoneSignIn).toHaveBeenCalledWith(phone, password);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const userId = 'user-123';
      repository.deleteUser.mockResolvedValue(undefined);

      const result = await service.deleteUser(userId);

      expect(repository.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });

    it('should return error object when deletion fails', async () => {
      const userId = 'user-123';
      const errorResponse = {
        error: {
          message: 'User not found',
          status: 404,
        },
      };
      repository.deleteUser.mockResolvedValue(errorResponse);

      const result = await service.deleteUser(userId);

      expect(repository.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(errorResponse);
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user', async () => {
      const userId = 'user-123';
      const updateUserData: IUpdateUserData = {
        email: 'newemail@example.com',
        user_metadata: { name: 'Updated Name' },
      };
      repository.updateUser.mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, updateUserData);

      expect(repository.updateUser).toHaveBeenCalledWith(userId, updateUserData);
      expect(result).toEqual(mockUser);
    });

    it('should return error object when update fails', async () => {
      const userId = 'user-123';
      const updateUserData: IUpdateUserData = {
        email: 'invalid-email',
      };
      const errorResponse = {
        error: {
          message: 'Invalid email',
          status: 400,
        },
      };
      repository.updateUser.mockResolvedValue(errorResponse);

      const result = await service.updateUser(userId, updateUserData);

      expect(repository.updateUser).toHaveBeenCalledWith(userId, updateUserData);
      expect(result).toEqual(errorResponse);
    });
  });

  describe('verifyEmailOtp', () => {
    it('should successfully verify email OTP', async () => {
      const email = 'test@example.com';
      const token = '123456';
      repository.verifyEmailOtp.mockResolvedValue(mockAuthResponse);

      const result = await service.verifyEmailOtp(email, token);

      expect(repository.verifyEmailOtp).toHaveBeenCalledWith(email, token);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should return error response when verification fails', async () => {
      const email = 'test@example.com';
      const token = 'invalid-token';
      repository.verifyEmailOtp.mockResolvedValue(mockErrorResponse);

      const result = await service.verifyEmailOtp(email, token);

      expect(repository.verifyEmailOtp).toHaveBeenCalledWith(email, token);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('verifyPhoneOtp', () => {
    it('should successfully verify phone OTP', async () => {
      const phone = '+1234567890';
      const token = '123456';
      repository.verifyPhoneOtp.mockResolvedValue(mockAuthResponse);

      const result = await service.verifyPhoneOtp(phone, token);

      expect(repository.verifyPhoneOtp).toHaveBeenCalledWith(phone, token);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should return error response when verification fails', async () => {
      const phone = '+1234567890';
      const token = 'invalid-token';
      repository.verifyPhoneOtp.mockResolvedValue(mockErrorResponse);

      const result = await service.verifyPhoneOtp(phone, token);

      expect(repository.verifyPhoneOtp).toHaveBeenCalledWith(phone, token);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('requestEmailOtp', () => {
    it('should successfully request email OTP', async () => {
      const email = 'test@example.com';
      repository.requestEmailOtp.mockResolvedValue(mockAuthResponse);

      const result = await service.requestEmailOtp(email);

      expect(repository.requestEmailOtp).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should return error response when request fails', async () => {
      const email = 'invalid-email';
      repository.requestEmailOtp.mockResolvedValue(mockErrorResponse);

      const result = await service.requestEmailOtp(email);

      expect(repository.requestEmailOtp).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });

  describe('requestPhoneOtp', () => {
    it('should successfully request phone OTP with SMS channel', async () => {
      const phone = '+1234567890';
      const channel: IChannelData = { channel: 'sms' };
      repository.requestPhoneOtp.mockResolvedValue(mockAuthResponse);

      const result = await service.requestPhoneOtp(phone, channel);

      expect(repository.requestPhoneOtp).toHaveBeenCalledWith(phone, channel);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
      expect('session' in result && result.session).toBeDefined();
    });

    it('should successfully request phone OTP with WhatsApp channel', async () => {
      const phone = '+1234567890';
      const channel: IChannelData = { channel: 'whatsapp' };
      repository.requestPhoneOtp.mockResolvedValue(mockAuthResponse);

      const result = await service.requestPhoneOtp(phone, channel);

      expect(repository.requestPhoneOtp).toHaveBeenCalledWith(phone, channel);
      expect(result).toEqual(mockAuthResponse);
      expect('user' in result && result.user).toBeDefined();
    });

    it('should return error response when request fails', async () => {
      const phone = 'invalid-phone';
      const channel: IChannelData = { channel: 'sms' };
      repository.requestPhoneOtp.mockResolvedValue(mockErrorResponse);

      const result = await service.requestPhoneOtp(phone, channel);

      expect(repository.requestPhoneOtp).toHaveBeenCalledWith(phone, channel);
      expect(result).toEqual(mockErrorResponse);
      if ('error' in result) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe('Test error');
      }
    });
  });
});
