import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client'
import { Shield, Search, Filter, Download, AlertTriangle, Info, AlertCircle, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface AuditLog {
  id: string
  user_email: string
  action: string
  resource_type: string
  resource_id?: string
  details: Record<string, unknown>
  ip_address?: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

async function getAuditLogs(filters: {
  limit?: number
  severity?: string
  action?: string
  searchTerm?: string
} = {}) {
  const supabase = createAdminSupabaseClient()
  
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })

  if (filters.severity && filters.severity !== 'all') {
    query = query.eq('severity', filters.severity)
  }

  if (filters.action && filters.action !== 'all') {
    query = query.eq('action', filters.action)
  }

  if (filters.searchTerm) {
    query = query.or(`user_email.ilike.%${filters.searchTerm}%,action.ilike.%${filters.searchTerm}%,resource_type.ilike.%${filters.searchTerm}%`)
  }

  const { data, error } = await query.limit(filters.limit || 100)

  if (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }

  return data as AuditLog[]
}

async function getAuditStats() {
  const supabase = createAdminSupabaseClient()

  const [
    { count: totalLogs },
    { count: criticalLogs },
    { count: recentLogs },
    { data: topActions }
  ] = await Promise.all([
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true })
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('audit_logs_summary').select('*').limit(5)
  ])

  return {
    totalLogs: totalLogs || 0,
    criticalLogs: criticalLogs || 0,
    recentLogs: recentLogs || 0,
    topActions: topActions || []
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="h-4 w-4" />
    case 'high':
      return <AlertCircle className="h-4 w-4" />
    case 'medium':
      return <Zap className="h-4 w-4" />
    case 'low':
    default:
      return <Info className="h-4 w-4" />
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'destructive'
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
    default:
      return 'secondary'
  }
}

function AuditLogsContent() {
  return (
    <Suspense fallback={<AuditLogsSkeleton />}>
      <AuditLogsContentAsync />
    </Suspense>
  )
}

async function AuditLogsContentAsync() {
  const [logs, stats] = await Promise.all([
    getAuditLogs(),
    getAuditStats()
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Security audit trail and administrative action monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All recorded actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalLogs}</div>
            <p className="text-xs text-muted-foreground">High-severity actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentLogs}</div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.topActions.reduce((acc, action) => acc + action.unique_users, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by user, action, or resource..." 
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="user_create">User Create</SelectItem>
                  <SelectItem value="user_update">User Update</SelectItem>
                  <SelectItem value="user_delete">User Delete</SelectItem>
                  <SelectItem value="settings_update">Settings Update</SelectItem>
                  <SelectItem value="security_config_change">Security Config</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
          <CardDescription>Chronological list of all administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: id })}
                  </TableCell>
                  <TableCell className="font-medium">{log.user_email}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {log.action}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.resource_type}</Badge>
                  </TableCell>
                  <TableCell>
                                         <Badge 
                       variant={getSeverityColor(log.severity) as "default" | "secondary" | "destructive" | "outline"}
                       className="flex items-center gap-1 w-fit"
                     >
                      {getSeverityIcon(log.severity)}
                      {log.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ip_address || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {JSON.stringify(log.details)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {logs.length === 0 && (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No audit logs found</h3>
              <p className="text-muted-foreground">
                No administrative actions have been recorded yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuditLogsPage() {
  return <AuditLogsContent />
} 