import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { GoogleOauthQueryDto, LoginByOTPDto, LoginByPasswordDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { ResponseUserDto } from 'src/users/dto/response-user.dro';
import { TokenService } from './token.service';
import { MailService } from 'src/utils/mail/mail.service';
import { OTP_EXPIRATION_TIME } from './constants';
import { User } from 'src/users/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {
    this.oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
  }

  async login(loginDto: LoginByPasswordDto | LoginByOTPDto, res: Response) {
    let user: User;
    if ('password' in loginDto) {
      user = await this.authenticateUserByPassword(loginDto);
    } else {
      user = await this.authenticateUserByOTP(loginDto);
    }

    const shortToken = await this.tokenService.createTokenByUser(user);
    this.tokenService.setShortTokenOnResponse(shortToken, res);

    if (loginDto.rememberMe) {
      const longToken = await this.tokenService.createTokenByUser(user);
      this.tokenService.setLongTokenOnResponse(longToken, res);
    }

    return res.status(200).json({ user: new ResponseUserDto(user) });
  }

  async logout(res: Response) {
    this.tokenService.removeTokenFromResponse(res);
    return res.status(200).json({ success: true });
  }

  async loginByGoogleOauthCode(googleOauthQueryDto: GoogleOauthQueryDto, res: Response) {
    const user = await this.authenticateUserByGoogleOauthCode(googleOauthQueryDto);
    const token = await this.tokenService.createTokenByUser(user);
    this.tokenService.setShortTokenOnResponse(token, res);

    const decodedState = decodeURIComponent(googleOauthQueryDto.state);

    const url = new URL(decodedState);
    const userInfo = new ResponseUserDto(user);
    url.searchParams.append('user_info', encodeURIComponent(JSON.stringify(userInfo)));
    url.searchParams.append('state', encodeURIComponent(JSON.stringify(userInfo)));

    res.header('Location', url.toString());

    return res.status(302).send();
  }

  async authenticateUserByPassword(loginDto: LoginByPasswordDto) {
    const user = await this.userService.findOneByField({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException(`User with email { ${loginDto.email} } not found`);
    }
    if (!(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException(`Incorrect password`);
    }

    return user;
  }

  async authenticateUserByOTP(loginDto: LoginByOTPDto) {
    const user = await this.userService.findOneByField({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException(`User with email { ${loginDto.email} } not found`);
    }

    if (user.otpCode !== loginDto.code) {
      throw new UnauthorizedException(`Invalid OTP`);
    }

    if (user.optExpiration < new Date()) {
      throw new UnauthorizedException(`OTP has expired`);
    }

    return user;
  }

  async authenticateUserByGoogleOauthCode(googleOauthQueryDto: GoogleOauthQueryDto) {
    let email: string;
    try {
      const { tokens } = await this.oauth2Client.getToken(googleOauthQueryDto.code);
      this.oauth2Client.setCredentials(tokens);

      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      email = payload.email;
    } catch {
      throw new InternalServerErrorException('Failed to authenticate with Google');
    }
    const user = await this.userService.findOneByField({ email: email });
    if (!user) {
      throw new UnauthorizedException(`User with email { ${email} } not found`);
    }
    return user;
  }

  async sendOtp(email: string) {
    const user = await this.userService.findOneByField({ email });
    if (!user) {
      throw new BadRequestException('Invalid email address');
    }

    const otp = this.generateOtp();
    this.userService.update(user.id, {
      otpCode: otp,
      optExpiration: new Date(Date.now() + OTP_EXPIRATION_TIME),
    });
    await this.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully' };
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async sendOtpEmail(email: string, otp: number) {
    this.mailService.sendEmail({
      to: email,
      subject: 'One-time Password (OTP)',
      text: `Your OTP is: ${otp}`,
    });
  }

  async getMe(req: Request) {
    let userId: string;
    try {
      userId = await this.tokenService.getUserIdFromToken(req);
    } catch (error) {
      userId = await this.tokenService.getUserIdFromToken(req, 'x-token');
    }
    const user = await this.userService.findOne(userId);
    return { user };
  }
}
