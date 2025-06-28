// app/(dashboard)/settings/page.tsx
// IMPORTANT: This page should only be accessible by 'system_admin' role.
export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <p>System-wide configuration settings can be managed here.</p>
    </div>
  );
}