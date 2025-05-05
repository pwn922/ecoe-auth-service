/*

import { Injectable } from '@nestjs/common';
import { GoogleService } from '../../infrastructure/google/google.service';
import { IUserRepositoryOutputPort } from 'src/auth/domain/ports/out/user.repository.out.port';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly googleService: GoogleService,
    private readonly userRepository: IUserRepositoryOutputPort,
  ) {}

  async loginWithGoogle(token: string, userType: string, teacherType?: string): Promise<any> {
    // 1. Validar token con Google
    const googleUser = await this.googleService.verifyToken(token);
    if (!googleUser) return { success: false, error: 'Token inválido' };

    // 2. Consultar usuario en la base de datos
    const user = await this.userRepository.findByEmail(googleUser.email);
    if (!user) return { success: false, error: 'Usuario no registrado' };

    // 3. Validar permisos según userType y teacherType
    if (userType === 'docente') {
        if (!user.getTeacherType() || user.getTeacherType() !== teacherType) {
          return { success: false, error: 'No tiene permisos de este tipo de docente' };
        }
      } else if (userType === 'estudiante' && user.getRole() !== 'estudiante') {
        return { success: false, error: 'No tiene permisos de estudiante' };
      }
  

    // 4. Retornar respuesta con la información del usuario
    const userPrimitives = user.toPrimitives();
    return {
      success: true,
      user: {
        id: userPrimitives.id,
        fullname: userPrimitives.fullname,
        email: userPrimitives.email,
        role: userPrimitives.role,
        teacherType: userPrimitives.teacherType,
      },
    };
  }
}
  */