import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
// import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  // <--------------------------------------------------- Signup --------------------------------------------------->
  async signup(authDto: AuthDto) {
    const { email, password } = authDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const givenUser = await this.prisma.user.findUnique({ where: { email } });
    if (givenUser) {
      throw new BadRequestException('Oops! Wrong Credentials, signup error');
    }
    await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
    return { message: 'for signup' };
  }
  // <--------------------------------------------------- Login --------------------------------------------------->
  async login(authDto: AuthDto, req: Request, resp: Response) {
    const { email, password } = authDto;
    const givenUser = await this.prisma.user.findUnique({ where: { email } });
    if (!givenUser) {
      throw new BadRequestException('Oops! No such user in database');
    } else {
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        givenUser.hashedPassword,
      );
      if (isPasswordValid) {
        const payload = { sub: givenUser.id, email: givenUser.email };
        try {
          const jwt = this.jwtService.sign(payload);
          // const verify = this.jwtService.verify(jwt);
          // console.log(verify);
          resp.cookie('userToken', jwt, {
            expires: new Date(new Date().getTime() + 6 * 3600 * 1000),
            httpOnly: true,
          });
          return { message: 'login success with cookie' };
        } catch (error) {
          console.error('JWT signing error:', error);
        }
      }
    }
  }
  // <--------------------------------------------------- Logout --------------------------------------------------->
  async logout(@Req() req: Request, @Res() resp: Response) {
    resp.clearCookie('userToken');
    return resp.send({ message: 'logout success' });
  }

  // <--------------------------------------------------- Boilerplate generated --------------------------------------------------->

  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  //
  // findAll() {
  //   return `This action returns all auth`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
