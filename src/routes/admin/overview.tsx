import { useNavigate } from 'react-router';
import { Users, ShieldAlert, ShieldCheck, LayoutGrid, Globe, ScrollText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAdminOverview } from '@/hooks/use-admin';

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-primary/70">{label}</CardTitle>
                <span className="text-text-primary/50">{icon}</span>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-semibold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );
}

export default function AdminOverview() {
    const navigate = useNavigate();
    const { data, loading, error } = useAdminOverview();

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Admin console</h1>
                    <p className="text-text-primary/60">Operator overview</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/admin/users')}>
                        <Users className="h-4 w-4 mr-2" /> Users
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/apps')}>
                        <LayoutGrid className="h-4 w-4 mr-2" /> Apps
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/billing')}>
                        Billing
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/audit')}>
                        <ScrollText className="h-4 w-4 mr-2" /> Audit log
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load overview</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full" />
                    ))}
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard label="Total users" value={data.totalUsers} icon={<Users className="h-5 w-5" />} />
                    <StatCard label="Suspended" value={data.suspendedUsers} icon={<ShieldAlert className="h-5 w-5" />} />
                    <StatCard label="Staff" value={data.staffUsers} icon={<ShieldCheck className="h-5 w-5" />} />
                    <StatCard label="Total apps" value={data.totalApps} icon={<LayoutGrid className="h-5 w-5" />} />
                    <StatCard label="Public apps" value={data.publicApps} icon={<Globe className="h-5 w-5" />} />
                </div>
            ) : null}
        </div>
    );
}
