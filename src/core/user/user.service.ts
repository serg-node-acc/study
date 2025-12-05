import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {hash, verify} from "argon2";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password),
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await  this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new BadRequestException()
    }

    return user;
  }

  async checkPassword(password: string, newPassword: string) {
   return await verify(password, newPassword);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    console.log(updateUserDto)

    let isVerified: boolean
    if (updateUserDto.newPassword) {
      isVerified = await this.checkPassword(user.password, updateUserDto.oldPassword)
    }

    if(updateUserDto.newPassword && !isVerified) {
      throw new BadRequestException()
    }

    if (updateUserDto && isVerified) {
      user.password = await hash(updateUserDto.newPassword)
    }
    const { oldPassword, newPassword, ...updateDtoWithoutPassword} = updateUserDto

    if (updateUserDto.login) {
      user.login = updateUserDto.login
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...user
      },
      select: {
        login: true,
        email: true,
        id: true,
      }
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
