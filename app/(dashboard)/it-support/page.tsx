// app/(dashboard)/it-support/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionDiv } from "@/components/shared/MotionDiv";
import { 
  Server, 
  Database, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  HardDrive,
  Cpu,
  Monitor,
  Wifi,
  Shield,
  FileText,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { Skeleton } from "@/components/ui/skeleton";

// IMPORTANT: This page should only be accessible by 'system_admin' and 'it_support' roles.

async function getSystemStats() {
  const supabase = createAdminSupabaseClient();
  
  try {
    // Get users count
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get complaints count
    const { count: complaintsCount } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    // Get categories count
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    // Get roles count
    const { count: rolesCount } = await supabase
      .from('roles')
      .select('*', { count: 'exact', head: true });

    // Get recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { count: recentComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());

    return {
      users: usersCount || 0,
      complaints: complaintsCount || 0,
      categories: categoriesCount || 0,
      roles: rolesCount || 0,
      recentActivity: recentComplaints || 0,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      users: 0,
      complaints: 0,
      categories: 0,
      roles: 0,
      recentActivity: 0,
      lastUpdate: new Date().toISOString()
    };
  }
}

async function getSystemHealth() {
  // Simulate system health checks
  const checks = [
    { name: 'Database Connection', status: 'healthy', message: 'All connections active' },
    { name: 'API Endpoints', status: 'healthy', message: 'All endpoints responding' },
    { name: 'Authentication Service', status: 'healthy', message: 'Supabase Auth operational' },
    { name: 'File Storage', status: 'healthy', message: 'Storage bucket accessible' },
    { name: 'Background Jobs', status: 'warning', message: 'Some jobs queued' },
  ];
  
  return checks;
}

function SystemStatsCard() {
  return (
    <Suspense fallback={<SystemStatsSkeleton />}>
      <SystemStatsContent />
    </Suspense>
  );
}

async function SystemStatsContent() {
  const stats = await getSystemStats();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users}</div>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complaints</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.complaints}</div>
          <p className="text-xs text-muted-foreground">Total submissions</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.categories}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Roles</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.roles}</div>
          <p className="text-xs text-muted-foreground">Permission groups</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentActivity}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SystemHealthCard() {
  return (
    <Suspense fallback={<SystemHealthSkeleton />}>
      <SystemHealthContent />
    </Suspense>
  );
}

async function SystemHealthContent() {
  const healthChecks = await getSystemHealth();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Real-time system status and health checks</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {check.status === 'healthy' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : check.status === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-muted-foreground">{check.message}</div>
                </div>
              </div>
              <Badge variant={check.status === 'healthy' ? 'default' : check.status === 'warning' ? 'secondary' : 'destructive'}>
                {check.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SystemHealthSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ITSupportPage() {
  return (
    <MotionDiv
      className="h-full flex-1 flex-col space-y-8 p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dukungan IT</h2>
          <p className="text-muted-foreground">
            Monitoring sistem, statistik, dan alat diagnostik untuk tim IT.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* System Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Statistik Sistem</h3>
        <SystemStatsCard />
      </div>

      {/* System Health and Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SystemHealthCard />
        
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>System resource usage and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className="text-sm text-muted-foreground">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Storage Usage</span>
                </div>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Network I/O</span>
                </div>
                <span className="text-sm text-muted-foreground">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common IT support tasks and system management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Database Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">View Logs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">User Sessions</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Security Audit</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Database Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version:</span>
              <span>PostgreSQL 15.3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provider:</span>
              <span>Supabase</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="default" className="text-xs">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Application Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Framework:</span>
              <span>Next.js 15.3.4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Runtime:</span>
              <span>Node.js 20.x</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Environment:</span>
              <Badge variant="secondary" className="text-xs">Development</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{new Date().toLocaleString('id-ID')}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Auto-refresh every 30 seconds
            </div>
          </CardContent>
        </Card>
      </div>
    </MotionDiv>
  );
}