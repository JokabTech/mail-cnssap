import { Injectable } from '@angular/core';
import { Roles } from '../../shared/enums/roles-enum';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  build(role: string) {
    switch (role) {
      case Roles.DIRECTOR:
        return 'Directeur'
      case Roles.SENIOR_ASSISTANT:
        return 'Assistant Principal'
      case Roles.ADMIN_ASSISTANT:
        return 'Assistant Administratif'
      case Roles.MAIL_ARCHIVES_AGENT:
        return 'Agent Courrier et Archive'
      case Roles.EXECUTIVE_SECRETARY:
        return 'Secrétaire de direction'
      default:
        return 'Agent'
    }
  }

}
