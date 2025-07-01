-- Create audit_logs table for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action_time ON audit_logs(user_id, action, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Only system admins can read audit logs
CREATE POLICY "System admins can read audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name = 'system_admin'
    )
  );

-- Only the system (service role) can insert audit logs
CREATE POLICY "Service role can insert audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- No updates or deletes allowed (audit logs are immutable)
CREATE POLICY "No updates allowed" ON audit_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes allowed" ON audit_logs
  FOR DELETE
  USING (false);

-- Create a function to automatically clean up old audit logs (optional)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete audit logs older than 2 years (configurable)
  DELETE FROM audit_logs 
  WHERE timestamp < NOW() - INTERVAL '2 years';
END;
$$;

-- Create a view for audit log summary (for dashboard)
CREATE OR REPLACE VIEW audit_logs_summary AS
SELECT 
  action,
  resource_type,
  severity,
  COUNT(*) as count,
  MAX(timestamp) as last_occurrence,
  COUNT(DISTINCT user_id) as unique_users
FROM audit_logs 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY action, resource_type, severity
ORDER BY count DESC;

-- Grant necessary permissions
GRANT SELECT ON audit_logs_summary TO authenticated;

-- Comments for documentation
COMMENT ON TABLE audit_logs IS 'Security audit trail for all administrative actions';
COMMENT ON COLUMN audit_logs.user_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN audit_logs.user_email IS 'Email of the user (preserved even if user is deleted)';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (e.g., user_create, settings_update)';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected (e.g., user, settings, system)';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID of the specific resource affected';
COMMENT ON COLUMN audit_logs.details IS 'Additional context and metadata about the action';
COMMENT ON COLUMN audit_logs.severity IS 'Security impact level of the action';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Maintenance function to remove old audit logs'; 