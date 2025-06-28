// app/(dashboard)/it-support/page.tsx
// IMPORTANT: This page should only be accessible by 'system_admin' and 'it_support' roles.
export default function ITSupportPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">IT Support Tools Page</h1>
      <p>Tools and utilities for IT support personnel will be available here.</p>
    </div>
  );
}