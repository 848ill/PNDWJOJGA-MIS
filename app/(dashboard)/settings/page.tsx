// app/(dashboard)/settings/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionDiv } from "@/components/shared/MotionDiv";
import { 
  Settings, 
  Shield, 
  Users, 
  Database, 
  Bell, 
  Globe, 
  Lock, 
  HardDrive,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

// IMPORTANT: This page should only be accessible by 'system_admin' role.

async function getSystemSettings() {
  // This would typically fetch from a settings table in production
  return {
    applicationName: "PNDWJOGJA-MIS",
    applicationVersion: "1.0.0",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: "daily",
    sessionTimeout: 30,
    maxFileSize: 10,
    allowedFileTypes: ["pdf", "jpg", "png", "doc", "docx"],
    defaultLanguage: "id",
    timezone: "Asia/Jakarta",
    lastBackup: new Date().toISOString(),
    totalUsers: 0,
    totalComplaints: 0
  };
}

async function getSystemStats() {
  const supabase = createAdminSupabaseClient();
  
  try {
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: complaintsCount } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    return {
      totalUsers: usersCount || 0,
      totalComplaints: complaintsCount || 0
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      totalUsers: 0,
      totalComplaints: 0
    };
  }
}

function SettingsContent() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContentAsync />
    </Suspense>
  );
}

async function SettingsContentAsync() {
  const settings = await getSystemSettings();
  const stats = await getSystemStats();

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic application configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue={settings.applicationName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-version">Version</Label>
              <Input id="app-version" defaultValue={settings.applicationVersion} disabled />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select defaultValue={settings.defaultLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue={settings.timezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                  <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                  <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Maintenance Mode</Label>
              <div className="text-sm text-muted-foreground">
                Enable to prevent user access during system updates
              </div>
            </div>
            <Switch defaultChecked={settings.maintenanceMode} />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Configure user registration and account policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Allow User Registration</Label>
              <div className="text-sm text-muted-foreground">
                Allow new users to register accounts
              </div>
            </div>
            <Switch defaultChecked={settings.userRegistration} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input 
              id="session-timeout" 
              type="number" 
              defaultValue={settings.sessionTimeout} 
              min="5" 
              max="480" 
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Current Users</Label>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Registered accounts</div>
            </div>
            <div className="space-y-2">
              <Label>Total Complaints</Label>
              <div className="text-2xl font-bold">{stats.totalComplaints}</div>
              <div className="text-sm text-muted-foreground">Submitted reports</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security policies and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-password-length">Minimum Password Length</Label>
                <Input id="min-password-length" type="number" defaultValue="12" min="8" max="32" />
                <div className="text-xs text-muted-foreground">
                  Recommended: 12+ characters for strong security
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Special Characters</Label>
                  <div className="text-sm text-muted-foreground">
                    Force passwords to include special characters
                  </div>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable 2FA for admin accounts
                  </div>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" min="3" max="10" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                <Input id="lockout-duration" type="number" defaultValue="15" min="5" max="60" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">IP Whitelist</Label>
                  <div className="text-sm text-muted-foreground">
                    Restrict admin access by IP
                  </div>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Send email alerts for important events
              </div>
            </div>
            <Switch defaultChecked={settings.emailNotifications} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email Address</Label>
            <Input 
              id="admin-email" 
              type="email" 
              placeholder="admin@pndwjogja.go.id" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-template">Email Template</Label>
            <Textarea 
              id="notification-template" 
              placeholder="Enter custom email template..."
              rows={4}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={true} id="notify-new-complaints" />
              <Label htmlFor="notify-new-complaints" className="text-sm">New Complaints</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={true} id="notify-urgent" />
              <Label htmlFor="notify-urgent" className="text-sm">Urgent Issues</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={false} id="notify-system" />
              <Label htmlFor="notify-system" className="text-sm">System Events</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File & Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            File & Storage Settings
          </CardTitle>
          <CardDescription>Configure file upload and storage policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
              <Input 
                id="max-file-size" 
                type="number" 
                defaultValue={settings.maxFileSize} 
                min="1" 
                max="100" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowed-types">Allowed File Types</Label>
              <Input 
                id="allowed-types" 
                defaultValue={settings.allowedFileTypes.join(", ")} 
                placeholder="pdf, jpg, png, doc"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Automatic Backup</Label>
              <div className="text-sm text-muted-foreground">
                Automatically backup uploaded files
              </div>
            </div>
            <Switch defaultChecked={settings.autoBackup} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backup-frequency">Backup Frequency</Label>
            <Select defaultValue={settings.backupFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Last Backup</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(settings.lastBackup).toLocaleString('id-ID')}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API & Integration Settings
          </CardTitle>
          <CardDescription>Configure external integrations and API access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input 
                id="api-key" 
                type="password" 
                defaultValue="sk-1234567890abcdef" 
                readOnly
              />
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                Regenerate
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input 
              id="webhook-url" 
              type="url" 
              placeholder="https://your-app.com/webhook"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable API Access</Label>
              <div className="text-sm text-muted-foreground">
                Allow external applications to access data
              </div>
            </div>
            <Switch defaultChecked={false} />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium">Integration Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Google Maps API</span>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Supabase Database</span>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Email Service</span>
                </div>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Actions
          </CardTitle>
          <CardDescription>Perform system maintenance and administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <HardDrive className="h-6 w-6" />
              <span className="text-sm">Clear Cache</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="destructive" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">System Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <MotionDiv
      className="h-full flex-1 flex-col space-y-8 p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Pengaturan</h2>
          <p className="text-muted-foreground">
            Kelola konfigurasi sistem, keamanan, dan preferensi aplikasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Admin Only
          </Badge>
        </div>
      </div>

      <SettingsContent />
    </MotionDiv>
  );
}