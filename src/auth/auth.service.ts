import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
    if (!givenUser) {
      throw new BadRequestException('Oops! Wrong Credentials');
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
      throw new BadRequestException('Oops! Wrong Credentials');
    } else {
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        givenUser.hashedPassword,
      );
      // return { message: 'login success' };
      if (isPasswordValid) {
        const payload = { sub: givenUser.id, email: givenUser.email };
        try {
          const jwt = this.jwtService.sign(payload);
          // const verify = this.jwtService.verify(jwt);
          return { message: jwt };
          // resp.c;
        } catch (error) {
          console.error('JWT signing error:', error);
        }

        // const jwt = await this.jwtService.signAsync(payload);
        // return { message: jwt };
      }
    }
  }
  // <--------------------------------------------------- Logout --------------------------------------------------->
  async logout() {
    return { message: 'for logout' };
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
