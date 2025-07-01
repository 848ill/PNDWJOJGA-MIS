import { createAdminSupabaseClient } from '@/lib/supabase/admin-client'

export interface AuditLogEntry {
  user_id: string
  user_email: string
  action: string
  resource_type: string
  resource_id?: string
  details: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class AuditLogger {
  private static instance: AuditLogger
  private supabase = createAdminSupabaseClient()

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  async logAction(entry: Omit<AuditLogEntry, 'timestamp'>) {
    try {
      const auditEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      }

      const { error } = await this.supabase
        .from('audit_logs')
        .insert([auditEntry])

      if (error) {
        console.error('Failed to log audit entry:', error)
        // Fallback to file logging if database fails
        await this.logToFile(auditEntry)
      }

      // Also log to console for immediate visibility
      console.log(`[AUDIT] ${entry.action} by ${entry.user_email} on ${entry.resource_type}`, entry.details)
      
    } catch (error) {
      console.error('Audit logging failed:', error)
      // Fallback to file logging
      await this.logToFile(entry as AuditLogEntry)
    }
  }

  private async logToFile(entry: AuditLogEntry) {
    // Fallback file logging (in production, use proper logging service)
    const logEntry = {
      timestamp: entry.timestamp || new Date().toISOString(),
      level: 'AUDIT',
      message: `${entry.action} by ${entry.user_email}`,
      meta: entry
    }
    
    // In production, replace with proper file logging or external service
    console.warn('[AUDIT FALLBACK]', JSON.stringify(logEntry))
  }

  // Predefined action types for consistency
  static readonly Actions = {
    USER_CREATE: 'user_create',
    USER_UPDATE: 'user_update',
    USER_DELETE: 'user_delete',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_PASSWORD_RESET: 'user_password_reset',
    ROLE_ASSIGN: 'role_assign',
    ROLE_REVOKE: 'role_revoke',
    SETTINGS_UPDATE: 'settings_update',
    BACKUP_CREATE: 'backup_create',
    BACKUP_RESTORE: 'backup_restore',
    SYSTEM_MAINTENANCE: 'system_maintenance',
    COMPLAINT_STATUS_CHANGE: 'complaint_status_change',
    DATA_EXPORT: 'data_export',
    SECURITY_CONFIG_CHANGE: 'security_config_change',
  } as const

  // Predefined resource types
  static readonly Resources = {
    USER: 'user',
    ROLE: 'role',
    COMPLAINT: 'complaint',
    SETTINGS: 'settings',
    SYSTEM: 'system',
    BACKUP: 'backup',
    AUDIT_LOG: 'audit_log',
  } as const
}

// Helper function for easy logging
export async function logAuditAction(
  action: string,
  user: { id: string; email: string },
  resourceType: string,
  details: Record<string, unknown> = {},
  options: {
    resourceId?: string
    severity?: AuditLogEntry['severity']
    ipAddress?: string
    userAgent?: string
  } = {}
) {
  const logger = AuditLogger.getInstance()
  
  await logger.logAction({
    user_id: user.id,
    user_email: user.email,
    action,
    resource_type: resourceType,
    resource_id: options.resourceId,
    details,
    ip_address: options.ipAddress,
    user_agent: options.userAgent,
    severity: options.severity || 'medium',
  })
}

// Example usage functions
export const auditHelpers = {
  async logUserCreation(adminUser: { id: string; email: string }, newUser: { id: string; email: string; role: string }) {
    await logAuditAction(
      AuditLogger.Actions.USER_CREATE,
      adminUser,
      AuditLogger.Resources.USER,
      { 
        new_user_id: newUser.id,
        new_user_email: newUser.email,
        assigned_role: newUser.role
      },
      { resourceId: newUser.id, severity: 'medium' }
    )
  },

  async logSettingsChange(adminUser: { id: string; email: string }, settingsChanged: Record<string, unknown>) {
    await logAuditAction(
      AuditLogger.Actions.SETTINGS_UPDATE,
      adminUser,
      AuditLogger.Resources.SETTINGS,
      { settings_changed: settingsChanged },
      { severity: 'high' }
    )
  },

  async logSecurityConfigChange(adminUser: { id: string; email: string }, configType: string, changes: Record<string, unknown>) {
    await logAuditAction(
      AuditLogger.Actions.SECURITY_CONFIG_CHANGE,
      adminUser,
      AuditLogger.Resources.SYSTEM,
      { 
        config_type: configType,
        changes: changes
      },
      { severity: 'critical' }
    )
  }
} 